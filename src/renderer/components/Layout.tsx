import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Netflix-style Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent h-20">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-netflix-red text-3xl font-bold">NETFLIX CLONE</h1>
            <span className="text-netflix-light-gray text-sm">Media Player</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout; 