import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthPage } from './pages/AuthPage';
import { FeedPage } from './pages/FeedPage';
import { ProjectFormPage } from './pages/ProjectFormPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { MessagesPage } from './pages/MessagesPage';
import { CollaborationRequestsPage } from './pages/CollaborationRequestsPage';
import { NotificationsPage } from './pages/NotificationsPage';

export default function App() {
  return <BrowserRouter><Routes><Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/signup" element={<AuthPage mode="signup"/>}/><Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}><Route index element={<FeedPage/>}/><Route path="projects/new" element={<ProjectFormPage/>}/><Route path="projects/:id" element={<ProjectDetailPage/>}/><Route path="profile/:id" element={<ProfilePage/>}/><Route path="discover" element={<DiscoverPage/>}/><Route path="messages" element={<MessagesPage/>}/><Route path="requests" element={<CollaborationRequestsPage/>}/><Route path="notifications" element={<NotificationsPage/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes></BrowserRouter>;
}
