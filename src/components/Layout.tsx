import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

export const Layout = () => {
  const { user } = useAuth();
  return (
    <div>
      <header className="topbar"><Link to="/">CollabNation</Link><nav>{user && <><Link to="/discover">Discover</Link><Link to="/messages">Messages</Link><Link to="/requests">Requests</Link><Link to="/notifications">Notifications</Link><Link to={`/profile/${user.uid}`}>Profile</Link><button onClick={() => signOut(auth)}>Logout</button></>}</nav></header>
      <main className="shell"><aside className="sidebar">Communities<br/>Remote Teams<br/>Film & Music</aside><section className="feed"><Outlet /></section><aside className="sidebar">Trending skills<br/>React<br/>Figma<br/>Ableton</aside></main>
    </div>
  );
};
