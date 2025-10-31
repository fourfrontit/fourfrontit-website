import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from '@google/genai';
import { MicIcon, StopIcon } from '../constants';
import { encode, decode, decodeAudioData } from '../utils/audio';

// Visualizer component
const AudioVisualizer: React.FC<{ analyser: AnalyserNode | null; isListening: boolean }> = ({ analyser, isListening }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(31, 41, 55)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        canvasCtx.fillStyle = `rgba(59, 130, 246, ${barHeight / 128})`;
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    if (isListening) {
      draw();
    } else {
      canvasCtx.fillStyle = 'rgb(31, 41, 55)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [analyser, isListening]);

  return <canvas ref={canvasRef} width="300" height="75" className="rounded-lg" />;
};


const LiveAssistantPage: React.FC = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState('Idle. Press Start to connect.');
    const [transcripts, setTranscripts] = useState<{ user?: string; model?: string }[]>([]);
    
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const currentInputTranscription = useRef('');
    const currentOutputTranscription = useRef('');

    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    
    const stopConversation = useCallback(async () => {
        setStatus('Disconnecting...');
        if (sessionPromiseRef.current) {
            try {
                const session = await sessionPromiseRef.current;
                session.close();
            } catch (error) {
                console.error("Error closing session:", error);
            }
        }
        
        scriptProcessorRef.current?.disconnect();
        mediaStreamSourceRef.current?.disconnect();
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        
        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();

        sessionPromiseRef.current = null;
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;
        mediaStreamRef.current = null;
        scriptProcessorRef.current = null;
        mediaStreamSourceRef.current = null;
        setAnalyser(null);
        
        setIsActive(false);
        setIsConnecting(false);
        setStatus('Disconnected. Press Start to connect.');
    }, []);

    const startConversation = async () => {
        setIsConnecting(true);
        setStatus('Requesting permissions and connecting...');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            // FIX: Cast window to `any` to access vendor-prefixed `webkitAudioContext` for broader browser support.
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            // FIX: Cast window to `any` to access vendor-prefixed `webkitAudioContext` for broader browser support.
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            const inputAnalyser = inputAudioContextRef.current.createAnalyser();
            setAnalyser(inputAnalyser);

            let nextStartTime = 0;
            const sources = new Set<AudioBufferSourceNode>();

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setIsConnecting(false);
                        setIsActive(true);
                        setStatus('Connected. Start speaking.');
                        
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        mediaStreamSourceRef.current = source;
                        
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };

                            if (sessionPromiseRef.current) {
                                sessionPromiseRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        source.connect(inputAnalyser);
                        inputAnalyser.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscription.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription.current += message.serverContent.outputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            setTranscripts(prev => [...prev, {
                                user: currentInputTranscription.current.trim(),
                                model: currentOutputTranscription.current.trim(),
                            }]);
                            currentInputTranscription.current = '';
                            currentOutputTranscription.current = '';
                        }
                        
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio) {
                            nextStartTime = Math.max(nextStartTime, outputAudioContextRef.current!.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current!, 24000, 1);
                            const source = outputAudioContextRef.current!.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContextRef.current!.destination);
                            source.addEventListener('ended', () => sources.delete(source));
                            source.start(nextStartTime);
                            nextStartTime += audioBuffer.duration;
                            sources.add(source);
                        }
                        if(message.serverContent?.interrupted){
                             for (const source of sources.values()) {
                                source.stop();
                                sources.delete(source);
                            }
                            nextStartTime = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Connection Error:', e);
                        setStatus(`Error: ${e.message}. Please try again.`);
                        stopConversation();
                    },
                    onclose: (e: CloseEvent) => {
                        setStatus('Connection closed. Press Start to reconnect.');
                        stopConversation();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: 'You are a friendly and helpful customer support agent for FourFront IT, an MSP. Keep your answers concise and professional.',
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
            });

        } catch (error) {
            console.error("Failed to start conversation:", error);
            setStatus(`Error: ${(error as Error).message}. Check microphone permissions.`);
            setIsConnecting(false);
        }
    };
    
    useEffect(() => {
        return () => {
            if(isActive || isConnecting) stopConversation();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleButtonClick = () => {
        if (isActive || isConnecting) {
            stopConversation();
        } else {
            startConversation();
        }
    };
    
    const isLive = isActive && !isConnecting;
    const isStatusActive = isConnecting || isActive;

    return (
        <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-xl max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-400 mb-2">Live AI Assistant</h2>
            <p className="text-gray-400 mb-6">Have a real-time voice conversation with our Gemini-powered assistant.</p>
            
            <div className="w-full flex flex-col items-center bg-gray-900 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-4 mb-4">
                    <button
                        onClick={handleButtonClick}
                        disabled={isConnecting}
                        className={`flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
                            isLive ? 'bg-red-600 hover:bg-red-700 animate-pulse-live' : 'bg-blue-600 hover:bg-blue-700'
                        } text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:bg-gray-500 disabled:cursor-wait`}
                    >
                        {isConnecting ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div> : (isActive ? <StopIcon className="w-10 h-10"/> : <MicIcon className="w-10 h-10"/>)}
                    </button>
                    <div>
                        <AudioVisualizer analyser={analyser} isListening={isActive} />
                        <p className={`text-center font-mono text-sm mt-2 transition-colors ${isStatusActive ? 'text-cyan-400 animate-gentle-pulse' : 'text-gray-400'}`}>{status}</p>
                    </div>
                </div>

                <div className="w-full h-64 bg-gray-800 rounded-lg p-4 overflow-y-auto border border-gray-600">
                    {transcripts.length === 0 && <p className="text-gray-500 text-center mt-8">Conversation transcripts will appear here...</p>}
                    {transcripts.map((t, i) => (
                        <div key={i} className="mb-4 animate-fade-in-up">
                            {t.user && <p><strong className="text-blue-400">You:</strong> {t.user}</p>}
                            {t.model && <p><strong className="text-cyan-400">Assistant:</strong> {t.model}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LiveAssistantPage;
