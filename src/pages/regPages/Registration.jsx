import React, { useState } from 'react';
import axios from 'axios';
import UserIconImg from '../../services/images/personal-cab.svg'
import PasswordIconImg from '../../services/images/password.svg'
import PhoneIconImg from '../../services/images/phone.svg'

import './AuthForms.css';

const Registration = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/register', { username, email, phone, password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div className="auth-form-container">
            <h2 style={{padding:"0"}}>Реєстрація</h2>
            <form onSubmit={handleSubmit}>
                <div className='field'>
                    <img src={UserIconImg} alt="" />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="field">
                    <img src={UserIconImg} alt="" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="field">
                    <img src={PhoneIconImg} alt="" />
                    <input
                        type="phone"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                <button type="submit">Зареєструватися</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Registration;
