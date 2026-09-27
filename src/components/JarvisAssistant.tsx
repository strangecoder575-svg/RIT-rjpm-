import React, { useMemo, useState } from 'react';
import { Bot, Command, ExternalLink, Mic, Send, Sparkles, X, Zap } from 'lucide-react';
import { DEPTS } from '../data/departments';

interface JarvisAssistantProps {
  open: boolean;
  onClose: () => void;
  onSelectDepartment?: (deptId: string) => void;
}

const responses: Record<string, string> = {
  hello: 'Hello. RIT knowledge network is online. Ask me about departments, quizzes, campus, or the official college site.',
  help: 'Try: “open CSE”, “show AI&DS”, “start quiz”, “campus”, or “official website”.',
  campus: 'Campus core is online. Explore the department nodes below or use the interactive campus map.',
  quiz: 'Quiz Arena is ready. Choose a department and enter the portal to begin.',
};

export const JarvisAssistant: React.FC<JarvisAssistantProps> = ({ open, onClose, onSelectDepartment }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ from: 'jarvis' | 'user'; text: string }>>([
    { from: 'jarvis', text: 'JARVIS online. How can I assist your RIT campus mission?' },
  ]);

  const departmentHints = useMemo(() => DEPTS.slice(0, 6), []);
  if (!open) return null;

  const respond = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const lower = text.toLowerCase();
    let reply = responses.help;

    if (lower.includes('official') || lower.includes('rit website')) {
      reply = 'Opening the official Ramco Institute of Technology website.';
      window.open('https://www.ritrjpm.ac.in/', '_blank', 'noopener,noreferrer');
    } else if (lower.includes('campus')) {
      reply = responses.campus;
      document.getElementById('campus')?.scrollIntoView({ behavior: 'smooth' });
    } else if (lower.includes('quiz')) {
      reply = responses.quiz;
      document.getElementById('departments')?.scrollIntoView({ behavior: 'smooth' });
    } else if (lower.includes('hello') || lower.includes('hi')) {
      reply = responses.hello;
    } else {
      const found = DEPTS.find((d) => lower.includes(d.code.toLowerCase()) || lower.includes(d.name.toLowerCase().split(' ')[0]));
      if (found) {
        reply = `${found.code} portal identified. Launching the ${found.name} department interface.`;
        onSelectDepartment?.(found.id);
      }
    }

    setMessages((prev) => [...prev, { from: 'user', text }, { from: 'jarvis', text: reply }]);
    setInput('');
  };

  return (
    <div className="jarvis-overlay" role="dialog" aria-modal="true" aria-label="RIT JARVIS assistant">
      <button className="jarvis-backdrop" onClick={onClose} aria-label="Close JARVIS" />
      <section className="jarvis-panel">
        <div className="jarvis-panel-top">
          <div className="jarvis-brand"><span className="jarvis-panel-orb"><i /></span><div><b>JARVIS // RIT CORE</b><small>KNOWLEDGE ASSISTANT • ONLINE</small></div></div>
          <button onClick={onClose} className="jarvis-close" aria-label="Close"><X size={18}/></button>
        </div>
        <div className="jarvis-panel-grid">
          <div className="jarvis-visual">
            <div className="jarvis-big-orb"><span/><b/><i/></div>
            <div className="jarvis-scan">SCANNING RIT KNOWLEDGE NETWORK</div>
            <div className="jarvis-command-badges"><span><Zap size={12}/> READY</span><span><Sparkles size={12}/> 9 DEPTS</span><span><Bot size={12}/> AI CORE</span></div>
          </div>
          <div className="jarvis-chat">
            <div className="jarvis-chat-log">
              {messages.map((message, index) => <div key={index} className={`jarvis-message ${message.from}`}><span>{message.from === 'jarvis' ? 'J' : 'YOU'}</span><p>{message.text}</p></div>)}
            </div>
            <div className="jarvis-suggestions">
              <button onClick={() => respond('official website')}><ExternalLink size={12}/> Official website</button>
              <button onClick={() => respond('campus')}><Command size={12}/> Campus</button>
              <button onClick={() => respond('quiz')}><Zap size={12}/> Quiz Arena</button>
              {departmentHints.slice(0, 3).map((d) => <button key={d.id} onClick={() => respond(`open ${d.code}`)}>{d.code}</button>)}
            </div>
            <form className="jarvis-input" onSubmit={(e) => { e.preventDefault(); respond(input); }}>
              <Mic size={15}/><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask JARVIS anything about the campus..."/><button aria-label="Send"><Send size={15}/></button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
