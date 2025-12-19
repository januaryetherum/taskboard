import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatWidget.css';

// API Key
const OPENROUTER_API_KEY = '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';

// System prompt for AI
const SYSTEM_PROMPT = `You are TaskBoard AI Assistant - a helpful guide for the TaskBoard Robot-as-a-Service (RaaS) platform built on Solana blockchain.

## ABOUT TASKBOARD
TaskBoard is a decentralized marketplace where businesses can rent autonomous robots for various tasks. The platform connects robot operators with businesses that need automation solutions.

## WEBSITE PAGES

### 🏠 HOME
The landing page showcasing TaskBoard's value proposition - decentralized robot rental marketplace on Solana.

### ⚙️ HOW IT WORKS
Explains the 6-step process:
1. Post a Task - Businesses submit task requests with specs
2. Robots Bid - Qualified robots analyze and submit bids
3. Accept & Escrow - Payment locked in Solana smart contract
4. Execute Task - Robot performs the work
5. Verify Completion - On-chain verification of task completion
6. Release Payment - Automatic payment release

### 🎮 PLAYGROUND
Visual workflow builder (like n8n) where users create robot automation workflows by connecting blocks:

**Block Types:**
- 🤖 Robot Select - Choose: Drone, Humanoid, Delivery Bot, Industrial Arm
- ⚡ Trigger - When to start: Manual, Scheduled, Event-based
- 📋 Task - Robot actions (scan, patrol, deliver, weld, etc.)
- 📍 Location - Set destination coordinates
- 🔀 Condition - If/else branching logic
- 🔄 Loop - Repeat actions
- ✅ Output - End workflow

**How to build workflows:**
1. Drag blocks from left panel to canvas
2. Connect blocks by dragging from output to input handles
3. Click block to configure in right panel
4. Export or Run when done

### 🤖 ROBOTS
Marketplace to browse and order robots:
- Drone ($299/month) - Aerial surveillance, mapping
- Humanoid ($599/month) - Assembly, assistance
- Delivery Bot ($199/month) - Logistics, delivery
- Industrial Arm ($799/month) - Manufacturing

**Order form includes:**
- Robot type selection
- Use case description
- Rental duration
- Price tier (Budget/Standard/Premium)
- Integration & Setup option

### 📚 DOCS
Technical documentation with sections:
- SDK Reference - JavaScript/TypeScript SDK for integration
- Task Lifecycle - How tasks flow through the system
- Verification System - On-chain proof mechanisms
- Economics & Fees - Token economics and fee structure
- How to Use - Getting started guide
- Price Tiers - Comparison of Budget/Standard/Premium

### 👥 ABOUT
Company information:
- Mission statement
- Tech stack (Solana, Rust, React, Node.js)
- Roadmap (Q1-Q4 2025)
- Team and vision

## YOUR ROLE
1. Answer questions about any page or feature
2. Help users navigate the site
3. Explain how to use the Playground workflow builder
4. Guide users through robot ordering process
5. Clarify technical documentation
6. Provide helpful tips and best practices

## RESPONSE STYLE
- Be friendly and concise
- Use emojis to match the UI style
- Give specific, actionable answers
- If asked about Playground, explain block types and connections
- If asked about pricing, mention the three tiers
- Always be helpful and encouraging

## TOKEN CONTRACT
TaskBoard token: ESN7PWw7Vu5dWsN5pBva8NABSeiPAUxAjqJNQr7pump

Remember: You're helping users explore and use the TaskBoard platform effectively!`;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 I\'m TaskBoard Assistant. How can I help you today?\n\nI can answer questions about:\n• How the platform works\n• Building workflows in Playground\n• Robot types and pricing\n• Technical documentation' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TaskBoard Assistant',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.choices[0].message.content 
        }]);
      } else if (data.error) {
        throw new Error(data.error.message);
      }
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="chat-widget-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && <span className="chat-btn-label">Chat</span>}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-widget"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chat-widget-header">
              <div className="chat-widget-title">
                <span className="chat-widget-icon">🤖</span>
                <span>TaskBoard Assistant</span>
              </div>
              <span className="chat-widget-model">GPT-4o-mini</span>
            </div>

            <div className="chat-widget-messages" ref={messagesEndRef}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-widget-message ${msg.role}`}>
                  <div className="chat-widget-message-content">{msg.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className="chat-widget-message assistant">
                  <div className="chat-widget-message-content typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-widget-input">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
              />
              <button 
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="chat-widget-send"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
