import { Home, Compass, PlusSquare, Bell, UserCircle } from 'lucide-react';

const items = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'explore', icon: Compass, label: 'Explore' },
  { id: 'create', icon: PlusSquare, label: 'Post' },
  { id: 'notifications', icon: Bell, label: 'Alerts' },
  { id: 'profile', icon: UserCircle, label: 'Profile' },
];

const MobileBottomNav = ({ activeNav, setActiveNav }) => {
  return (
    <div className="mobile-bottom-nav">
      {items.map(item => (
        <button
          key={item.id}
          className={`mobile-nav-btn ${activeNav === item.id ? 'active' : ''}`}
          onClick={() => setActiveNav(item.id)}
        >
          <item.icon />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default MobileBottomNav;
