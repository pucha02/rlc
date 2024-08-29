import React, { useState } from 'react';
import axios from 'axios';
import './AuthForms.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            localStorage.setItem('token', response.data.token);
            setMessage('Вы успешно вошли');
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Вхід</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Увійти</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;