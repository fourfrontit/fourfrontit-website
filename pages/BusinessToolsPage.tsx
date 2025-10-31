import React, { useState, useCallback } from 'react';
import { GoogleGenAI, GroundingChunk } from '@google/genai';

type Tool = 'search' | 'analysis' | 'image';
type SearchType = 'web' | 'maps';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none ${
            active ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);

const GroundedSearchTool: React.FC = () => {
    const [searchType, setSearchType] = useState<SearchType>('web');
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState('');
    const [sources, setSources] = useState<GroundingChunk[]>([]);

    const handleSearch = async () => {
        if (!query) {
            setError('Please enter a query.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult('');
        setSources([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            let config: any = {
                tools: searchType === 'web' ? [{ googleSearch: {} }] : [{ googleMaps: {} }]
            };

            if (searchType === 'maps') {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                config.toolConfig = {
                    retrievalConfig: {
                        latLng: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }
                    }
                }
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: query,
                config,
            });
            
            setResult(response.text);
            if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                setSources(response.candidates[0].groundingMetadata.groundingChunks);
            }

        } catch (err) {
            console.error(err);
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex space-x-2 mb-4">
                <button onClick={() => setSearchType('web')} className={`px-4 py-2 rounded-lg text-sm ${searchType === 'web' ? 'bg-blue-600 text-white' : 'bg-gray-600'}`}>Web Search</button>
                <button onClick={() => setSearchType('maps')} className={`px-4 py-2 rounded-lg text-sm ${searchType === 'maps' ? 'bg-blue-600 text-white' : 'bg-gray-600'}`}>Local Search (Maps)</button>
            </div>
            <textarea
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none form-input-glow transition-shadow"
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchType === 'web' ? 'e.g., Who won the latest F1 race?' : 'e.g., Find top-rated coffee shops nearby'}
            />
            <button onClick={handleSearch} disabled={isLoading} className="mt-4 bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 flex items-center justify-center">
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                    </>
                ) : 'Search'}
            </button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
            <div className="mt-6">
                {isLoading && (
                    <div className="flex justify-center items-center h-48 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
                    </div>
                )}
                {!isLoading && result && (
                    <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg animate-fade-in">
                        <h4 className="font-bold text-lg mb-2">Response:</h4>
                        <p className="whitespace-pre-wrap">{result}</p>
                        {sources.length > 0 && (
                            <div className="mt-4">
                                <h5 className="font-semibold mb-2">Sources:</h5>
                                <ul className="list-disc list-inside text-sm">
                                    {sources.map((source, index) => (
                                        <li key={index}>
                                            <a href={source.web?.uri || source.maps?.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                {source.web?.title || source.maps?.title || 'Source Link'}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


const AnalysisTool: React.FC = () => {
    const [proQuery, setProQuery] = useState('');
    const [liteQuery, setLiteQuery] = useState('');
    const [proResult, setProResult] = useState('');
    const [liteResult, setLiteResult] = useState('');
    const [isProLoading, setIsProLoading] = useState(false);
    const [isLiteLoading, setIsLiteLoading] = useState(false);
    const [proError, setProError] = useState('');
    const [liteError, setLiteError] = useState('');

    const handleProAnalysis = async () => {
        setIsProLoading(true);
        setProError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: proQuery,
                config: {
                    thinkingConfig: { thinkingBudget: 32768 }
                }
            });
            setProResult(response.text);
        } catch (err) {
            setProError((err as Error).message);
        } finally {
            setIsProLoading(false);
        }
    };
    
    const handleLiteAnalysis = async () => {
        setIsLiteLoading(true);
        setLiteError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                // FIX: Use the recommended model name for Gemini Flash Lite.
                model: 'gemini-flash-lite-latest',
                contents: liteQuery
            });
            setLiteResult(response.text);
        } catch (err) {
            setLiteError((err as Error).message);
        } finally {
            setIsLiteLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h4 className="font-bold text-lg mb-2 text-blue-400">Complex Strategic Analysis</h4>
                <p className="text-sm text-gray-400 mb-4">For your most complex queries. Uses Gemini 2.5 Pro with max thinking budget.</p>
                <textarea
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none form-input-glow transition-shadow"
                    rows={6}
                    value={proQuery}
                    onChange={(e) => setProQuery(e.target.value)}
                    placeholder="e.g., Draft a 5-year IT infrastructure scaling plan..."
                />
                <button onClick={handleProAnalysis} disabled={isProLoading} className="mt-4 bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-500">
                    {isProLoading ? 'Thinking...' : 'Analyze'}
                </button>
                {proError && <p className="text-red-400 mt-4">{proError}</p>}
                {proResult && <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg whitespace-pre-wrap">{proResult}</div>}
            </div>
            <div>
                <h4 className="font-bold text-lg mb-2 text-cyan-400">Rapid Content Review</h4>
                 <p className="text-sm text-gray-400 mb-4">For fast summaries and edits. Uses the low-latency Gemini 2.5 Flash Lite.</p>
                <textarea
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none form-input-glow transition-shadow"
                    rows={6}
                    value={liteQuery}
                    onChange={(e) => setLiteQuery(e.target.value)}
                    placeholder="e.g., Summarize the following article..."
                />
                <button onClick={handleLiteAnalysis} disabled={isLiteLoading} className="mt-4 bg-cyan-600 px-6 py-2 rounded-lg hover:bg-cyan-700 disabled:bg-gray-500">
                    {isLiteLoading ? 'Analyzing...' : 'Review'}
                </button>
                {liteError && <p className="text-red-400 mt-4">{liteError}</p>}
                {liteResult && <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg whitespace-pre-wrap">{liteResult}</div>}
            </div>
        </div>
    );
};

const ImageGenerationTool: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageKey, setImageKey] = useState(0);

    const generateImage = async () => {
        if (!prompt) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError('');
        setImageUrl('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: aspectRatio,
                },
            });
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            setImageUrl(`data:image/jpeg;base64,${base64ImageBytes}`);
            setImageKey(prev => prev + 1); // Reset animation
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <textarea
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none form-input-glow transition-shadow"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A photorealistic image of a futuristic server room..."
            />
            <div className="my-4">
                <label className="font-semibold mr-4">Aspect Ratio:</label>
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 form-input-glow transition-shadow">
                    <option value="1:1">1:1 (Square)</option>
                    <option value="16:9">16:9 (Widescreen)</option>
                    <option value="9:16">9:16 (Portrait)</option>
                    <option value="4:3">4:3 (Landscape)</option>
                    <option value="3:4">3:4 (Portrait)</option>
                </select>
            </div>
            <button onClick={generateImage} disabled={isLoading} className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-500">
                {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
            <div className="mt-6">
                {isLoading && <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div></div>}
                {imageUrl && <div key={imageKey} className="image-shimmer-reveal"><img src={imageUrl} alt="Generated asset" className="rounded-lg shadow-lg max-w-full h-auto mx-auto" /></div>}
            </div>
        </div>
    );
};


const BusinessToolsPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('search');

  const renderTool = () => {
    switch (activeTool) {
      case 'search': return <GroundedSearchTool />;
      case 'analysis': return <AnalysisTool />;
      case 'image': return <ImageGenerationTool />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-2">AI-Powered Business Tools</h2>
      <p className="text-gray-400 text-center mb-8">Leverage cutting-edge AI for research, analysis, and asset creation.</p>
      <div className="flex border-b border-gray-700 mb-6">
        <TabButton active={activeTool === 'search'} onClick={() => setActiveTool('search')}>Grounded Search</TabButton>
        <TabButton active={activeTool === 'analysis'} onClick={() => setActiveTool('analysis')}>Advanced Analysis</TabButton>
        <TabButton active={activeTool === 'image'} onClick={() => setActiveTool('image')}>Image Generation</TabButton>
      </div>
      <div key={activeTool} className="bg-gray-800/50 p-6 rounded-b-lg rounded-r-lg border-t-0 border border-gray-700 animate-fade-in-up">
        {renderTool()}
      </div>
    </div>
  );
};

export default BusinessToolsPage;