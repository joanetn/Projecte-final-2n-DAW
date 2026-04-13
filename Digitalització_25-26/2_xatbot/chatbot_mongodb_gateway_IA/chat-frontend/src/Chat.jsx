import React, { useState, useRef, useEffect } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState('');
  const scrollRef = useRef(null);

  // ID de usuario único para persistencia
  const userId = "user_demo_777"; 

  // Cargar historial al montar el componente
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/history/${userId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setMessages(data.map(m => ({ role: m.role, content: m.content })));
        }
      } catch (err) {
        console.error("Error al cargar historial:", err);
      }
    };
    loadHistory();
  }, [userId]);

  // Auto-scroll automático
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '' }]);
    setInput('');
    setIsLoading(true);
    setCurrentProvider('Pensando...');

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], userId }),
      });

      const provider = response.headers.get('x-provider');
      if (provider) setCurrentProvider(provider);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value);

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content += chunk;
          return updated;
        });
      }
    } catch (err) {
      console.error("Error en el stream:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("¿Vaciar pantalla? (Esto no borra la base de datos)")) {
      setMessages([]);
      setCurrentProvider('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <h3>Soporte Polideportivo</h3>
          {currentProvider && <small className="provider-tag">📡 {currentProvider}</small>}
        </div>
        <button onClick={clearChat} className="clear-btn">🗑️</button>
      </div>

      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            <span className="role-label">{m.role === 'user' ? 'Tú' : 'Asistente'}</span>
            <p>{m.content}</p>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-footer">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe tu duda..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? '...' : '➤'}
        </button>
      </form>

      <style>{`
        .chat-container {
          position: fixed; bottom: 20px; right: 20px; width: 350px; height: 500px;
          background: #fff; border-radius: 15px; box-shadow: 0 5px 25px rgba(0,0,0,0.2);
          display: flex; flex-direction: column; font-family: -apple-system, sans-serif; overflow: hidden;
        }
        .chat-header {
          background: #1a73e8; color: white; padding: 15px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .chat-header h3 { margin: 0; font-size: 16px; }
        .provider-tag { font-size: 10px; background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 4px; }
        .clear-btn { background: none; border: none; cursor: pointer; font-size: 18px; filter: invert(1); }
        
        .chat-body { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 12px; background: #f8f9fa; }
        .bubble { max-width: 80%; padding: 10px; border-radius: 12px; position: relative; }
        .user { align-self: flex-end; background: #1a73e8; color: white; border-bottom-right-radius: 2px; }
        .assistant { align-self: flex-start; background: white; border: 1px solid #e0e0e0; color: #333; border-bottom-left-radius: 2px; }
        .role-label { font-size: 9px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; display: block; opacity: 0.6; }
        .bubble p { margin: 0; font-size: 14px; line-height: 1.4; white-space: pre-wrap; }

        .chat-footer { display: flex; padding: 15px; border-top: 1px solid #eee; background: white; }
        .chat-footer input { flex: 1; border: 1px solid #ddd; padding: 8px 15px; border-radius: 20px; outline: none; }
        .chat-footer button { margin-left: 8px; background: #1a73e8; color: white; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; }
        .chat-footer button:disabled { background: #ccc; }
      `}</style>
    </div>
  );
}
