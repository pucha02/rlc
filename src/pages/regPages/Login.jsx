import React, { useState } from 'react';
import axios from 'axios';
import UserIconImg from '../../services/images/personal-cab.svg'
import PasswordIconImg from '../../services/images/password.svg'
import './AuthForms.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://13.60.221.226/api/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setMessage('Ви успішно війшли');
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div className="auth-form-container">
            <h2 style={{padding:"0"}}>Вхід</h2>
            <form onSubmit={handleSubmit}>
                <div className='field'>
                    <img src={UserIconImg} alt="" />
                    <input
                        type="email"
                        placeholder="EMAIL"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='field'>
                    <img src={PasswordIconImg} alt="" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>


                <button type="submit">Увійти</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;