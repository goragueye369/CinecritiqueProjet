
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DiscoverUsersPage from './pages/DiscoverUsersPage';
import PublicProfilePage from './pages/PublicProfilePage';
import CreateReviewPage from './pages/CreateReviewPage';
import MyReviewsPage from './pages/MyReviewsPage';
import EditReviewPage from './pages/EditReviewPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import StatisticsPage from './pages/StatisticsPage';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          <Navbar />
          <div style={{ padding: '2rem' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/discover" 
                element={
                  <PrivateRoute>
                    <DiscoverUsersPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/user/:userId" 
                element={<PublicProfilePage />} 
              />
              <Route 
                path="/create-review" 
                element={
                  <PrivateRoute>
                    <CreateReviewPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-reviews" 
                element={
                  <PrivateRoute>
                    <MyReviewsPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/edit-review/:reviewId" 
                element={
                  <PrivateRoute>
                    <EditReviewPage />
                  </PrivateRoute>
                } 
              />
              <Route path="/movie/:movieTitle" element={<MovieDetailsPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
