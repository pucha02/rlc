import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BookingForm from '../BookingForm/BookingForm';

function EditBookingForm() {
  const [booking, setBooking] = useState({ d: '', allNr: 0, workTime: [] });
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { date } = location.state || {};
  const { lang } = location.state || {};
  const { level } = location.state || {};
  const { teacherId } = location.state || {};
  const { lessonTypes } = location.state || {};
  const { schoolId } = location.state || {};
  
  useEffect(() => {
    if (id) {
      async function fetchBooking() {
        try {
          console.log('Fetching booking with ID:', id);
          // Simulate fetching data
          setBooking(date);
          console.log('Fetched booking:', date);
        } catch (error) {
          console.error('Error fetching booking:', error);
        }
      }
      fetchBooking();
    }
  }, [id, date]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedWorkTime = [...booking.workTime];
      updatedWorkTime[index] = { ...updatedWorkTime[index], [name]: value };
      setBooking({ ...booking, workTime: updatedWorkTime });
      console.log('Updated work time at index', index, ':', updatedWorkTime);
    } else {
      setBooking({ ...booking, [name]: value });
      console.log('Updated booking:', { ...booking, [name]: value });
    }
  };

  const handleAddWorkTime = () => {
    const newWorkTime = { time: '', slots: 0 };
    setBooking(prevBooking => {
      const updatedWorkTime = [...prevBooking.workTime, newWorkTime];
      console.log('Added new work time:', newWorkTime);
      return { ...prevBooking, workTime: updatedWorkTime };
    });
  };

  const handleRemoveWorkTime = (index) => {
    setBooking(prevBooking => {
      const updatedWorkTime = prevBooking.workTime.filter((_, i) => i !== index);
      console.log('Removed work time at index', index, ':', updatedWorkTime);
      return { ...prevBooking, workTime: updatedWorkTime };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
      ...booking,
      lang: lang,
      levelName: level,
      lessonTypes: lessonTypes
    };
    console.log('Submitting booking:', requestBody);
    try {
      await axios.put(`http://localhost:5000/api/schools/${schoolId}/teachers/${teacherId}/dates`, requestBody);
      console.log('Booking updated successfully');
      navigate(`/${schoolId}/admin`);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  return (
    <BookingForm
      booking={booking}
      handleChange={handleChange}
      handleAddWorkTime={handleAddWorkTime}
      handleRemoveWorkTime={handleRemoveWorkTime}
      handleSubmit={handleSubmit}
      id={id}
    />
  );
}

export default EditBookingForm;
