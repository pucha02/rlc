import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './BookingList.css'; // Import the CSS file

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const location = useLocation();
  const { booking } = location.state || {};
  const { lang } = location.state || {};
  const { level } = location.state || {};
  const { teacherId } = location.state || {};
  const { lessonTypes } = location.state || {};
  console.log(lessonTypes)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      setBookings(bookings.filter(booking => booking._id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <div className="booking-list-container">
      <h1 className="booking-list-title">Bookings</h1>
      <Link to="/add-booking" state={{ booking, lang, level, teacherId, lessonTypes }} className="add-booking-btn">
        Add New Booking
      </Link>
      <div className="booking-items">
        {booking?.level
          .filter(levels => levels.levelName === level) // Filter levels by levelName
          .map(level => (
            level.lessonTypes // Map through lessonTypes inside each level
              .filter(type => type.typeName === lessonTypes) // Filter by typeName
              .map(type =>
                type.date.map((date, index) => (
                  <Link to={`/edit-booking/${date.d}`} state={{ date, lang, level, teacherId, lessonTypes }} className="booking-link">
                    <div key={index} className="booking-item">
                      <p>

                        {date.d.toLocaleString().split('T')[0]}

                      </p>
                      {/* <button onClick={() => handleDelete(date.d)} className="delete-booking-btn">
                  Delete
                </button> */}
                    </div>
                  </Link>
                ))
              )
          ))}
      </div>
    </div>
  );
}

export default BookingList;
