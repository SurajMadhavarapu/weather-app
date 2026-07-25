import { useState, useRef, useEffect, useCallback } from 'react';
import { checkOllamaStatus, sendChatMessage } from '../services/ollamaService';

const SUGGESTED_QUESTIONS = [
  "What should I wear today?",
  "Is it good for outdoor running?",
  "Should I carry an umbrella?",
  "Is the air quality safe for kids?",
  "Best time to go sightseeing today?",
];

export default function AIChatAssistant({ weatherData, location, airQuality }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState(null); // null = checking, object = result
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check Ollama on mount
  useEffect(() => {
    checkOllamaStatus().then(setOllamaStatus);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    const userMsg = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    try {
      const fullResponse = await sendChatMessage(
        newMessages,
        weatherData,
        location,
        airQuality,
        ollamaStatus?.defaultModel || 'mistral:latest',
        (partial) => setStreamingContent(partial)
      );

      setMessages((prev) => [...prev, { role: 'assistant', content: fullResponse }]);
      setStreamingContent('');
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ I couldn\'t connect to the AI engine. Make sure Ollama is running locally (`ollama serve`) and try again.',
        },
      ]);
      setStreamingContent('');
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading, weatherData, location, airQuality, ollamaStatus]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!weatherData) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        className={`ai-fab ${isOpen ? 'ai-fab--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        id="ai-chat-fab"
        aria-label="Open AI Travel Assistant"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="12" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="ai-chat" id="ai-chat-panel">
          {/* Header */}
          <div className="ai-chat__header">
            <div className="ai-chat__header-info">
              <h3 className="ai-chat__title">
                <span className="ai-chat__dot" />
                SkyCast AI Assistant
              </h3>
              <span className="ai-chat__powered">
                Powered by Ollama · {ollamaStatus?.defaultModel || 'mistral'}
              </span>
            </div>
            <button className="ai-chat__close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages Area */}
          <div className="ai-chat__messages">
            {/* Welcome message */}
            {messages.length === 0 && !isLoading && (
              <div className="ai-chat__welcome">
                <p className="ai-chat__welcome-text">
                  👋 Hi! I'm your AI weather travel assistant. I have live weather data for <strong>{location?.name || 'your location'}</strong>. Ask me anything!
                </p>

                {ollamaStatus && !ollamaStatus.available && (
                  <div className="ai-chat__warning">
                    ⚠️ Ollama is not running. Start it with <code>ollama serve</code> in your terminal.
                  </div>
                )}

                <div className="ai-chat__suggestions">
                  <p className="ai-chat__suggestions-label">Try asking:</p>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      className="ai-chat__suggestion-btn"
                      onClick={() => handleSend(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat bubbles */}
            {messages.map((msg, i) => (
              <div key={i} className={`ai-chat__bubble ai-chat__bubble--${msg.role}`}>
                <div className="ai-chat__bubble-content">{msg.content}</div>
              </div>
            ))}

            {/* Streaming response */}
            {isLoading && streamingContent && (
              <div className="ai-chat__bubble ai-chat__bubble--assistant">
                <div className="ai-chat__bubble-content">{streamingContent}</div>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && !streamingContent && (
              <div className="ai-chat__bubble ai-chat__bubble--assistant">
                <div className="ai-chat__typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="ai-chat__input-area">
            <input
              ref={inputRef}
              type="text"
              className="ai-chat__input"
              placeholder={ollamaStatus?.available ? "Ask about weather, outfits, activities..." : "Ollama not detected..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || !ollamaStatus?.available}
              id="ai-chat-input"
            />
            <button
              className="ai-chat__send"
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim() || !ollamaStatus?.available}
              id="ai-chat-send"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
