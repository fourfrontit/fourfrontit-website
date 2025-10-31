import React from 'react';
import { ManagedITIcon, AutomationIcon, CloudIcon, ShieldIcon } from '../constants';

const ServiceCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="group bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:border-blue-400/50 h-full relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative flex flex-col items-center h-full">
            <div className="mb-4 text-blue-400 transition-transform duration-300 group-hover:scale-110">{icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm flex-grow">{description}</p>
        </div>
    </div>
);

const ServicesPage: React.FC = () => {
    const services = [
        {
            icon: <ManagedITIcon className="w-12 h-12" />,
            title: 'Managed IT Services',
            description: 'Comprehensive IT management, 24/7 monitoring, and proactive support to keep your systems running smoothly and securely.'
        },
        {
            icon: <AutomationIcon className="w-12 h-12" />,
            title: 'Automation & AI Ops',
            description: 'Leverage AI and automation to streamline your operations, reduce manual tasks, and increase efficiency across your business.'
        },
        {
            icon: <CloudIcon className="w-12 h-12" />,
            title: 'Cloud Solutions',
            description: 'Scalable and secure cloud infrastructure design, migration, and management to empower your modern business needs.'
        },
        {
            icon: <ShieldIcon className="w-12 h-12" />,
            title: 'Cybersecurity',
            description: 'Protect your critical assets with advanced security solutions, including threat detection, risk management, and compliance.'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto py-12">
            <h2 className="text-4xl font-bold text-center text-white mb-4 animate-fade-in-up">Our Core Services</h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
                We provide tailored, automation-first solutions to help MSPs and modern businesses scale, innovate, and secure their operations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, index) => (
                    <div key={service.title} className="animate-fade-in-up h-full" style={{ opacity: 0, animationDelay: `${200 + index * 150}ms`}}>
                        <ServiceCard {...service} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesPage;
