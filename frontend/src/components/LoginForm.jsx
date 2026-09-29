import { useState } from 'react';

export default function LoginForm({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === 'login') {
      onLogin({ email, password });
      return;
    }

    onRegister({ fullName, email, password });
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <div className="auth-header">
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <button type="button" className="link-btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
        </button>
      </div>

      {mode === 'register' && (
        <input
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Full name"
        />
      )}

      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
      />
      <button type="submit" className="primary-btn">
        {mode === 'login' ? 'Login' : 'Create account'}
      </button>
    </form>
  );
}
