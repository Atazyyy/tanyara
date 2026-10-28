import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatPage from "./components/ChatPage";
import AgentPanel from "./components/AgentPanel";
import KnowledgeBase from "./components/KnowledgeBase";
import { useTanyaraStore } from "./hooks/useTanyaraStore";

export default function App() {
  const [view, setView] = useState("chat");
  const store = useTanyaraStore();

  const navigate = (v) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink antialiased">
      <Navbar view={view} onNavigate={navigate} />
      <main className="flex-1 pb-16 sm:pb-0">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {view === "chat" && <ChatPage store={store} />}
          {view === "agen" && <AgentPanel store={store} />}
          {view === "basis" && <KnowledgeBase store={store} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
