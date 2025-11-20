import { ChatInterface } from './components/ChatInterface';

function App() {
  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <ChatInterface />
      </div>
    </div>
  );
}

export default App;
