import React, { useState } from 'react';

const EstimateFormSection: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [copyStatus, setCopyStatus] = useState('Copy email');

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('info@fourfrontit.com');
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy email'), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for form submission logic
        alert('Thank you for your message! We will get back to you shortly.');
        setName('');
        setEmail('');
        setMessage('');
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
                        <textarea
                            placeholder="How can we help?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={4}
                            className="w-full bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none transition-shadow resize-none form-input-glow"
                        ></textarea>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                             <button
                                type="submit"
                                className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Send message
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
