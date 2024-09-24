import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import BookingForm from '../BookingForm/BookingForm';

function AddBookingForm() {
  const [bookingses, setBooking] = useState({ d: '', allSlots: 0, workTime: [] });
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = location.state || {};
  const { lang } = location.state || {};
  const { level } = location.state || {};
  const { teacherId } = location.state || {};
  const { lessonTypes } = location.state || {};
  const { schoolId } = location.state || {};

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedWorkTime = [...bookingses.workTime];
      updatedWorkTime[index] = { ...updatedWorkTime[index], [name]: value };
      setBooking({ ...bookingses, workTime: updatedWorkTime });
    } else {
      setBooking({ ...bookingses, [name]: value });
    }
  };

  const handleAddWorkTime = () => {
    setBooking({ ...bookingses, workTime: [...bookingses.workTime, { time: bookingses.d, slots: 0 }] });
  };

  const handleRemoveWorkTime = (index) => {
    const updatedWorkTime = bookingses.workTime.filter((_, i) => i !== index);
    setBooking({ ...bookingses, workTime: updatedWorkTime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      ...bookingses,
      lang: lang,
      levelName: level,
      lessonTypes: lessonTypes
    };

    try {
      const url = `http://13.60.221.226/api/schools/${schoolId}/teachers/${teacherId}/dateses`;
      console.log('Submitting booking:', requestBody);
      const response = await axios.put(url, requestBody);
      console.log('Server response:', response.data);
      navigate(`/${schoolId}/admin`);// Redirect back to the booking list after adding
    } catch (error) {
      console.error('Error saving booking:', error);
      if (error.response) {
        console.error('Response data:', error.response.data); // Log server response error
      }
    }
  };

  return (
    <BookingForm
      booking={bookingses}
      handleChange={handleChange}
      handleAddWorkTime={handleAddWorkTime}
      handleRemoveWorkTime={handleRemoveWorkTime}
      handleSubmit={handleSubmit}
    />
  );
}

export default AddBookingForm;
