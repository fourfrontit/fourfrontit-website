
import React from 'react';
import { EmailIcon, PhoneIcon, LocationIcon } from '../constants';

const ContactCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="bg-slate-800/60 rounded-xl p-6 flex flex-col items-start border border-slate-700/50 relative overflow-hidden h-full">
    {/* Subtle background glow */}
    <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500/10 rounded-full blur-3xl"></div>
    <div className="flex items-center space-x-3 mb-4">
      <div className="text-cyan-400">{icon}</div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
    <div className="text-slate-400 text-sm space-y-3 flex-grow">{children}</div>
  </div>
);

const GradientButton: React.FC<{ href: string; children: React.ReactNode; className?: string }> = ({ href, children, className = '' }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-block mt-auto bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition-opacity duration-300 transform hover:scale-105 shadow-lg ${className}`}
  >
    {children}
  </a>
);

const MutedButton: React.FC<{ href: string; children: React.ReactNode; className?: string }> = ({ href, children, className = '' }) => (
  <a
    href={href}
    className={`inline-block mt-auto border border-slate-600 text-slate-300 font-semibold px-6 py-2 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-colors duration-300 ${className}`}
  >
    {children}
  </a>
);

const ContactSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-900 animate-fade-in-up" style={{ animationDelay: '700ms', opacity: 0 }}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-white mb-10">
          Contact Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Email Support Card */}
          <ContactCard icon={<EmailIcon className="w-6 h-6" />} title="Email Support">
            <p>For any questions or requests, please contact us at</p>
            <a href="mailto:info@fourfrontit.com" className="text-cyan-400 font-semibold hover:underline break-all">
              info@fourfrontit.com
            </a>
            <div className="pt-4 w-full">
              <GradientButton href="mailto:info@fourfrontit.com">Open Email</GradientButton>
            </div>
          </ContactCard>

          {/* Call Us Card */}
          <ContactCard icon={<PhoneIcon className="w-6 h-6" />} title="Call Us">
            <p>Available Monday to Friday, 8am–5pm (PT)</p>
            <a href="tel:+16727623822" className="text-cyan-400 text-xl font-bold hover:underline">
              +1 (672) 762-3822
            </a>
            <div className="pt-4 w-full">
                <MutedButton href="tel:+16727623822">Call Now</MutedButton>
            </div>
          </ContactCard>

          {/* Location Card */}
          <ContactCard icon={<LocationIcon className="w-6 h-6" />} title="Location">
            <p>
              <span className="font-semibold text-slate-200">Head office:</span><br/>
               401–570 East 8th Avenue, Vancouver, BC V5T 1S8, Canada.
            </p>
            <p>
                Contact our international locations: <br/>
                <a href="#" className="text-cyan-400 hover:underline">Sri Lanka</a>,{' '}
                <a href="#" className="text-cyan-400 hover:underline">Australia</a>
            </p>
            <div className="pt-4 w-full">
                <GradientButton href="https://www.google.com/maps/search/?api=1&query=570+East+8th+Avenue,+Vancouver,+BC+V5T+1S8" >Get Directions</GradientButton>
            </div>
          </ContactCard>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;