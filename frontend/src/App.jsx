import { useState } from 'react';
import { apiRequest } from './api';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('taskflow_token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('taskflow_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [error, setError] = useState('');

  const saveSession = (sessionToken, sessionUser) => {
    localStorage.setItem('taskflow_token', sessionToken);
    localStorage.setItem('taskflow_user', JSON.stringify(sessionUser));
    setToken(sessionToken);
    setUser(sessionUser);
    setError('');
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const result = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (!result.success) {
        setError(result.message || 'Login failed');
        return;
      }

      saveSession(result.token, result.user);
    } catch (err) {
      setError('Unable to connect to the backend API.');
    }
  };

  const handleRegister = async ({ fullName, email, password, role = 'TEAM_MEMBER' }) => {
    try {
      const result = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password, role })
      });

      if (!result.success) {
        setError(result.message || 'Registration failed');
        return;
      }

      saveSession(result.token, result.user);
    } catch (err) {
      setError('Unable to connect to the backend API.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken('');
    setUser(null);
    setError('');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Project dashboard</p>
          <h1>TaskFlow Pro</h1>
        </div>
        {token && user && (
          <div className="topbar-user">
            <span>Welcome, {user.fullName}</span>
            <button className="primary-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>

      {!token ? (
        <main className="auth-layout">
          <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
          {error && <p className="error-message">{error}</p>}
        </main>
      ) : (
        <Dashboard token={token} user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
