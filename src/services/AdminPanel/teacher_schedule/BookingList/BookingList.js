import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import './BookingList.css'; // Import the CSS file

function BookingList() {
  const [teacherOrders, setTeacherOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // First calendar date selection
  const [highlightedDates, setHighlightedDates] = useState([]); // Store dates with bookings for first calendar
  const [selectedBookingDate, setSelectedBookingDate] = useState(new Date()); // Second calendar for booking levels
  const [highlightedBookingDates, setHighlightedBookingDates] = useState([]); // Highlighted booking level dates
  const location = useLocation();
  const { booking, lang, level, teacherId, lessonTypes, schoolId } = location.state || {};

  useEffect(() => {
    getTeachersOrder();
    collectBookingDates(); // Collect dates for the second calendar
  }, []);

  const getTeachersOrder = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teacherOrders', {
        params: { teacherId, lessonTypes }
      });
      if (response.status === 200) {
        setTeacherOrders(response.data);

        // Collect dates for highlighting (first calendar)
        const datesToHighlight = response.data.flatMap(order =>
          order.time.map(el => resetTime(new Date(el.time))) // Reset time to 00:00:00
        );
        setHighlightedDates(datesToHighlight);
      }
    } catch (error) {
      console.error('Error fetching teacher orders:', error);
    }
  };

  // Collect dates for the second calendar (booking level dates)
  const collectBookingDates = () => {
    if (booking?.level) {
      const dates = booking.level
        .filter(levels => levels.levelName === level)
        .flatMap(level =>
          level.lessonTypes
            .filter(type => type.typeName === lessonTypes)
            .flatMap(type => type.date.map(d => resetTime(new Date(d.d))))
        );
      setHighlightedBookingDates(dates);
    }
  };

  const resetTime = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const filterByDate = (orders) => {
    if (!selectedDate) return orders;
    const selectedDateString = resetTime(selectedDate).toISOString().split('T')[0];

    return orders.filter(order =>
      order.time.some(el => resetTime(new Date(el.time)).toISOString().split('T')[0] === selectedDateString)
    );
  };

  const filterByBookingDate = () => {
    if (!selectedBookingDate) return booking?.level;
    const selectedDateString = resetTime(selectedBookingDate).toISOString().split('T')[0];

    return booking?.level
      .filter(levels => levels.levelName === level)
      .map(level => ({
        ...level,
        lessonTypes: level.lessonTypes
          .filter(type => type.typeName === lessonTypes)
          .map(type => ({
            ...type,
            date: type.date.filter(d => resetTime(new Date(d.d)).toISOString().split('T')[0] === selectedDateString)
          }))
      }));
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

      <div className='teachersContent'>
        <div className='myBookings'>
        <h3>Записані учні</h3>
          <div className="date-picker-container">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              isClearable
              placeholderText="Select a date to filter"
              inline // Keep the calendar always open
              highlightDates={highlightedDates} // Highlight the dates with orders
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

        {/* Second Date Picker for filtering booking level dates */}
        <div className='myCalendar'>
          <h3>Мій графік</h3>
          <div className="date-picker-container">
            <DatePicker
              selected={selectedBookingDate}
              onChange={(date) => setSelectedBookingDate(date)}
              dateFormat="yyyy-MM-dd"
              isClearable
              placeholderText="Select a date to filter levels"
              inline // Keep the calendar always open
              highlightDates={highlightedBookingDates} // Highlight the dates in the second calendar
            />
          </div>

          {/* Display filtered or all booking level dates */}
          <div className="booking-items">
            {filterByBookingDate()?.map((level) =>
              level.lessonTypes.map((type) =>
                type.date.map((date, index) => (
                  <Link
                    to={`/edit-booking/${date.d}`}
                    state={{ date, lang, level, teacherId, lessonTypes, schoolId }}
                    className="booking-link"
                    key={index}
                  >
                    <div className="booking-item">
                      <p>{new Date(date.d).toLocaleDateString()}</p> {/* Format date */}
                    </div>
                  </Link>
                ))
              )
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default BookingList;
