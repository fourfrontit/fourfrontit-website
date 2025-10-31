import React, { useState, useEffect, useRef } from 'react';
import { DiscoverIcon, DesignIcon, DeliverIcon, DocumentIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '../constants';
import { Project } from '../types';

const projectsData: Project[] = [
    { title: 'Domain Upgrades & FSMO Role Migrations', badge: 'Standard', description: 'Promote new DCs, transfer FSMO roles, decommission legacy.', fullDescription: 'This project provides a seamless and secure migration of your Active Directory domain controllers. We handle the entire process, from building new-generation DCs to carefully transferring all FSMO roles (PDC Emulator, RID Master, etc.), ensuring SYSVOL/DFSR replication is healthy, and finally, safely decommissioning your old servers to modernize your infrastructure.', features: ['New DC build', 'FSMO transfer', 'SYSVOL/DFSR checks', 'Decommission legacy DCs'], price: '$65/hr' },
    { title: 'Active Directory Repair & Health Checks', badge: 'Standard', description: 'Fix replication, DNS, stale objects; before/after evidence.', fullDescription: "This service is a deep-dive health assessment for your Active Directory. We use tools like repadmin and dcdiag to identify and resolve critical issues such as replication failures, DNS misconfigurations, and stale object clutter. We establish a GPO baseline for security and consistency, and provide detailed before-and-after evidence to validate the repairs and improvements.", features: ['repadmin/dcdiag', 'DNS cleanup', 'GPO baseline', 'Object hygiene'], price: '$65/hr' },
    { title: 'Hyper-V Virtualization Implementation', badge: 'Advanced', description: 'Hosts, virtual switches, VMs, backups, optional clustering.', fullDescription: "Our Hyper-V implementation service covers the entire virtualization stack. We begin with the physical host installation and configuration, set up virtual switches with proper VLAN tagging for network segmentation, build your virtual machines to specification, and optionally configure high-availability clustering or replication for disaster recovery, ensuring a robust and resilient virtual environment.", features: ['Host install', 'vSwitch/VLANs', 'VM builds', 'Cluster/Replica (opt)'], price: '$80/hr' },
    { title: 'VMware ESXi Implementation', badge: 'Advanced', description: 'ESXi, networking, storage, VMs; optional vCenter/HA/DRS.', fullDescription: "Get a production-ready VMware environment with our end-to-end ESXi implementation. We handle the ESXi host installation, configure vSwitches and VLANs for optimal networking, provision and manage datastores for efficient storage, and build your VMs. For enhanced management and resilience, we can optionally deploy and configure vCenter Server for centralized control, along with High Availability (HA) and Distributed Resource Scheduler (DRS).", features: ['ESXi install', 'vSwitch/VLANs', 'Datastores', 'vCenter/HA (opt)'], price: '$80/hr' },
    { title: 'VMware ↔ Hyper-V Migration', badge: 'Advanced', description: 'Cross-hypervisor migration with tests, rollback, documentation.', fullDescription: "This project is designed for a seamless cross-hypervisor migration between VMware and Hyper-V platforms. The process starts with a thorough discovery and planning phase to map dependencies. We perform a test run to validate the process, followed by a scheduled cutover designed for minimal downtime. Comprehensive rollback plans and post-migration evidence are provided for your peace of mind.", features: ['Discovery & plan', 'Test run', 'Cutover', 'Rollback & evidence'], price: '$80/hr' },
    { title: 'Remote Desktop Services (RDS) Setup', badge: 'Advanced', description: 'Broker, Hosts, Gateway/SSL, collections, policies.', fullDescription: "We deploy a complete Remote Desktop Services environment tailored to your needs. This includes setting up the necessary roles like Connection Broker and Session Hosts, configuring the RD Gateway with an SSL certificate for secure external access, creating application collections, and implementing Group Policy Objects (GPOs) for system hardening and user profile management.", features: ['Roles deploy', 'Gateway + SSL', 'Collections', 'GPO hardening'], price: '$80/hr' },
    { title: 'Azure Virtual Desktop (AVD)', badge: 'Premium', description: 'Host pools, FSLogix, Conditional Access, autoscale, monitoring.', fullDescription: "Launch a scalable and secure Azure Virtual Desktop environment. We configure host pools for your user workloads, implement FSLogix for persistent user profiles, secure access with Conditional Access and Multi-Factor Authentication (MFA), and set up autoscale rules and monitoring to optimize performance and cost.", features: ['Host pools', 'FSLogix', 'CA + MFA', 'Autoscale & monitor'], price: '$95/hr' },
    { title: 'Microsoft 365 Security Hardening', badge: 'Premium', description: 'MFA, Conditional Access, mail hygiene, sharing controls, audit.', fullDescription: "Strengthen your Microsoft 365 tenant against modern threats. We enforce Multi-Factor Authentication (MFA) and configure Conditional Access policies to control access, improve your mail hygiene to block spam and phishing, set up secure file sharing controls to prevent data leaks, and configure audit logging and alerts for ongoing visibility.", features: ['MFA + CA', 'Mail hygiene', 'Sharing controls', 'Audit & alerts'], price: '$95/hr' },
    { title: 'RMM Onboarding & Optimization', badge: 'Advanced', description: 'Agent rollout, policy baselines, alert tuning, reporting.', fullDescription: "Optimize your Remote Monitoring and Management (RMM) platform for peak efficiency. We manage the agent rollout across your client endpoints, establish standardized policy baselines for consistency, perform alert tuning to reduce noise and focus on actionable events, and create custom reports and runbooks for your team.", features: ['Agent rollout', 'Policies', 'Alert tuning', 'Reports & runbooks'], price: '$80/hr' },
    { title: 'Patch Compliance Audit & Reporting', badge: 'Audit', description: 'OS + 3rd-party patch status, gaps, remediation roadmap.', fullDescription: "Gain full visibility into your patching posture with our compliance audit. We perform a comprehensive scan for both OS and third-party application patch status across your environment. The deliverable is a detailed gap analysis, an executive-level report summarizing risk, and a clear, actionable remediation plan to bring your systems into compliance.", features: ['Compliance scan', 'Gap analysis', 'Exec report', 'Remediation plan'], price: 'Fixed $800' },
    { title: 'Backup & DR Validation', badge: 'Audit', description: 'Test restores; RPO/RTO review; evidence.', fullDescription: "Don't just assume your backups work—validate them. This service involves performing test restores of key systems to ensure data integrity. We review your Recovery Point Objectives (RPO) and Recovery Time Objectives (RTO) against real-world performance and provide a complete evidence pack and a list of recommendations for improvement.", features: ['Test restores', 'RPO/RTO review', 'Evidence pack', 'Recommendations'], price: 'Fixed $1,000' },
    { title: 'AD Health Check (Focused)', badge: 'Audit', description: 'Single-domain assessment with concise risk report.', fullDescription: "A targeted health check for a single Active Directory domain. We run key diagnostics (dcdiag/repadmin), review critical DNS and GPO settings, and deliver a concise, easy-to-understand risk report that highlights pressing issues and suggests remediation steps, perfect for a quick health snapshot.", features: ['dcdiag/repadmin', 'DNS review', 'GPO review', 'Risk report'], price: 'Fixed $650' },
];

const badgeColorMap: { [key in Project['badge']]: string } = {
    Standard: 'bg-slate-600 text-slate-200',
    Advanced: 'bg-purple-600/90 text-purple-100',
    Premium: 'bg-sky-500/90 text-sky-100',
    Audit: 'bg-emerald-600/90 text-emerald-100',
};

const QuestionnaireModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Thank you for your inquiry about "${project.title}". We will contact you shortly.`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <header className="p-4 flex justify-between items-center border-b border-slate-700">
                    <div>
                        <h2 className="text-lg font-bold text-white">{project.title} – Questionnaire</h2>
                        <p className="text-sm text-slate-400">Please complete this form to help us validate scope and risks.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700"><CloseIcon className="w-5 h-5"/></button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" placeholder="Your name" required className="form-input-glow bg-slate-800 border-slate-700 rounded-md p-2" />
                        <input type="email" placeholder="Work email" required className="form-input-glow bg-slate-800 border-slate-700 rounded-md p-2" />
                        <input type="text" placeholder="Company / MSP" required className="form-input-glow bg-slate-800 border-slate-700 rounded-md p-2" />
                        <input type="tel" placeholder="Phone (optional)" className="form-input-glow bg-slate-800 border-slate-700 rounded-md p-2" />
                    </div>
                    <textarea placeholder="Environment overview (versions, platforms, number of servers/users)" rows={3} className="w-full form-input-glow bg-slate-800 border-slate-700 rounded-md p-2"></textarea>
                    <textarea placeholder="Access & licensing available (admin creds, OS/M365/hypervisor licenses)" rows={3} className="w-full form-input-glow bg-slate-800 border-slate-700 rounded-md p-2"></textarea>
                    <textarea placeholder="Business requirements & downtime window" rows={3} className="w-full form-input-glow bg-slate-800 border-slate-700 rounded-md p-2"></textarea>
                    <div>
                        <label className="text-slate-300 font-semibold text-sm">Key items (tick those you need):</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {project.features.map(feature => (
                                <label key={feature} className="flex items-center space-x-2 text-slate-400 text-sm">
                                    <input type="checkbox" className="bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-500 rounded" />
                                    <span>{feature}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                     <textarea placeholder="Anything else we should know?" rows={3} className="w-full form-input-glow bg-slate-800 border-slate-700 rounded-md p-2"></textarea>
                </form>
                <footer className="p-4 flex justify-end items-center gap-3 border-t border-slate-700 bg-slate-900/50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity">Send</button>
                </footer>
            </div>
        </div>
    );
};

const ProjectDetailsModal: React.FC<{ project: Project; onClose: () => void; onSowRequest: () => void }> = ({ project, onClose, onSowRequest }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <header className="p-4 flex justify-between items-start border-b border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-white">{project.title}</h2>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColorMap[project.badge]} mt-2 inline-block`}>{project.badge}</span>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700"><CloseIcon className="w-5 h-5"/></button>
                </header>
                <main className="p-6 space-y-4 overflow-y-auto">
                    <p className="text-slate-300">{project.fullDescription}</p>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Key Deliverables</h3>
                        <ul className="space-y-2 text-sm">
                            {project.features.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <CheckIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <span className="text-slate-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </main>
                <footer className="p-4 flex justify-between items-center border-t border-slate-700 bg-slate-900/50 rounded-b-xl">
                    <p className="text-xl font-bold text-cyan-400">{project.price}</p>
                    <div className="flex items-center gap-3">
                       <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">Close</button>
                       <button onClick={onSowRequest} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity">Request SOW</button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

const ProjectCard: React.FC<{ project: Project; onRequestSow: () => void; onShowDetails: () => void; }> = ({ project, onRequestSow, onShowDetails }) => {
    const handleRequestClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRequestSow();
    };

    return (
        <div onClick={onShowDetails} className="flex-shrink-0 w-80 bg-slate-800/60 rounded-xl border border-slate-700/50 p-6 flex flex-col space-y-4 transform transition-transform hover:-translate-y-1 cursor-pointer">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-white flex-1 pr-2">{project.title}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColorMap[project.badge]}`}>{project.badge}</span>
            </div>
            <p className="text-sm text-slate-400 flex-grow min-h-[40px]">{project.description}</p>
            <ul className="space-y-2 text-sm">
                {project.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between items-center pt-2">
                <p className="text-lg font-bold text-cyan-400">{project.price}</p>
                <button onClick={handleRequestClick} className="px-4 py-2 text-sm font-semibold bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors z-10 relative">
                    Request SOW
                </button>
            </div>
        </div>
    );
};

const TestimonialCard: React.FC = () => {
    const testimonials = [
        {
            quote: "Their documentation and validation checklists are the best we've seen.",
            author: "Michael T.",
            company: "Director, CloudNova"
        },
        {
            quote: "The automation solutions saved us countless hours of manual work. A true game-changer.",
            author: "Jessica L.",
            company: "Operations Lead, TechGenius"
        },
        {
            quote: "Transparent pricing and structured delivery made the entire project seamless and predictable.",
            author: "David R.",
            company: "CEO, Innovate MSP"
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length);
        }, 5000); // Change testimonial every 5 seconds
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50 h-full flex flex-col justify-center min-h-[250px]">
            <p className="text-sm font-semibold text-cyan-400 mb-4">Testimonials</p>
            <blockquote className="text-lg text-slate-300 italic flex-grow">
                "{testimonials[activeIndex].quote}"
            </blockquote>
            <footer className="mt-4 text-slate-400">
                — {testimonials[activeIndex].author}, <span className="font-semibold text-slate-300">{testimonials[activeIndex].company}</span>
            </footer>
            <div className="mt-6 flex items-center space-x-2">
                {testimonials.map((_, index) => (
                    <button 
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${activeIndex === index ? 'bg-cyan-400' : 'bg-slate-600 hover:bg-slate-500'}`}
                        aria-label={`Go to testimonial ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

const FeatureCard: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="group relative bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 h-full transition-all duration-300 hover:bg-slate-800/60 hover:-translate-y-1">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
        <div className="relative h-full">
            <h3 className="font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
    </div>
);

const HomePage: React.FC = () => {
    const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    const handleRequestSow = (project: Project) => {
        setSelectedProject(project);
        setIsDetailsModalOpen(false);
        setIsQuestionnaireModalOpen(true);
    };

    const handleShowDetails = (project: Project) => {
        setSelectedProject(project);
        setIsQuestionnaireModalOpen(false);
        setIsDetailsModalOpen(true);
    };
    
    const handleCloseModals = () => {
        setIsQuestionnaireModalOpen(false);
        setIsDetailsModalOpen(false);
        setTimeout(() => setSelectedProject(null), 300);
    };
    
    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };
    
    const handleScrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const features = [
        { title: 'MSP-Centric', description: 'We understand RMMs, PSAs, and partner workflows.' },
        { title: 'Automation-First', description: 'We streamline and automate wherever possible.' },
        { title: 'Structured Delivery', description: 'Every project includes validation checklists and handover docs.' },
        { title: 'Transparent Pricing', description: 'No hidden costs. Simple hourly or fixed-rate projects.' },
        { title: 'Future-Focused', description: 'Our scopes evolve with technology to keep you ahead.' },
    ];

    const workProcess = [
        {
            icon: <DiscoverIcon className="w-8 h-8 text-cyan-400" />,
            title: 'Discover',
            description: 'We start with a structured questionnaire and discovery call to confirm scope, risks, and timelines.',
            glowClasses: 'border-cyan-400/50 shadow-lg shadow-cyan-400/20',
        },
        {
            icon: <DesignIcon className="w-8 h-8 text-purple-400" />,
            title: 'Design',
            description: 'We create your Statement of Work with milestones, dependencies, and acceptance criteria.',
            glowClasses: 'border-purple-400/50 shadow-lg shadow-purple-400/20',
        },
        {
            icon: <DeliverIcon className="w-8 h-8 text-green-400" />,
            title: 'Deliver',
            description: 'Our engineers execute the plan using automation-first deployment with validation and documentation.',
            glowClasses: 'border-green-400/50 shadow-lg shadow-green-400/20',
        },
        {
            icon: <DocumentIcon className="w-8 h-8 text-pink-400" />,
            title: 'Document',
            description: 'We hand over configurations, evidence, and detailed runbooks to your operations team.',
            glowClasses: 'border-pink-400/50 shadow-lg shadow-pink-400/20',
        },
    ];
    
  return (
    <>
    <div className="space-y-24 md:space-y-32">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side: Headline & Buttons */}
            <div className="text-left animate-slide-in-left">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                    Projects that 
                    <span className="text-shimmer"> scale</span>, 
                    <span className="text-shimmer"> automate</span>, and 
                    <span className="text-shimmer"> strengthen</span> your stack.
                </h1>
                <p className="mt-6 text-lg text-slate-300 max-w-lg">
                    Structured, partner-ready projects with validation and handover. Transparent pricing, lean timelines, measurable outcomes.
                </p>
                <div className="mt-8 flex items-center gap-4 flex-wrap">
                    <button
                        onClick={() => handleScrollTo('projects-pricing')}
                        className="px-5 py-2.5 text-sm font-semibold text-white border-2 border-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-colors"
                    >
                        Explore Projects
                    </button>
                    <button
                        onClick={() => handleScrollTo('how-we-work')}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-purple-600/80 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                        How We Work
                    </button>
                </div>
            </div>
            {/* Right Side: Testimonial Card */}
            <div className="w-full animate-slide-in-right" style={{ animationDelay: '200ms' }}>
                <TestimonialCard />
            </div>
        </section>

        {/* "Why partners choose us" Section */}
        <section>
            <h2 className="text-4xl font-bold text-center text-white mb-12 animate-fade-in-up" style={{ animationDelay: '400ms', opacity: 0 }}>
                Why <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">partners choose us</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {features.map((feature, index) => (
                    <div key={feature.title} className="animate-fade-in-up h-full" style={{ opacity: 0, animationDelay: `${500 + index * 100}ms` }}>
                        <FeatureCard {...feature} />
                    </div>
                ))}
            </div>
        </section>

        {/* How We Work Section */}
        <section id="how-we-work">
            <h2 className="text-4xl font-bold text-center text-white mb-4 animate-fade-in-up" style={{ animationDelay: '400ms', opacity: 0 }}>
                How We <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Work</span>
            </h2>
            <p className="text-slate-300 text-center max-w-2xl mx-auto mb-20 animate-fade-in-up" style={{ animationDelay: '500ms', opacity: 0 }}>
                Our process is engineered for precision — transparent, validated, and automation-driven from start to finish.
            </p>

            <div className="relative">
                {/* Timeline Bar */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-slate-700" aria-hidden="true">
                    <div className="h-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/80 to-purple-500/80 animate-fade-in" style={{animationDuration: '2s'}}></div>
                </div>

                <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
                    {workProcess.map((step, index) => (
                        <div key={step.title} className="text-center flex flex-col items-center animate-fade-in-up" style={{ opacity: 0, animationDelay: `${600 + index * 150}ms` }}>
                            <div className={`w-24 h-24 mb-6 rounded-full bg-gray-900 border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${step.glowClasses}`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-400 max-w-xs">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Projects & Pricing Section */}
        <section id="projects-pricing">
            <h2 className="text-4xl font-bold text-center text-white mb-4 animate-fade-in-up" style={{ animationDelay: '400ms', opacity: 0 }}>
                Projects & <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Pricing</span>
            </h2>
            <p className="text-slate-300 text-center max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '500ms', opacity: 0 }}>
                Select a project to view scope and start your questionnaire.
            </p>
            <div className="relative group">
                <button onClick={() => scroll('left')} className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center text-white hover:bg-slate-600 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0">
                    <ChevronLeftIcon className="w-6 h-6"/>
                </button>
                <div ref={scrollContainerRef} className="flex space-x-6 overflow-x-auto pb-4 no-scrollbar">
                    {projectsData.map((project, index) => (
                        <div key={project.title} className="animate-fade-in-up" style={{ opacity: 0, animationDelay: `${600 + index * 100}ms`}}>
                             <ProjectCard 
                                project={project} 
                                onRequestSow={() => handleRequestSow(project)} 
                                onShowDetails={() => handleShowDetails(project)}
                            />
                        </div>
                    ))}
                </div>
                <button onClick={() => scroll('right')} className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center text-white hover:bg-slate-600 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0">
                    <ChevronRightIcon className="w-6 h-6"/>
                </button>
            </div>
        </section>

        {/* Bundled Solutions Section */}
        <section id="bundled-solutions">
            <h2 className="text-4xl font-bold text-center text-white mb-4 animate-fade-in-up" style={{ opacity: 0, animationDelay: '400ms' }}>
                Bundled <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Solutions</span>
            </h2>
            <p className="text-slate-300 text-center max-w-3xl mx-auto mb-12 animate-fade-in-up" style={{ opacity: 0, animationDelay: '500ms' }}>
                Turnkey outcomes with documentation, validation, and onboarding questionnaires included.
            </p>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/30 animate-fade-in-up" style={{ opacity: 0, animationDelay: '600ms' }}>
                    <div className="w-2/5 p-8 bg-gradient-to-br from-cyan-900/50 to-indigo-900/50 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-white">New Site / Domain Setup</h3>
                        <p className="text-slate-300 mt-2 text-lg">From $1,600</p>
                    </div>
                    <div className="w-3/5 p-8 flex items-center bg-slate-800/40">
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="w-2 h-2 mt-2 bg-emerald-400 rounded-full mr-4 flex-shrink-0"></span>
                                <span className="text-slate-300">AD DS, DNS, DHCP configured</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 mt-2 bg-emerald-400 rounded-full mr-4 flex-shrink-0"></span>
                                <span className="text-slate-300">File/print and baseline GPOs</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 mt-2 bg-emerald-400 rounded-full mr-4 flex-shrink-0"></span>
                                <span className="text-slate-300">Documentation and validation</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/30 animate-fade-in-up" style={{ opacity: 0, animationDelay: '700ms' }}>
                    <div className="w-2/5 p-8 bg-gradient-to-br from-purple-900/50 to-emerald-900/40 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-white">Greenfield Deployment Pack</h3>
                        <p className="text-slate-300 mt-2 text-lg">From $3,400</p>
                    </div>
                    <div className="w-3/5 p-8 flex items-center bg-slate-800/40">
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="w-2 h-2 mt-2 bg-emerald-400 rounded-full mr-4 flex-shrink-0"></span>
                                <span className="text-slate-300">Domain + virtualization (Hyper-V/VMware)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 mt-2 bg-emerald-400 rounded-full mr-4 flex-shrink-0"></span>
                                <span className="text-slate-300">Backup/DR configured + test restore</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 mt-2 bg-emerald-400 rounded-full mr-4 flex-shrink-0"></span>
                                <span className="text-slate-300">Monitoring via RMM + handover docs</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>
    {isQuestionnaireModalOpen && selectedProject && (
        <QuestionnaireModal project={selectedProject} onClose={handleCloseModals} />
    )}
    {isDetailsModalOpen && selectedProject && (
        <ProjectDetailsModal 
            project={selectedProject} 
            onClose={handleCloseModals}
            onSowRequest={() => handleRequestSow(selectedProject)}
        />
    )}
    </>
  );
};

export default HomePage;