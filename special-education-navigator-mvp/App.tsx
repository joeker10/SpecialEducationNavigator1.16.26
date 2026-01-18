
import React, { useState, useEffect } from 'react';
import { LandingScreen } from './components/LandingScreen';
import { ChatScreen } from './components/ChatScreen';

function App() {
  const [activeState, setActiveState] = useState<string | null>(null);

  useEffect(() => {
    // Diagnostic log to help users troubleshoot "Save to GitHub" or "API Key" issues
    console.log("--- SYSTEM DIAGNOSTICS ---");
    console.log("API Key Status:", process.env.API_KEY ? "CONFIGURED" : "MISSING");
    // Removed problematic import.meta.env.MODE which caused the TypeScript error
    console.log("--------------------------");
  }, []);

  const handleStartSession = (state: string) => {
    setActiveState(state);
  };

  const handleReset = () => {
    setActiveState(null);
  };

  return (
    <div className="min-h-screen bg-black">
      {!activeState ? (
        <LandingScreen onStartSession={handleStartSession} />
      ) : (
        <ChatScreen userState={activeState} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
