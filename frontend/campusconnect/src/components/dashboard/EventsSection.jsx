import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Plus, X, Clock, Tag, 
  CheckCircle, Loader, ChevronRight
} from 'lucide-react';
import eventService from '../../api/eventService';
import { useToast } from '../ui/Toast';

const CATEGORIES = [
  { id: 'ALL', label: 'All Events', color: 'var(--accent)' },
  { id: 'HACKATHON', label: 'Hackathons', color: '#6366F1' },
  { id: 'WORKSHOP', label: 'Workshops', color: '#22C55E' },
  { id: 'CULTURAL', label: 'Cultural', color: '#EC4899' },
  { id: 'SPORTS', label: 'Sports', color: '#F59E0B' },
  { id: 'SEMINAR', label: 'Seminars', color: '#06B6D4' },
  { id: 'OTHER', label: 'Other', color: '#64748B' },
];

const EventsSection = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [userRsvps, setUserRsvps] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState({});
  const toast = useToast();

  useEffect(() => {
    fetchEvents();
    if (user?.id) fetchUserRsvps();
  }, [user]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.getEvents(user?.collegeName);
      if (res.success) setEvents(res.data || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRsvps = async () => {
    try {
      const res = await eventService.getUserRsvps(user.id);
      if (res.success) setUserRsvps(res.data || []);
    } catch (err) {
      // silent
    }
  };

  const handleRsvp = async (eventId) => {
    if (!user?.id) return;
    setRsvpLoading(prev => ({ ...prev, [eventId]: true }));
    try {
      if (userRsvps.includes(eventId)) {
        await eventService.cancelRsvp(eventId, user.id);
        setUserRsvps(prev => prev.filter(id => id !== eventId));
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, rsvpCount: e.rsvpCount - 1 } : e));
        toast.info('RSVP cancelled');
      } else {
        const res = await eventService.rsvp(eventId, user.id, user.name);
        if (res.success) {
          setUserRsvps(prev => [...prev, eventId]);
          setEvents(prev => prev.map(e => e.id === eventId ? { ...e, rsvpCount: e.rsvpCount + 1 } : e));
          toast.success('RSVP confirmed!');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to RSVP');
    } finally {
      setRsvpLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const filteredEvents = activeCategory === 'ALL' 
    ? events 
    : events.filter(e => e.category === activeCategory);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      full: d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    };
  };

  const getCategoryColor = (cat) => {
    return CATEGORIES.find(c => c.id === cat)?.color || 'var(--accent)';
  };

  return (
    <motion.div
      className="dash-feed"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: '0 24px 40px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px 0' }}>
            <Calendar size={24} style={{ display: 'inline', marginRight: 10, color: 'var(--accent)' }} />
            Campus Events
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Discover and join events happening at your campus
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '10px 20px', borderRadius: 12,
            background: 'var(--accent)', color: '#fff',
            border: 'none', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          <Plus size={16} /> Create Event
        </motion.button>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '7px 16px', borderRadius: 20,
              background: activeCategory === cat.id ? cat.color : 'var(--bg-tertiary)',
              color: activeCategory === cat.id ? '#fff' : 'var(--text-secondary)',
              border: 'none', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="post-card" style={{ padding: 20, margin: 0 }}>
              <div className="skeleton" style={{ width: '100%', height: 140, borderRadius: 12, marginBottom: 16 }} />
              <div className="skeleton" style={{ width: '70%', height: 16, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: '50%', height: 12 }} />
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="post-card"
          style={{ padding: '70px 40px', margin: 0, textAlign: 'center' }}
        >
          <Calendar size={48} style={{ color: 'var(--accent)', marginBottom: 16, opacity: 0.5 }} />
          <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>No events yet</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14, maxWidth: 300, marginInline: 'auto' }}>
            Be the first to create an event for your campus community!
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filteredEvents.map((event, i) => {
            const date = formatDate(event.eventDate);
            const isRsvpd = userRsvps.includes(event.id);
            const isFull = event.rsvpCount >= event.maxAttendees;
            const catColor = getCategoryColor(event.category);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="post-card"
                style={{ padding: 0, margin: 0, overflow: 'hidden' }}
              >
                {/* Color Banner */}
                <div style={{ height: 6, background: catColor }} />

                <div style={{ padding: 20 }}>
                  {/* Date + Category */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{
                      width: 56, height: 60, borderRadius: 12,
                      background: 'var(--accent-light)', color: 'var(--accent)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <strong style={{ fontSize: 20, lineHeight: 1 }}>{date.day}</strong>
                      <span style={{ fontSize: 10, fontWeight: 700 }}>{date.month}</span>
                    </div>
                    <span style={{
                      padding: '4px 10px', borderRadius: 8,
                      background: `${catColor}15`, color: catColor,
                      fontSize: 11, fontWeight: 700
                    }}>
                      {event.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>
                    {event.title}
                  </h3>
                  {event.description && (
                    <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {event.description.length > 100 ? event.description.slice(0, 100) + '...' : event.description}
                    </p>
                  )}

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                      <Clock size={14} /> {date.time} · {date.full}
                    </div>
                    {event.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                        <MapPin size={14} /> {event.location}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                      <Users size={14} /> {event.rsvpCount}/{event.maxAttendees} attending
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-tertiary)', marginBottom: 16, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      background: isFull ? '#EF4444' : catColor,
                      width: `${Math.min((event.rsvpCount / event.maxAttendees) * 100, 100)}%`,
                      transition: 'width 0.3s'
                    }} />
                  </div>

                  {/* RSVP Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRsvp(event.id)}
                    disabled={isFull && !isRsvpd || rsvpLoading[event.id]}
                    style={{
                      width: '100%', padding: '11px 0', borderRadius: 12,
                      background: isRsvpd ? 'rgba(34, 197, 94, 0.1)' : (isFull ? 'var(--bg-tertiary)' : catColor),
                      color: isRsvpd ? '#22C55E' : (isFull ? 'var(--text-muted)' : '#fff'),
                      border: isRsvpd ? '1px solid #22C55E' : 'none',
                      fontSize: 13, fontWeight: 700, cursor: (isFull && !isRsvpd) ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.2s'
                    }}
                  >
                    {rsvpLoading[event.id] ? (
                      <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : isRsvpd ? (
                      <><CheckCircle size={16} /> Going</>
                    ) : isFull ? (
                      'Event Full'
                    ) : (
                      'RSVP Now'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateEventModal 
            user={user} 
            onClose={() => setShowCreateModal(false)} 
            onCreated={() => { setShowCreateModal(false); fetchEvents(); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Create Event Modal ─────────────────────────────────────
const CreateEventModal = ({ user, onClose, onCreated }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    location: '',
    category: 'OTHER',
    maxAttendees: 50,
  });
  const [creating, setCreating] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.eventDate || !form.eventTime) {
      toast.error('Title, date and time are required');
      return;
    }

    setCreating(true);
    try {
      const eventData = {
        organizerId: user.id,
        organizerName: user.name,
        title: form.title,
        description: form.description,
        collegeName: user.collegeName,
        eventDate: `${form.eventDate}T${form.eventTime}:00`,
        location: form.location,
        category: form.category,
        maxAttendees: form.maxAttendees,
      };

      const res = await eventService.createEvent(eventData);
      if (res.success) {
        toast.success('Event created successfully!');
        onCreated();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create event');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          width: '100%', maxWidth: 520, background: 'var(--bg-primary)',
          borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden'
        }}
      >
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Create Event</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18, maxHeight: '70vh', overflowY: 'auto' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-muted)' }}>Event Title *</label>
            <input
              className="auth-input"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Inter-College Hackathon 2026"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-muted)' }}>Description</label>
            <textarea
              className="auth-input"
              style={{ height: 80, padding: 12, resize: 'none' }}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="What's this event about?"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-muted)' }}>Date *</label>
              <input
                className="auth-input"
                type="date"
                value={form.eventDate}
                onChange={e => setForm({ ...form, eventDate: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-muted)' }}>Time *</label>
              <input
                className="auth-input"
                type="time"
                value={form.eventTime}
                onChange={e => setForm({ ...form, eventTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-muted)' }}>Location</label>
            <input
              className="auth-input"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Main Auditorium, Block A"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-muted)' }}>Category</label>
              <select
                className="auth-input"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                <option value="HACKATHON">Hackathon</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="CULTURAL">Cultural</option>
                <option value="SPORTS">Sports</option>
                <option value="SEMINAR">Seminar</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-muted)' }}>Max Attendees</label>
              <input
                className="auth-input"
                type="number"
                min="5"
                max="1000"
                value={form.maxAttendees}
                onChange={e => setForm({ ...form, maxAttendees: parseInt(e.target.value) || 50 })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 }}>
            <button type="button" onClick={onClose} style={{
              padding: '10px 20px', borderRadius: 12, border: '1px solid var(--border-color)',
              background: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 13
            }}>
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={creating}
              style={{
                padding: '10px 24px', borderRadius: 12, background: 'var(--accent)',
                color: '#fff', border: 'none', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                opacity: creating ? 0.6 : 1
              }}
            >
              {creating ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={16} />}
              {creating ? 'Creating...' : 'Create Event'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EventsSection;
