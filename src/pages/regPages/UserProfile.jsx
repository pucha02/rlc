import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './userProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchUserData(setUser, axios, setOrders);
    }, []);

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!! ВЫНЕСТИ ФУНКЦИЮ В smallFn !!!!!!!!!!!!!!!!!!!!!!
    const fetchUserData = async (setUser, axios, setOrders) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get('http://localhost:5000/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const { user, orders } = response.data;
                setUser(user);
                setOrders(orders)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:5000/logout');
            if (response.status === 200) {
                setUser(null);
                setOrders([]);
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
            {user ? (
                <>
                    <p>Ім'я користувача: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Телефон: {user.phone}</p>

                    <h3>Ваші записи</h3>
                    {orders.length > 0 ? (
                        <ul className="orders-list">
                            {orders.map((order, index) => {
                                let parsedTimes = [];

                                try {
                                    parsedTimes = JSON.parse(order.time);
                                } catch (e) {
                                    console.error('Invalid time format:', order.time);
                                }

                                return (
                                    <li key={index}>
                                        <strong>Мова:</strong> {order.lang} <br />
                                        <strong>Курс:</strong> {order.levelName} <br />
                                        <strong>Вчитель:</strong> {order.teacherName} <br />
                                        <strong>Час:</strong>
                                        {parsedTimes.length > 0 ? (
                                            <ul>
                                                {parsedTimes.map((time, idx) => (
                                                    <li key={idx}>{time}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>{order.time}</p>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>Замовлення відсутні.</p>
                    )}

                </>
            ) : (
                <p>Завантаження даних користувача...</p>
            )}

            <Link to={'/'}>
                <button className="btn-logout" onClick={handleLogout}>Вийти</button>
            </Link>
        </div>
    );
};

export default UserProfile;
