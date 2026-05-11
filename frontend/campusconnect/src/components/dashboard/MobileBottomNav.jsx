import { Home, Building2, MessageSquare, Bell, UserCircle } from 'lucide-react';

const items = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'college', icon: Building2, label: 'College' },
  { id: 'messages', icon: MessageSquare, label: 'Chat' },
  { id: 'collab', icon: Bell, label: 'Collab' },
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
