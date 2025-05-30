import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import '../../styles/forms.css';

function LoginForm({ onLogin }) { // Menerima onLogin sebagai prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => { // Mengganti nama fungsi
    event.preventDefault();
    if (!email || !password) {
      alert('Email dan password harus diisi!');
      return;
    }
    onLogin({ email, password }); // Memanggil onLogin prop
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="button-primary">
        Login
      </button>
    </form>
  );
}

// Menambahkan PropTypes untuk onLogin
LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
