import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, Image, Video, Smile, Send, Loader, GraduationCap, PenLine } from 'lucide-react';
import postService from '../../api/postService';
import { useToast } from '../ui/Toast';
import ErrorState from '../ui/ErrorState';

// Helper: time ago
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// Color from username
const avatarColor = (name) => {
  const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#22C55E', '#06B6D4', '#EF4444'];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// Skeleton loader
const PostSkeleton = () => (
  <div className="post-card" style={{ padding: 16 }}>
    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
      <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 14 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ width: '40%', height: 14, marginBottom: 6 }} />
        <div className="skeleton" style={{ width: '25%', height: 10 }} />
      </div>
    </div>
    <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: 6 }} />
    <div className="skeleton" style={{ width: '80%', height: 14, marginBottom: 6 }} />
    <div className="skeleton" style={{ width: '60%', height: 14 }} />
  </div>
);

const PostCard = ({ post, index, user }) => {
  const [liked, setLiked] = useState(post.hasLiked || false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  
  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const toast = useToast();

  const initials = (post.username || 'U').slice(0, 2).toUpperCase();

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/dashboard?post=${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.username}`,
          text: post.content?.slice(0, 100),
          url: postUrl,
        });
      } else {
        await navigator.clipboard.writeText(postUrl);
        toast.success('Link copied to clipboard!');
      }
    } catch {
      // User cancelled share or clipboard failed
      try {
        await navigator.clipboard.writeText(postUrl);
        toast.success('Link copied to clipboard!');
      } catch {
        toast.error('Failed to copy link');
      }
    }
  };

  const handleLike = async () => {
    if (!user?.id) return;
    try {
      await postService.toggleLike(post.id, user.id);
      setLiked(!liked);
      setLikeCount(c => liked ? c - 1 : c + 1);
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const toggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await postService.getComments(post.id);
        if (res.success) setComments(res.data || []);
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || !user?.id) return;
    try {
      await postService.addComment(post.id, {
        userId: user.id,
        username: user.username,
        content: newComment.trim()
      });
      setNewComment('');
      setCommentCount(c => c + 1);
      // Optimistic update
      setComments([...comments, {
        id: Date.now(),
        username: user.username,
        content: newComment.trim(),
        createdAt: new Date().toISOString()
      }]);
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  return (
    <motion.div
      className="post-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="post-header">
        <div className="post-avatar" style={{ background: avatarColor(post.username) }}>{initials}</div>
        <div className="post-user-info" style={{ flex: 1 }}>
          <h4>
            {post.username}
            <span className="verified">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </span>
          </h4>
          <div className="post-meta">
            <span className="college-badge"><GraduationCap size={12} /> {post.collegeName}</span>
            <span>·</span>
            <span>{timeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="post-content">{post.content}</div>

      {post.imageUrl && (
        <img 
          className="post-image" 
          src={post.imageUrl.startsWith('/') ? `http://localhost:8095${post.imageUrl}` : post.imageUrl} 
          alt={`Post by ${post.username}`}
          loading="lazy"
          width={600}
          height={400}
          style={{ width: '100%', height: 'auto', maxHeight: 400, objectFit: 'cover' }}
        />
      )}

      <div className="post-engagement">
        <span>{likeCount} likes · {commentCount} comments</span>
      </div>

      <div className="post-actions">
        <motion.button
          className={`post-action-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          whileTap={{ scale: 0.9 }}
        >
          <Heart size={17} fill={liked ? 'currentColor' : 'none'} /> Like
        </motion.button>
        <button className={`post-action-btn ${showComments ? 'active' : ''}`} onClick={toggleComments}>
          <MessageCircle size={17} /> Comment
        </button>
        <button className="post-action-btn" onClick={handleShare}>
          <Share2 size={17} /> Share
        </button>
        <motion.button
          className={`post-action-btn ${saved ? 'saved' : ''}`}
          onClick={() => setSaved(!saved)}
          whileTap={{ scale: 0.9 }}
        >
          <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
        </motion.button>
      </div>

      {/* Interactive Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border-light)', marginTop: 8 }}
          >
            <div style={{ padding: '16px 20px' }}>
              {loadingComments ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Loading comments...</div>
              ) : comments.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
                  No comments yet. Be the first!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, maxHeight: 300, overflowY: 'auto' }}>
                  {comments.map((comment, i) => (
                    <motion.div 
                      key={comment.id || i}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      style={{ display: 'flex', gap: 10 }}
                    >
                      <div style={{ 
                        width: 28, height: 28, borderRadius: '50%', background: avatarColor(comment.username), 
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: 11, fontWeight: 'bold', flexShrink: 0 
                      }}>
                        {(comment.username || 'U').slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '0 12px 12px 12px', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{comment.username}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(comment.createdAt)}</span>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{comment.content}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Add Comment Input */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', 
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: 12, fontWeight: 'bold', flexShrink: 0 
                }}>
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME'}
                </div>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                  placeholder="Write a comment..."
                  style={{
                    flex: 1, padding: '8px 16px', borderRadius: 20, border: '1px solid var(--border)',
                    background: 'var(--bg-primary)', fontSize: 13, outline: 'none', color: 'var(--text-primary)'
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={submitComment}
                  disabled={!newComment.trim()}
                  style={{
                    background: newComment.trim() ? 'var(--accent)' : 'var(--bg-tertiary)',
                    color: newComment.trim() ? '#fff' : 'var(--text-muted)',
                    border: 'none', width: 32, height: 32, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: newComment.trim() ? 'pointer' : 'not-allowed', transition: '0.2s'
                  }}
                >
                  <Send size={14} style={{ marginLeft: -2 }} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FeedSection = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const fileInputRef = useRef(null);
  const loadMoreRef = useRef(null);

  const PAGE_SIZE = 10;
  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'SC';

  const fetchFeed = async (pageNum = 0, isInitial = false) => {
    if (isInitial) { setLoading(true); setError(null); }
    else setLoadingMore(true);

    try {
      const res = user?.collegeName 
        ? await postService.getCollegeFeed(user?.id, user.collegeName, pageNum, PAGE_SIZE)
        : await postService.getFeed(user?.id, pageNum, PAGE_SIZE);
        
      if (res.success) {
        const feedPosts = res.data?.content || res.data || [];
        const totalPages = res.data?.totalPages || 1;
        
        if (isInitial) {
          setPosts(feedPosts);
        } else {
          setPosts(prev => [...prev, ...feedPosts]);
        }

        setPage(pageNum);
        setHasMore(pageNum + 1 < totalPages && feedPosts.length === PAGE_SIZE);
      }
    } catch {
      if (isInitial) setError('Failed to load feed. Please try again.');
      console.error('Failed to fetch feed');
    } finally {
      if (isInitial) setLoading(false);
      else setLoadingMore(false);
    }
  };

  const loadNextPage = () => {
    if (!loadingMore && hasMore) {
      fetchFeed(page + 1, false);
    }
  };

  // Fetch feed on mount
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchFeed(0, true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setShowCompose(true);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedFile) return;
    setCreating(true);
    try {
      let imageUrl = null;
      if (selectedFile) {
        const uploadRes = await postService.uploadFile(selectedFile);
        if (uploadRes.success) {
          imageUrl = uploadRes.data;
        }
      }

      const postData = {
        userId: user.id,
        username: user.username,
        collegeName: user.collegeName,
        content: newPostContent.trim(),
        imageUrl: imageUrl,
      };
      const res = await postService.createPost(postData);
      if (res.success) {
        setNewPostContent('');
        setSelectedFile(null);
        setFilePreview(null);
        setShowCompose(false);
        // Refresh feed from the beginning
        setPosts([]);
        setPage(0);
        setHasMore(true);
        await fetchFeed(0, true);
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.main
      className="dash-feed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Create Post */}
      <div className="create-post">
        <div className="create-post-top">
          <div className="create-post-avatar">{initials}</div>
          {!showCompose ? (
            <div className="create-post-input" onClick={() => setShowCompose(true)}>
              What's happening on campus today?
            </div>
          ) : (
            <textarea
              autoFocus
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share something with your campus..."
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 12,
                background: 'var(--bg-tertiary)', border: '1px solid var(--accent)',
                fontSize: 14, color: 'var(--text-primary)',
                resize: 'vertical', minHeight: 80, fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          )}
        </div>

        <AnimatePresence>
          {filePreview && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ padding: '0 20px 16px 20px', position: 'relative' }}
            >
              <img 
                src={filePreview} 
                alt="Preview" 
                style={{ width: '100%', borderRadius: 12, maxHeight: 300, objectFit: 'cover' }} 
              />
              <button 
                onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                style={{ 
                  position: 'absolute', top: 10, right: 30, 
                  background: 'rgba(0,0,0,0.5)', color: '#fff', 
                  border: 'none', borderRadius: '50%', width: 24, height: 24,
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="create-post-actions">
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
          <button className="create-action-btn" onClick={() => fileInputRef.current.click()}>
            <Image size={16} style={{ color: '#3B82F6' }} /> Photo
          </button>
          <button className="create-action-btn" onClick={() => fileInputRef.current.click()}>
            <Video size={16} style={{ color: '#22C55E' }} /> Video
          </button>
          <button className="create-action-btn">
            <Smile size={16} style={{ color: '#F59E0B' }} /> Feeling
          </button>
          <motion.button
            className="create-action-btn post-btn"
            onClick={handleCreatePost}
            disabled={creating || !newPostContent.trim()}
            whileTap={{ scale: 0.95 }}
            style={{ opacity: (!newPostContent.trim() || creating) ? 0.5 : 1 }}
          >
            {creating ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
            {creating ? 'Posting...' : 'Post'}
          </motion.button>
        </div>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}

      {/* Error state */}
      {!loading && error && (
        <ErrorState message={error} onRetry={() => fetchFeed(0, true)} />
      )}

      {/* Empty state */}
      {!loading && !error && posts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center', padding: '60px 20px',
            color: 'var(--text-muted)', fontSize: 14,
          }}
        >
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
            <PenLine size={40} strokeWidth={1.5} style={{ color: 'var(--accent)', opacity: 0.6 }} />
          </div>
          <p style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-secondary)', marginBottom: 4 }}>
            No posts yet
          </p>
          <p>Be the first to share something with your campus!</p>
        </motion.div>
      )}

      {/* Real posts from API */}
      {!loading && posts.map((post, i) => (
        <PostCard key={post.id} post={post} index={i} user={user} />
      ))}

      {/* Infinite scroll trigger + Load More */}
      {!loading && hasMore && (
        <div ref={loadMoreRef} style={{ padding: '20px 0', textAlign: 'center' }}>
          {loadingMore ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13 }}
            >
              <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Loading more posts...
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loadNextPage}
              style={{
                padding: '10px 28px', borderRadius: 12,
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              Load More Posts
            </motion.button>
          )}
        </div>
      )}

      {/* End of feed */}
      {!loading && !hasMore && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)',
            fontSize: 13, borderTop: '1px solid var(--border-light)', marginTop: 8
          }}
        >
          You've reached the end of the feed
        </motion.div>
      )}
    </motion.main>
  );
};

export default FeedSection;
