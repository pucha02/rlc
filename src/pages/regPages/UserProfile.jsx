import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // Import DatePicker component
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import { Link } from 'react-router-dom';
import { formatDateToUkrainian, parseUkrainianDate } from '../../common/utils/smallFn/convertDate';
import './userProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [teacherFilter, setTeacherFilter] = useState('');
    const [uniqueTeachers, setUniqueTeachers] = useState([]);
    const [selectedBookingDate, setSelectedBookingDate] = useState(null);
    const [highlightedBookingDates, setHighlightedBookingDates] = useState([]);

    useEffect(() => {
        fetchUserData(setUser, axios, setOrders);
    }, []);

    useEffect(() => {
        // After loading orders, extract unique teacher names and marked dates
        if (orders.length > 0) {
            const allTeachers = orders.flatMap(order => {
                try {
                    const slots = order.time;
                    return slots.map(slot => slot.teacherName);
                } catch (e) {
                    console.error('Invalid time format:', order.time);
                    return [];
                }
            });
            setUniqueTeachers([...new Set(allTeachers)]);

            const dates = orders.flatMap(order => order.time.map(slot => new Date(slot.time)));
            setHighlightedBookingDates([...new Set(dates)]);
        }
    }, [orders]);

    const fetchUserData = async (setUser, axios, setOrders) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get('http://localhost:5000/api/me', {
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
            const response = await axios.post('http://localhost:5000/api/logout');
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

    // Filter orders by selected date
    const filterByDate = (orders, date) => {
        if (!date) return orders;
        return orders.filter(order => {
            const slots = order.time || [];
            return slots.some(slot => new Date(slot.time).getDate(), new Date(selectedBookingDate).getDate());
        });
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
                    {/* 
                    <div>
                        <button onClick={() => setTeacherFilter('')}>Показати всіх</button>
                        {uniqueTeachers.map((teacher, idx) => (
                            <button key={idx} onClick={() => setTeacherFilter(teacher)}>
                                {teacher}
                            </button>
                        ))}
                    </div> */}

                    {/* DatePicker for date filtering */}
                    <DatePicker
                        selected={selectedBookingDate}
                        onChange={(date) => setSelectedBookingDate(date)}
                        dateFormat="yyyy-MM-dd"
                        isClearable
                        placeholderText="Виберіть дату для фільтрації записів"
                        inline
                        highlightDates={highlightedBookingDates}
                    />

                    {/* Filtered orders by selected date */}
                    {selectedBookingDate && <p>Вибрана дата: {selectedBookingDate.toLocaleDateString()}</p>}

                    {orders.length > 0 ? (
                        <ul className="orders-list">

                            {filterByDate(orders, selectedBookingDate)
                                .map((order, index) => {
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

                                    const filteredSlots = formattedSlots
                                        ? formattedSlots.filter(slot => {
                                            const slotDate = new Date(parseUkrainianDate(slot.time));
                                            return slotDate instanceof Date && !isNaN(slotDate) &&
                                                selectedBookingDate instanceof Date && !isNaN(selectedBookingDate) &&
                                                slotDate.getDate() === selectedBookingDate.getDate();
                                        })
                                        : [];

                                    // Условие для предотвращения рендера пустого заказа
                                    if (filteredSlots.length === 0) return null;

                                    return (
                                        <li key={index}>
                                            <strong>Мова:</strong> {order.lang} <br />
                                            <strong>Курс:</strong> {order.levelName} <br />
                                            <strong>Часи:</strong>
                                            <ul>
                                                {filteredSlots.map((slot, idx) => (
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
                                                ))}
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
