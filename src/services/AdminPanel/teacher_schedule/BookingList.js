import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";

function BookingList() {
  const [bookings, setBookings] = useState([]);

  const location = useLocation();
  const { booking } = location.state || {};
  const { lang } = location.state || {};
  const { level } = location.state || {};
  const { teacherId } = location.state || {};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      setBookings(bookings.filter(booking => booking._id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <div>
      <h1>Bookings</h1>
      <Link to="/add-booking" state={{ booking, lang, level, teacherId }}>Add New Booking</Link>
      {booking.level
        .filter(levels => levels.levelName === level)
        .map(level => (
          level.date.map((date, index) => (
            <div key={index}>
              <p>
                <Link to={`/edit-booking/${date.d}`} state={{ date, lang, level, teacherId }}>
                  {date.d}
                </Link>
              </p>
            </div>
          ))
        ))}
    </div>

  );
}

export default BookingList;
