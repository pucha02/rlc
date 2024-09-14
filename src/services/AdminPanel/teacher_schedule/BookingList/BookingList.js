import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import './BookingList.css'; // Import the CSS file

function BookingList() {
  const [teacherOrders, setTeacherOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Allow null for clearing the date
  const [highlightedDates, setHighlightedDates] = useState([]); // Store dates with bookings
  const location = useLocation();
  const { booking, lang, level, teacherId, lessonTypes, schoolId } = location.state || {};

  useEffect(() => {
    getTeachersOrder();
  }, []);

  const getTeachersOrder = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teacherOrders', {
        params: { teacherId, lessonTypes }
      });
      if (response.status === 200) {
        setTeacherOrders(response.data);

        // Collect dates for highlighting
        const datesToHighlight = response.data.flatMap(order =>
          order.time.map(el => resetTime(new Date(el.time))) // Reset time to 00:00:00
        );
        setHighlightedDates(datesToHighlight);
      }
    } catch (error) {
      console.error('Error fetching teacher orders:', error);
    }
  };

  // Helper function to reset the time to 00:00:00 for proper comparison
  const resetTime = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  // Фильтрация заказов по выбранной дате
  const filterByDate = (orders) => {
    if (!selectedDate) return orders; // If date is cleared, show all orders

    const selectedDateString = resetTime(selectedDate).toISOString().split('T')[0]; // Reset selected date to midnight

    return orders.filter(order =>
      order.time.some(el => resetTime(new Date(el.time)).toISOString().split('T')[0] === selectedDateString)
    );
  };

  return (
    <div className="booking-list-container">
      <h1 className="booking-list-title">Bookings</h1>
      <Link
        to="/add-booking"
        state={{ booking, lang, level, teacherId, lessonTypes, schoolId }}
        className="add-booking-btn"
      >
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
                  <Link
                    to={`/edit-booking/${date.d}`}
                    state={{ date, lang, level, teacherId, lessonTypes, schoolId }}
                    className="booking-link"
                    key={index}
                  >
                    <div className="booking-item">
                      <p>{new Date(date.d).toLocaleDateString()}</p> {/* Use toLocaleDateString to format */}
                    </div>
                  </Link>
                ))
              )
          ))}
      </div>

      {/* Date Picker for filtering */}
      <div className="date-picker-container">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          isClearable
          placeholderText="Select a date to filter"
          inline // This keeps the calendar always open
          highlightDates={highlightedDates} // Highlight the dates with bookings
        />
      </div>

      {/* Display filtered or all orders */}
      <div className="booking-items">
        {filterByDate(teacherOrders).flatMap(order =>
          order.time.filter(el => {
            const elDate = resetTime(new Date(el.time)).toISOString().split('T')[0];
            const selectedDateString = selectedDate ? resetTime(selectedDate).toISOString().split('T')[0] : null;
            return !selectedDate || elDate === selectedDateString; // Show all if no date is selected
          })
        ).map((el, id) => (
          <div key={id}>
            <p>{new Date(el.time).toLocaleDateString()} {new Date(el.time).toLocaleTimeString()}</p>
            <div>
              {el.students.map((std, index) => (
                <div key={index}>
                  <p>{std.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingList;
