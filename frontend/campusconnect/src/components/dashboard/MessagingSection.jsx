import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Search, Phone, Video, MoreVertical, Paperclip, Smile, MessageSquare } from 'lucide-react';
import messageService from '../../api/messageService';

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const MessagingSection = ({ user, initialRecipient = null }) => {
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(initialRecipient);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const activeChatRef = useRef(activeChat);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchContacts();

    // Setup WebSocket Connection
    const token = localStorage.getItem('token');
    const socket = new SockJS(`http://localhost:8095/ws?token=${token}`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => { console.log(str); },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        // Subscribe to messages
        stompClient.subscribe(`/topic/messages/${user.id}`, (msg) => {
          if (msg.body) {
            const incomingMessage = JSON.parse(msg.body);
            console.log('Received message:', incomingMessage);
            
            // Only add to messages if we are chatting with the sender
            if (activeChatRef.current && activeChatRef.current.id === incomingMessage.senderId) {
              setMessages((prevMessages) => [...prevMessages, incomingMessage]);
            } else {
              // Optionally trigger a notification sound or badge here
              console.log("New message from someone else!");
            }
          }
        });

        // Subscribe to typing indicators
        stompClient.subscribe(`/topic/typing/${user.id}`, (msg) => {
          if (msg.body) {
            const typingData = JSON.parse(msg.body);
            // Show typing only if it's from the active chat partner
            if (activeChatRef.current && activeChatRef.current.id === typingData.senderId) {
              setIsTyping(typingData.typing === true);
              // Auto-clear typing after 3s as fallback
              if (typingData.typing) {
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
              }
            }
          }
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [user.id]);

  useEffect(() => {
    if (activeChat) {
      fetchConversation(activeChat.id);
    }
  }, [activeChat]);

  useEffect(scrollToBottom, [messages]);

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const res = await messageService.getContacts();
      if (res.success) setContacts(res.data);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchConversation = async (otherUserId, isPolling = false) => {
    if (!isPolling) setLoadingMessages(true);
    try {
      const res = await messageService.getConversation(otherUserId);
      if (res.success) {
        // Only update if message count changed to avoid flickering
        if (res.data.length !== messages.length) {
          setMessages(res.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
    } finally {
      if (!isPolling) setLoadingMessages(false);
    }
  };

  // ─── Typing Indicator Logic ───────────────────────────────
  const typingSentRef = useRef(false);
  const typingDebounceRef = useRef(null);

  const sendTypingEvent = (typing) => {
    if (!stompClientRef.current?.connected || !activeChat) return;
    stompClientRef.current.publish({
      destination: '/app/typing',
      body: JSON.stringify({
        senderId: user.id,
        recipientId: activeChat.id,
        typing: typing,
      }),
    });
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Send "typing" event (debounced)
    if (!typingSentRef.current) {
      sendTypingEvent(true);
      typingSentRef.current = true;
    }

    // Reset typing after 1.5s of no input
    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    typingDebounceRef.current = setTimeout(() => {
      sendTypingEvent(false);
      typingSentRef.current = false;
    }, 1500);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    // Send stop typing when sending message
    sendTypingEvent(false);

    const content = newMessage.trim();
    setNewMessage('');

    try {
      const res = await messageService.sendMessage({
        recipientId: activeChat.id,
        content: content
      });
      if (res.success) {
        setMessages([...messages, res.data]);
        // If this is a new contact, refresh contacts list
        if (!contacts.find(c => c.id === activeChat.id)) {
          fetchContacts();
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="messaging-container" style={{ 
      display: 'flex', height: 'calc(100vh - 100px)', 
      background: 'var(--bg-secondary)', borderRadius: 24, 
      overflow: 'hidden', border: '1px solid var(--border)',
      margin: '0 24px 24px 24px'
    }}>
      {/* Contacts List */}
      <div className="contacts-sidebar" style={{ 
        width: 320, borderRight: '1px solid var(--border)', 
        display: 'flex', flexDirection: 'column' 
      }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Messages</h3>
          <div className="dash-nav-search" style={{ width: '100%', maxWidth: '100%' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input placeholder="Search chats..." />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingContacts ? (
            <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>
          ) : contacts.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              No messages yet. Start a conversation from the Campus Directory!
            </div>
          ) : (
            contacts.map(c => (
              <div 
                key={c.id} 
                onClick={() => setActiveChat(c)}
                style={{ 
                  padding: '12px 20px', display: 'flex', gap: 12, 
                  alignItems: 'center', cursor: 'pointer',
                  background: activeChat?.id === c.id ? 'var(--bg-accent-soft)' : 'transparent',
                  borderLeft: activeChat?.id === c.id ? '4px solid var(--accent)' : '4px solid transparent'
                }}
              >
                <div style={{ 
                  width: 48, height: 48, borderRadius: 14, 
                  background: 'var(--bg-tertiary)', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, color: 'var(--accent)'
                }}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{c.name}</h4>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    @{c.username}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div style={{ 
              padding: '12px 24px', borderBottom: '1px solid var(--border)', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--bg-primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: 12, 
                  background: 'var(--bg-accent)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 14
                }}>
                  {activeChat.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{activeChat.name}</h4>
                  <p style={{ margin: 0, fontSize: 11, color: isTyping ? 'var(--accent)' : '#22C55E', fontWeight: isTyping ? 600 : 400 }}>
                    {isTyping ? 'typing...' : 'Online'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, color: 'var(--text-muted)' }}>
                <Phone size={20} style={{ cursor: 'pointer' }} />
                <Video size={20} style={{ cursor: 'pointer' }} />
                <MoreVertical size={20} style={{ cursor: 'pointer' }} />
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {loadingMessages ? (
                <div style={{ textAlign: 'center' }}>Loading messages...</div>
              ) : (
                messages.map((m, i) => {
                  const isMe = m.senderId === user.id;
                  return (
                    <div key={m.id} style={{ 
                      display: 'flex', 
                      justifyContent: isMe ? 'flex-end' : 'flex-start' 
                    }}>
                      <div style={{ 
                        maxWidth: '70%', padding: '10px 16px', borderRadius: 16,
                        background: isMe ? 'var(--accent)' : 'var(--bg-tertiary)',
                        color: isMe ? '#fff' : 'var(--text-primary)',
                        borderBottomRightRadius: isMe ? 4 : 16,
                        borderBottomLeftRadius: isMe ? 16 : 4,
                        fontSize: 14, boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}>
                        {m.content}
                        <div style={{ 
                          fontSize: 10, marginTop: 4, textAlign: 'right',
                          opacity: 0.7 
                        }}>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {/* Typing Indicator */}
              {isTyping && (
                <div style={{ 
                  display: 'flex', justifyContent: 'flex-start', marginBottom: 4
                }}>
                  <div style={{ 
                    padding: '10px 16px', borderRadius: 16, borderBottomLeftRadius: 4,
                    background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', gap: 4
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'typingBounce 1.4s infinite', animationDelay: '0s' }} />
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'typingBounce 1.4s infinite', animationDelay: '0.2s' }} />
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'typingBounce 1.4s infinite', animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} style={{ 
              padding: 20, background: 'var(--bg-primary)', 
              borderTop: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <Paperclip size={22} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
              <div style={{ flex: 1, position: 'relative' }}>
                <input 
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  style={{ 
                    width: '100%', padding: '12px 16px', borderRadius: 12,
                    background: 'var(--bg-tertiary)', border: 'none',
                    color: 'var(--text-primary)', outline: 'none'
                  }}
                />
                <Smile size={20} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--text-muted)', cursor: 'pointer' }} />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                style={{ 
                  width: 44, height: 44, borderRadius: 12, 
                  background: 'var(--accent)', color: '#fff',
                  border: 'none', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <Send size={20} />
              </motion.button>
            </form>
          </>
        ) : (
          <div style={{ 
            flex: 1, display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', textAlign: 'center', padding: 40
          }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: 24, 
              background: 'var(--bg-tertiary)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 20
            }}>
              <MessageSquare size={40} style={{ color: 'var(--accent)' }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Select a conversation
            </h3>
            <p style={{ maxWidth: 300, fontSize: 14 }}>
              Choose a student from your contacts or visit the Campus Directory to start a new chat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingSection;
