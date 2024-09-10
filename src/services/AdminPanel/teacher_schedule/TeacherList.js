import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TeacherList.css'; // Import the CSS file

function TeacherList() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        async function fetchBookings() {
            try {
                const response = await axios.get('http://localhost:5000/api/bookings');
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        }
        fetchBookings();
    }, []);

    return (
        <div className="teacher-list-container">
            <div className="teacher-links">
                <Link to={'/admin/school-detail'} className="nav-link">Дані школи</Link>
                <Link to={'/admin/school-list'} className="nav-link">Перелік шкіл</Link>
            </div>

            <h1 className="teacher-list-title">Оберіть вчителя</h1>

            <div className="teacher-list">
                {bookings.map(booking => (
                    <Link
                        to={`/languageslist`}
                        state={{ booking, teacherId: booking.data.teacherId }}
                        key={booking.id}
                        className="teacher-item"
                    >
                        {booking.data.teacherName}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default TeacherList;
