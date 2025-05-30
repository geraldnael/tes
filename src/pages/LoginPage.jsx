// src/pages/LoginPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch } from 'react-redux';
import LoginForm from '../components/auth/LoginForm';
import { asyncLoginUser } from '../redux/actions/authActions';
import '../styles/auth-pages.css';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async ({ email, password }) => { // Make it async
    const success = await dispatch(asyncLoginUser({ email, password }));
    if (success) {
      navigate('/'); // Redirect to homepage on successful login
    }
  };

  return (
    <div className="auth-page">
      <LoginForm
        onLogin={handleLogin}
      />
      <p>
        Belum punya akun?
        {' '}
        <Link to="/register">Daftar di sini ya</Link>
      </p>
    </div>
  );
}

export default LoginPage;
