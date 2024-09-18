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

        const datesToHighlight = response.data.flatMap(order =>
          order.time.filter(el => el.lang == lang && el.levelName == level && el.lessonTypes == lessonTypes && el.teacherId == teacherId).map(t => resetTime(new Date(t.time))) // Reset time to 00:00:00
        );
        setHighlightedDates(datesToHighlight);
      }
    } catch (error) {
      console.error('Error fetching teacher orders:', error);
    }
  };

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

  // Handle payment status change
  const handlePaymentStatusChange = async (orderId, teacherId, lang, levelName, lessonTypes, time, newStatus) => {
    try {
      // Обновляем локально
      setTeacherOrders(prevOrders =>
        prevOrders.map(order => {
          if (order._id === orderId) {
            return {
              ...order,
              time: order.time.map(timeEntry =>
                timeEntry.time === time ? { ...timeEntry, payment_status: newStatus } : timeEntry
              )
            };
          }
          return order;
        })
      );

      // Отправляем обновление на сервер
      await axios.put(`http://localhost:5000/api/updatePaymentStatus`, {
        orderId,
        teacherId,
        lang,
        levelName,
        lessonTypes,
        time,
        newStatus
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleDeleteTimeEntry = async (orderId, teacherId, lang, levelName, lessonTypes, time) => {
    try {
      // Выполняем запрос на удаление
      await axios.delete(`http://localhost:5000/api/deleteTimeEntry`, {
        data: { orderId, teacherId, lang, levelName, lessonTypes, time }
      });

      // Обновляем локальное состояние
      setTeacherOrders(prevOrders =>
        prevOrders.map(order => {
          if (order._id === orderId) {
            // Возвращаем новый массив time без удаленного элемента
            return {
              ...order,
              time: order.time.filter(
                timeEntry =>
                  !(timeEntry.teacherId === teacherId &&
                    timeEntry.lang === lang &&
                    timeEntry.levelName === levelName &&
                    timeEntry.lessonTypes === lessonTypes &&
                    timeEntry.time === time)
              )
            };
          }
          return order;
        })
      );

    } catch (error) {
      console.error('Error deleting time entry:', error);
    }
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

          <div className="booking-items">
            {filterByDate(teacherOrders).flatMap(order =>
              order.time.filter(el => {
                const elDate = resetTime(new Date(el.time)).toISOString().split('T')[0];
                const selectedDateString = selectedDate ? resetTime(selectedDate).toISOString().split('T')[0] : null;

                return el.lang === lang
                  && el.levelName === level
                  && el.lessonTypes === lessonTypes
                  && el.teacherId === teacherId
                  && (!selectedDate || elDate === selectedDateString);
              }).map((el, id) => (
                <div key={id}>
                  <div>
                    {new Date(el.time).toLocaleDateString()}{' '}
                    {`${String(new Date(el.time).getUTCHours()).padStart(2, '0')}:${String(new Date(el.time).getUTCMinutes()).padStart(2, '0')}:${String(new Date(el.time).getUTCSeconds()).padStart(2, '0')}`}
                    <select
                      value={el.payment_status}
                      onChange={(e) => handlePaymentStatusChange(
                        order._id,
                        el.teacherId, // Добавьте teacherId
                        el.lang, // Добавьте lang
                        el.levelName, // Добавьте levelName
                        el.lessonTypes, // Добавьте lessonTypes
                        el.time, // Используйте el.time
                        e.target.value // Новый статус
                      )}
                    >
                      <option value="Не оплачено">Не оплачено</option>
                      <option value="Оплачено">Оплачено</option>
                    </select>
                    <p>{el.payment_status}</p>
                    <p>{el.teacherName}</p>
                    <div onClick={() => handleDeleteTimeEntry(
                      order._id,
                      el.teacherId,
                      el.lang,
                      el.levelName,
                      el.lessonTypes,
                      el.time)}>
                      УДАЛИТЬ</div>
                  </div>
                  <div>
                    {el.students.map((std, index) => (
                      <div key={index}>
                        <p>{std.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

          </div>

        </div>

        <div className='myCalendar'>
          <h3>Мій графік</h3>
          <div className="date-picker-container">
            <DatePicker
              selected={selectedBookingDate}
              onChange={(date) => setSelectedBookingDate(date)}
              dateFormat="yyyy-MM-dd"
              isClearable
              placeholderText="Select a date to filter levels"
              inline
              highlightDates={highlightedBookingDates}
            />
          </div>

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

    </div >
  );
}

export default BookingList;
