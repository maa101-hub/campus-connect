import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Search, Filter, Users, Palette, Megaphone, Terminal, Plus, Loader } from 'lucide-react';
import collabService from '../../api/collabService';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all', label: 'All Projects', icon: <Briefcase size={14} /> },
  { id: 'tech', label: 'Development', icon: <Terminal size={14} /> },
  { id: 'design', label: 'UI/UX Design', icon: <Palette size={14} /> },
  { id: 'marketing', label: 'Marketing', icon: <Megaphone size={14} /> },
];

const CollabHub = ({ user }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '', description: '', role: '', category: 'tech', tags: '', difficultyLevel: 'Intermediate'
  });

  useEffect(() => {
    fetchOpportunities();
  }, [activeCategory]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await collabService.getOpportunities(activeCategory);
      if (res.success) {
        setOpportunities(res.data.content || []);
      }
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await collabService.createOpportunity({
        ...newProject,
        authorId: user.id,
        authorName: user.name
      });
      if (res.success) {
        toast.success('Project posted successfully!');
        setShowCreateModal(false);
        setNewProject({ title: '', description: '', role: '', category: 'tech', tags: '', difficultyLevel: 'Intermediate' });
        fetchOpportunities();
      }
    } catch (err) {
      toast.error('Failed to post project');
    }
  };

  const handleApply = async (id) => {
    try {
      const res = await collabService.apply(id);
      if (res.success) {
        toast.success('Application sent successfully!');
        setOpportunities(prev => prev.map(opp => 
          opp.id === id ? { ...opp, applicantsCount: opp.applicantsCount + 1 } : opp
        ));
      }
    } catch (err) {
      toast.error('Application failed');
    }
  };

  return (
    <motion.div 
      className="dash-feed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ paddingBottom: 100, position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px 0' }}>Collaboration Hub</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Find teammates, build projects, and grow your network.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '12px 24px', borderRadius: 14, background: 'var(--accent)',
            color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)'
          }}
        >
          <Plus size={20} /> Create Project
        </motion.button>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', 
            backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', padding: 20
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="post-card"
              style={{ width: '100%', maxWidth: 500, padding: 32, margin: 0 }}
            >
              <h3 style={{ margin: '0 0 24px 0', fontSize: 24, fontWeight: 900 }}>Post New Project</h3>
              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input 
                  placeholder="Project Title" required
                  value={newProject.title}
                  onChange={e => setNewProject({...newProject, title: e.target.value})}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-primary)' }}
                />
                <textarea 
                  placeholder="Short Description" required rows={3}
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-primary)', resize: 'none' }}
                />
                <div style={{ display: 'flex', gap: 12 }}>
                  <input 
                    placeholder="Role (e.g. Frontend)" required
                    value={newProject.role}
                    onChange={e => setNewProject({...newProject, role: e.target.value})}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: 12, background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-primary)' }}
                  />
                  <select 
                    value={newProject.category}
                    onChange={e => setNewProject({...newProject, category: e.target.value})}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: 12, background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-primary)' }}
                  >
                    <option value="tech">Tech</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                   <select 
                    value={newProject.difficultyLevel}
                    onChange={e => setNewProject({...newProject, difficultyLevel: e.target.value})}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: 12, background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-primary)' }}
                  >
                    <option value="Beginner Friendly">Beginner Friendly</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <input 
                    placeholder="Tags (comma separated)"
                    value={newProject.tags}
                    onChange={e => setNewProject({...newProject, tags: e.target.value})}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: 12, background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-primary)' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                    Post Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filter Bar */}
      <div style={{ 
        display: 'flex', gap: 12, marginBottom: 24, overflowX: 'auto', paddingBottom: 8,
        scrollbarWidth: 'none'
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
              borderRadius: 14, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              background: activeCategory === cat.id ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: activeCategory === cat.id ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700, fontSize: 13, transition: '0.2s'
            }}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 100, color: 'var(--text-muted)' }}>
          <Loader size={32} className="animate-spin" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p>Loading projects...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 100, background: 'var(--bg-tertiary)', borderRadius: 32 }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🚀</p>
          <p style={{ fontWeight: 700, color: 'var(--text-muted)' }}>No projects found in this category.</p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Be the first to create one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
          {opportunities.map((opp, i) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.01, boxShadow: "var(--shadow-xl)" }}
              className="post-card"
              style={{ padding: 24, margin: 0, position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{opp.title}</h3>
                    <span style={{ 
                      fontSize: 10, padding: '2px 8px', borderRadius: 20, 
                      background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontWeight: 800
                    }}>
                      {opp.difficultyLevel}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>Posted by {opp.authorName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6366f1', fontWeight: 700, fontSize: 13 }}>
                    <Users size={16} />
                    <span>{opp.applicantsCount} applied</span>
                  </div>
                </div>
              </div>

              <div style={{ 
                background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: 12,
                marginBottom: 16, borderLeft: '4px solid #6366f1'
              }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{opp.role}</p>
              </div>

              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                {opp.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(opp.tags || '').split(',').map(tag => tag.trim() && (
                    <span key={tag} style={{ 
                      fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-tertiary)',
                      padding: '4px 10px', borderRadius: 8
                    }}>#{tag}</span>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleApply(opp.id)}
                  style={{
                    padding: '10px 24px', borderRadius: 12, background: 'var(--accent)',
                    color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Apply Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CollabHub;

