import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './userProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    console.log(response)
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:5000/logout');
            if (response.status === 200) {
                setUser(null);
                localStorage.removeItem('token');
                console.log('Logged out successfully');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="user-profile">
            <h2>Особистий кабінет</h2>
            <p>Ім'я користувача: {user.username}</p>

            <Link to={'/'}>
                <button className="btn-logout" onClick={handleLogout}>Вийти</button>
            </Link>
        </div>
    );
};

export default UserProfile;
