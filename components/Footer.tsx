import React from 'react';

// A custom SVG logo inspired by the design in the image.
const FooterLogo = () => (
    <div className="flex items-center space-x-3">
      <svg width="36" height="36" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 40V16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 40V28" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M29 40V24" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M36 40V16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12.5 13L24 5L35.5 13V16H12.5V13Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      <div>
        <p className="text-xl font-bold text-white tracking-wide">FourFront IT</p>
        <p className="text-xs text-gray-400 -mt-1 italic">"Leading IT Forward"</p>
      </div>
    </div>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
);

const TwitterIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
);

const InstagramIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 8.118c-2.124 0-3.847 1.723-3.847 3.847s1.723 3.847 3.847 3.847 3.847-1.723 3.847-3.847S14.124 8.118 12 8.118zm0 6.162c-1.278 0-2.315-1.037-2.315-2.315s1.037-2.315 2.315-2.315 2.315 1.037 2.315 2.315-1.037 2.315-2.315 2.315zm4.882-6.522c-.63 0-1.14.51-1.14 1.14s.51 1.14 1.14 1.14 1.14-.51 1.14-1.14-.51-1.14-1.14-1.14z" clipRule="evenodd" />
    </svg>
);


const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700/50 mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left: Logo and tagline */}
          <div className="md:col-span-4 lg:col-span-5">
            <FooterLogo />
            <p className="text-sm text-gray-400 mt-4 max-w-xs">
              Structured, partner-ready projects with validation and handover. Transparent pricing, lean timelines, measurable outcomes.
            </p>
          </div>

          {/* Right: Link columns */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-white tracking-wider mb-4">Navigate</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Our Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Live Assistant</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Business Tools</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white tracking-wider mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Client Portal</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white tracking-wider mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Image License</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 text-center sm:text-left">
            © {new Date().getFullYear()} FourFront IT, Vancouver, Canada. All rights reserved.
          </p>
          <div className="flex space-x-5 items-center mt-4 sm:mt-0">
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors"><FacebookIcon /></a>
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors"><TwitterIcon /></a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
