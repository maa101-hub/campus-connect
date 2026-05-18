import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, MessageSquare, Check, CheckCheck, ArrowLeft } from 'lucide-react';
import messageService from '../../api/messageService';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// ─── Typing Bubble ─────────────────────────────────────────────────────────────
const TypingBubble = () => (
  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 4, paddingLeft: 8 }}>
    <div style={{
      padding: '10px 16px', borderRadius: 18, borderBottomLeftRadius: 4,
      background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', gap: 5,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
    }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--text-muted)',
          display: 'inline-block',
          animation: 'typingBounce 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.2}s`
        }} />
      ))}
    </div>
  </div>
);

// ─── Message Tick ────────────────────────────────────────────────────────────────
const MessageTick = ({ isRead }) => (
  isRead
    ? <CheckCheck size={13} style={{ color: '#60a5fa', flexShrink: 0 }} />
    : <Check size={13} style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
);

// ─── Main Component ──────────────────────────────────────────────────────────────
const MessagingSection = ({ user, initialRecipient = null }) => {
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(initialRecipient);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);    // other user is typing
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const activeChatRef = useRef(activeChat);
  const typingTimeoutRef = useRef(null);
  const typingSentRef = useRef(false);
  const typingDebounceRef = useRef(null);

  // Keep activeChatRef in sync for use inside WS callbacks
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // ─── WebSocket Setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchContacts();

    const token = localStorage.getItem('token');
    const socket = new SockJS(`http://localhost:8095/ws?token=${token}`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('[WS] Connected');

        // ── Incoming messages & read receipts ──
        stompClient.subscribe(`/topic/messages/${user.id}`, (msg) => {
          if (!msg.body) return;
          const payload = JSON.parse(msg.body);

          // READ_RECEIPT: the other person read our messages
          if (payload.type === 'READ_RECEIPT') {
            setMessages(prev =>
              prev.map(m =>
                m.senderId === user.id && m.recipientId === payload.conversationWith
                  ? { ...m, read: true }
                  : m
              )
            );
            return;
          }

          // Regular incoming message
          if (activeChatRef.current && activeChatRef.current.id === payload.senderId) {
            setMessages(prev => [...prev, payload]);
            // Immediately mark as read since the chat is open
            messageService.markAsRead(payload.senderId).catch(() => {});
          } else {
            // Flash the contact badge (future: unread count)
            console.log('[WS] New message from someone not in active chat');
          }
        });

        // ── Typing indicators ──
        stompClient.subscribe(`/topic/typing/${user.id}`, (msg) => {
          if (!msg.body) return;
          const typingData = JSON.parse(msg.body);
          if (activeChatRef.current && activeChatRef.current.id === typingData.senderId) {
            setIsTyping(typingData.typing === true);
            if (typingData.typing) {
              if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
            }
          }
        });
      },
      onStompError: (frame) => {
        console.error('[WS] STOMP error', frame);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    };
  }, [user.id]);

  // ─── Load conversation when switching chats ──────────────────────────────────
  useEffect(() => {
    if (activeChat) {
      setIsTyping(false);
      fetchConversation(activeChat.id);
    }
  }, [activeChat]);

  useEffect(scrollToBottom, [messages, isTyping]);

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

  const fetchConversation = async (otherUserId) => {
    setLoadingMessages(true);
    try {
      const res = await messageService.getConversation(otherUserId);
      if (res.success) {
        setMessages(res.data);
        // Mark their messages as read when opening a conversation
        messageService.markAsRead(otherUserId).catch(() => {});
      }
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // ─── Typing indicator send ────────────────────────────────────────────────────
  const sendTypingEvent = useCallback((typing) => {
    if (!stompClientRef.current?.connected || !activeChatRef.current) return;
    stompClientRef.current.publish({
      destination: '/app/typing',
      body: JSON.stringify({
        senderId: user.id,
        recipientId: activeChatRef.current.id,
        typing,
      }),
    });
  }, [user.id]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!typingSentRef.current) {
      sendTypingEvent(true);
      typingSentRef.current = true;
    }
    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    typingDebounceRef.current = setTimeout(() => {
      sendTypingEvent(false);
      typingSentRef.current = false;
    }, 1500);
  };

  // ─── Send message ─────────────────────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    sendTypingEvent(false);
    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    typingSentRef.current = false;

    const content = newMessage.trim();
    setNewMessage('');

    try {
      const res = await messageService.sendMessage({
        recipientId: activeChat.id,
        content,
      });
      if (res.success) {
        setMessages(prev => [...prev, res.data]);
        if (!contacts.find(c => c.id === activeChat.id)) {
          fetchContacts();
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Inject @keyframes for typing animation */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>

      <div style={{
        display: 'flex',
        height: 'calc(100vh - 100px)',
        background: 'var(--bg-secondary)',
        borderRadius: 24,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        margin: '0 24px 24px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>

        {/* ── Contacts Sidebar ── */}
        <div style={{
          width: 320,
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-primary)',
        }}>
          <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 14, paddingLeft: 4 }}>Messages</h3>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-tertiary)', borderRadius: 12, padding: '8px 12px',
              border: '1px solid var(--border)',
            }}>
              <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                style={{
                  background: 'none', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', fontSize: 13, width: '100%',
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingContacts ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Loading...</div>
            ) : filteredContacts.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                {searchQuery ? 'No results found' : 'No chats yet. Start a conversation from the Campus Directory!'}
              </div>
            ) : (
              filteredContacts.map(c => (
                <div
                  key={c.id}
                  onClick={() => setActiveChat(c)}
                  style={{
                    padding: '12px 16px',
                    display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer',
                    background: activeChat?.id === c.id ? 'var(--bg-accent-soft)' : 'transparent',
                    borderLeft: activeChat?.id === c.id ? '3px solid var(--accent)' : '3px solid transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%',
                    background: 'var(--bg-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: '#fff', fontSize: 18, flexShrink: 0,
                  }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{c.name}</h4>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      @{c.username}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Chat Area ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '12px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'var(--bg-primary)',
                boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'var(--bg-accent)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 16, flexShrink: 0,
                  }}>
                    {activeChat.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{activeChat.name}</h4>
                    <AnimatePresence mode="wait">
                      {isTyping ? (
                        <motion.p
                          key="typing"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          style={{ margin: 0, fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}
                        >
                          typing...
                        </motion.p>
                      ) : (
                        <motion.p
                          key="online"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          style={{ margin: 0, fontSize: 11, color: '#22C55E' }}
                        >
                          Online
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, color: 'var(--text-muted)' }}>
                  <Phone size={20} style={{ cursor: 'pointer' }} />
                  <Video size={20} style={{ cursor: 'pointer' }} />
                  <MoreVertical size={20} style={{ cursor: 'pointer' }} />
                </div>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '20px 20px 8px',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                {loadingMessages ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: 40 }}>Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: 60, fontSize: 13 }}>
                    No messages yet. Say hi! 👋
                  </div>
                ) : (
                  messages.map((m, i) => {
                    const isMe = m.senderId === user.id;
                    const prevMsg = messages[i - 1];
                    const showDate = !prevMsg ||
                      new Date(m.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();

                    return (
                      <div key={m.id ?? `msg-${i}`}>
                        {showDate && (
                          <div style={{
                            textAlign: 'center', fontSize: 11, color: 'var(--text-muted)',
                            margin: '12px 0 8px',
                          }}>
                            {new Date(m.timestamp).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                          </div>
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.18 }}
                          style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 2 }}
                        >
                          <div style={{
                            maxWidth: '68%',
                            padding: '9px 13px 7px',
                            borderRadius: 18,
                            borderBottomRightRadius: isMe ? 4 : 18,
                            borderBottomLeftRadius: isMe ? 18 : 4,
                            background: isMe ? 'var(--accent)' : 'var(--bg-tertiary)',
                            color: isMe ? '#fff' : 'var(--text-primary)',
                            fontSize: 14,
                            lineHeight: 1.45,
                            boxShadow: isMe
                              ? '0 2px 8px rgba(99,102,241,0.25)'
                              : '0 2px 8px rgba(0,0,0,0.1)',
                            wordBreak: 'break-word',
                          }}>
                            <span>{m.content}</span>
                            <div style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                              gap: 3, marginTop: 3,
                            }}>
                              <span style={{ fontSize: 10, opacity: 0.7 }}>
                                {formatTime(m.timestamp)}
                              </span>
                              {isMe && <MessageTick isRead={m.isRead || m.read} />}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })
                )}

                {/* Typing indicator bubble */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      key="typing-bubble"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TypingBubble />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '12px 16px',
                  background: 'var(--bg-primary)',
                  borderTop: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <Paperclip size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }} />
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e); }}
                    placeholder="Type a message..."
                    style={{
                      width: '100%', padding: '11px 40px 11px 16px', borderRadius: 24,
                      background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                      color: 'var(--text-primary)', outline: 'none', fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                  <Smile size={18} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', cursor: 'pointer',
                  }} />
                </div>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  type="submit"
                  disabled={!newMessage.trim()}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: newMessage.trim() ? 'var(--accent)' : 'var(--bg-tertiary)',
                    color: newMessage.trim() ? '#fff' : 'var(--text-muted)',
                    border: 'none', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: newMessage.trim() ? 'pointer' : 'default',
                    transition: 'background 0.2s, color 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <Send size={18} />
                </motion.button>
              </form>
            </>
          ) : (
            /* No chat selected */
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', textAlign: 'center', padding: 40,
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: 28,
                background: 'var(--bg-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <MessageSquare size={38} style={{ color: 'var(--accent)' }} />
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
    </>
  );
};

export default MessagingSection;
