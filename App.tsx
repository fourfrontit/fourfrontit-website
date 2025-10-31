
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LiveAssistantPage from './pages/LiveAssistantPage';
import BusinessToolsPage from './pages/BusinessToolsPage';
import ServicesPage from './pages/ServicesPage';
import ChatWidget from './components/ChatWidget';
import { Page } from './types';
import ContactSection from './components/ContactSection';
import EstimateFormSection from './components/EstimateFormSection';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <HomePage />;
      case Page.ASSISTANT:
        return <LiveAssistantPage />;
      case Page.TOOLS:
        return <BusinessToolsPage />;
      case Page.SERVICES:
        return <ServicesPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-sans">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {/* Added pt-24 to account for the fixed header's height */}
      <main key={currentPage} className="flex-grow container mx-auto px-4 py-8 pt-28 animate-fade-in">
        {renderPage()}
      </main>
      <EstimateFormSection />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default App;