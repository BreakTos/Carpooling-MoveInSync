import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';

export default function AuthForm() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (showForgot) {
      // Implement forgot password logic here
      alert("Reset link sent to " + email);
      return;
    }

    const endpoint = mode === 'login' ? 'http://localhost:8080/auth/login' : 'http://localhost:8080/auth/signup';

    try {
      const response = await axios.post(endpoint, { email, password });

      if (mode === 'login') {
        const { token } = response.data;

        // Save token & user info
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);

        // Redirect to homepage
        navigate('/');
      } else {
        alert('Signup successful! Please login.');
        setMode('login');
        setPassword('');
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Something went wrong');
    }
  }

  return (
    <div className="auth-card">
      <div className="tab-group">
        <button
          className={mode === 'login' ? 'active' : ''}
          onClick={() => { setMode('login'); setShowForgot(false); }}
        >
          Login
        </button>
        <button
          className={mode === 'signup' ? 'active' : ''}
          onClick={() => { setMode('signup'); setShowForgot(false); }}
        >
          Signup
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {!showForgot && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        )}

        {showForgot ? (
          <>
            <button type="submit">Send Reset Link</button>
            <span className="back-link" onClick={() => setShowForgot(false)}>Back to Login</span>
          </>
        ) : (
          <>
            <button type="submit">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </button>
            {mode === 'login' && (
              <span className="forgot-link" onClick={() => setShowForgot(true)}>Forgot Password?</span>
            )}
          </>
        )}
      </form>
    </div>
  );
}
