import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const EstimateFormSection: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [copyStatus, setCopyStatus] = useState('Copy email');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recaptchaReady, setRecaptchaReady] = useState(false);

    // Load reCAPTCHA script
    useEffect(() => {
        const loadRecaptcha = () => {
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?render=6LfxaAgsAAAAAJTKIPVyxWudrVLEpBHsOi0DD2oy';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                setRecaptchaReady(true);
            };
            document.head.appendChild(script);
        };

        if (!window.grecaptcha) {
            loadRecaptcha();
        } else {
            setRecaptchaReady(true);
        }
    }, []);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('info@fourfrontit.com');
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy email'), 2000);
    };

    const getRecaptchaToken = async (): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!window.grecaptcha) {
                reject(new Error('reCAPTCHA not loaded'));
                return;
            }

            window.grecaptcha.ready(() => {
                window.grecaptcha.execute('6LfxaAgsAAAAAJTKIPVyxWudrVLEpBHsOi0DD2oy', { action: 'submit' })
                    .then((token: string) => {
                        resolve(token);
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Get reCAPTCHA token
            let recaptchaToken = '';
            if (recaptchaReady) {
                try {
                    recaptchaToken = await getRecaptchaToken();
                    console.log('reCAPTCHA token obtained:', recaptchaToken);
                } catch (error) {
                    console.warn('reCAPTCHA failed, proceeding without it:', error);
                }
            }

            const formData: any = {
                name: name,
                email: email,
                phone: phone,
                message: message,
                _subject: `New Contact Form Submission from ${name}`
            };

            // Add reCAPTCHA token if available
            if (recaptchaToken) {
                formData['g-recaptcha-response'] = recaptchaToken;
            }

            console.log('Submitting form data:', formData);

            const response = await fetch('https://formspree.io/f/mnnlqqqb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Thank you for your message! We will get back to you shortly.');
                setName('');
                setEmail('');
                setPhone('');
                setMessage('');
            } else {
                const errorData = await response.text();
                console.error('Form submission failed:', errorData);
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Sorry, there was an error sending your message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact-us-section" className="bg-slate-900/70 py-16 animate-fade-in-up" style={{ animationDelay: '600ms', opacity: 0 }}>
            <div className="container mx-auto px-6">
                <div className="bg-slate-800/50 rounded-xl p-8 lg:p-12 border border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {/* Left: Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none transition-shadow form-input-glow"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none transition-shadow form-input-glow"
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none transition-shadow form-input-glow"
                        />
                        <textarea
                            placeholder="How can we help?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={4}
                            className="w-full bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none transition-shadow resize-none form-input-glow"
                        ></textarea>
                        
                        {/* reCAPTCHA Badge - This will be automatically added by Google */}
                        <div className="text-xs text-slate-400 text-center">
                            This site is protected by reCAPTCHA and the Google 
                            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline mx-1">Privacy Policy</a> and
                            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline mx-1">Terms of Service</a> apply.
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send message'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCopyEmail}
                                className="border border-slate-600 text-slate-300 font-semibold px-6 py-3 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-colors duration-300"
                            >
                                {copyStatus}
                            </button>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">
                            Or email us at <a href="mailto:info@fourfrontit.com" className="text-cyan-400 hover:underline">info@fourfrontit.com</a>
                        </p>
                    </form>

                    {/* Right: Estimate */}
                    <div className="text-slate-300">
                        <h3 className="text-lg font-semibold text-white">Estimate</h3>
                        <p className="text-5xl lg:text-6xl font-bold text-cyan-400 my-2">$2,000</p>
                        <p className="text-slate-400 max-w-sm">
                            Typical monthly starting price for SMB managed services — custom quotes available.
                        </p>
                        <h4 className="text-lg font-semibold text-white mt-6 mb-3">What's included</h4>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            <li>24/7 monitoring</li>
                            <li>Patch management</li>
                            <li>Security & backups</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EstimateFormSection;
