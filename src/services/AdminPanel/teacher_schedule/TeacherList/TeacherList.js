import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TeacherList.css'; // Import the CSS file

function TeacherList({ schoolId }) {
    const [bookings, setBookings] = useState([]);
    console.log(schoolId)
    useEffect(() => {
        async function fetchBookings() {
            try {
                const response = await axios.get(`http://13.60.221.226/api/bookings/${schoolId}`);
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        }
        fetchBookings();
    }, []);
    console.log(schoolId)
    return (
        <div className="teacher-list-container">
            <div className="teacher-links">
                <Link to={`/${schoolId}/admin/school-detail`} state={{ schoolId: schoolId }} className="nav-link">Дані школи</Link>
                <Link to={'/admin/school-list'} state={{ schoolId: schoolId }} className="nav-link">Перелік шкіл</Link>
            </div>

            <h1 className="teacher-list-title">Оберіть вчителя</h1>

            <div className="teacher-list">
                {bookings.map(booking => (
                    <Link
                        to={`/languageslist`}
                        state={{ booking, teacherId: booking.data.teacherId, schoolId: schoolId }}
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
