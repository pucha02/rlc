import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { formatDateToUkrainian } from '../../common/utils/smallFn/convertDate';
import './userProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [teacherFilter, setTeacherFilter] = useState(''); // состояние для фильтра по учителю
    const [uniqueTeachers, setUniqueTeachers] = useState([]); // для хранения уникальных учителей

    useEffect(() => {
        fetchUserData(setUser, axios, setOrders);
    }, []);

    useEffect(() => {
        // После загрузки заказов, извлекаем уникальных учителей
        if (orders.length > 0) {
            const allTeachers = orders.flatMap(order => {
                try {
                    const slots = JSON.parse(order.time);
                    return slots.map(slot => slot.teacherName);
                } catch (e) {
                    console.error('Invalid time format:', order.time);
                    return [];
                }
            });
            setUniqueTeachers([...new Set(allTeachers)]); // сохраняем уникальные имена
        }
    }, [orders]);

    const fetchUserData = async (setUser, axios, setOrders) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get('http://localhost:5000/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const { user, orders } = response.data;
                setUser(user);
                setOrders(orders);
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

                    {/* Кнопки для фильтрации по учителю */}
                    <div>
                        <button onClick={() => setTeacherFilter('')}>Показати всіх</button>
                        {uniqueTeachers.map((teacher, idx) => (
                            <button key={idx} onClick={() => setTeacherFilter(teacher)}>
                                {teacher}
                            </button>
                        ))}
                    </div>

                    {orders.length > 0 ? (
                        <ul className="orders-list">
                            {orders.map((order, index) => {
                                let formattedSlots = [];

                                try {
                                    const slots = order.time;
                                    formattedSlots = slots.map(slot => ({
                                        teacherName: slot.teacherName,
                                        lang: slot.lang,
                                        levelName: slot.levelName,
                                        lessonTypes: slot.lessonTypes,
                                        time: formatDateToUkrainian(slot.time)
                                    }));
                                } catch (e) {
                                    console.error('Invalid time format:', order.time);
                                }

                                // Фильтрация слотов по имени учителя
                                const filteredSlots = teacherFilter
                                    ? formattedSlots.filter(slot =>
                                        slot.teacherName === teacherFilter
                                    )
                                    : formattedSlots;

                                return (
                                    <li key={index}>
                                        <strong>Мова:</strong> {order.lang} <br />
                                        <strong>Курс:</strong> {order.levelName} <br />
                                        <strong>Часи:</strong>
                                        <ul>
                                            {filteredSlots.length > 0 ? (
                                                filteredSlots.map((slot, idx) => (
                                                    <li key={idx} style={{ marginBottom: '10px' }}>
                                                        <strong>Запис на урок:</strong>
                                                        <div><strong>Вчитель:</strong> {slot.teacherName}</div>
                                                        <div><strong>Мова:</strong> {slot.lang}</div>
                                                        <div><strong>Рівень:</strong> {slot.levelName}</div>
                                                        <div><strong>Тип уроку:</strong> {slot.lessonTypes}</div>
                                                        <div><strong>Час:</strong> {slot.time}</div>

                                                        {order.students.length > 0 && (
                                                            <div style={{ marginTop: '10px' }}>
                                                                <strong>Студенти:</strong>
                                                                <ul>
                                                                    {order.students.map((student, studentIdx) => (
                                                                        <li key={studentIdx}>
                                                                            <div>Ім'я: {student.name}</div>
                                                                            <div>Email: {student.email}</div>
                                                                            <div>Телефон: {student.phone}</div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </li>
                                                ))
                                            ) : (
                                                <li>Немає записів за вибраним учителем.</li>
                                            )}
                                        </ul>
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
