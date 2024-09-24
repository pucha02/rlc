import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // Import DatePicker component
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import { Link } from 'react-router-dom';
import { formatDateToUkrainian, parseUkrainianDate } from '../../common/utils/smallFn/convertDate';
import LogoImg from '../../services/images/Group12.svg'

import './userProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [teacherFilter, setTeacherFilter] = useState('');
    const [uniqueTeachers, setUniqueTeachers] = useState([]);
    const [selectedBookingDate, setSelectedBookingDate] = useState(null);
    const [highlightedBookingDates, setHighlightedBookingDates] = useState([]);

    const schoolId = localStorage.getItem('schoolId')

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
        console.log(token)
        if (token) {
            try {
                const response = await axios.get('http://13.60.221.226/api/me', {
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
            const response = await axios.post('http://13.60.221.226/api/logout');
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
        <div className='mains'>
            <div className='containers'>
                <div className="user-profile">
                    <div className='logos'>
                        <div className='logos-items'>
                            <Link to={`/${schoolId}`}><img src={LogoImg} alt="Logo" /></Link>
                            <div className='logo-names'>Мовна школа <span>EAGLES</span></div>
                        </div>
                    </div>
                    <h2>Особистий кабінет</h2>
                    {user ? (
                        <>
                            <strong>Вітаємо, {user.username}</strong>
                            {/* <p>Email: {user.email}</p>
                            <p>Телефон: {user.phone}</p> */}
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
                                                    time: formatDateToUkrainian(slot.time),
                                                    payment_status: slot.payment_status
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
                                            console.log(filteredSlots)
                                            return (
                                                <li key={index}>

                                                    <ul>
                                                        {filteredSlots.map((slot, idx) => (
                                                            <li key={idx} style={{ marginBottom: '10px' }}>
                                                                <div className='order-item'>
                                                                    <strong>Запис на урок:</strong>
                                                                    <div className='order-item-el'><div className='order-item-el-head'>Вчитель:</div> <div className='order-item-el-desc'>{slot.teacherName}</div></div>
                                                                    <div className='order-item-el'><div className='order-item-el-head'>Мова:</div> <div className='order-item-el-desc'>{slot.lang}</div></div>
                                                                    <div className='order-item-el'><div className='order-item-el-head'>Рівень:</div> <div className='order-item-el-desc'>{slot.levelName}</div></div>
                                                                    <div className='order-item-el'><div className='order-item-el-head'>Тип уроку:</div> <div className='order-item-el-desc'>{slot.lessonTypes}</div></div>
                                                                    <div className='order-item-el'><div className='order-item-el-head'>Час:</div> <div className='order-item-el-desc'>{slot.time}</div></div>
                                                                    <div className='order-item-el'><div className='order-item-el-head'>Статус оплати:</div> <div className='order-item-el-desc'>{slot.payment_status}</div></div>
                                                                </div>
                                                                {order.students.length > 0 && (
                                                                    <div className='students-list' style={{ marginTop: '10px' }}>
                                                                        <div className='students-head'>Студенти:</div>
                                                                        <ul>
                                                                            {order.students.map((student, studentIdx) => (
                                                                                <li key={studentIdx}>
                                                                                    <div className='student-name'>{student.name}</div>
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

                    <Link to={`/${schoolId}`}>
                        <button className="btn-logout" onClick={handleLogout}>Вийти</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
