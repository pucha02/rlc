import React from 'react';
import './BookingForm.css'; // Import the CSS file

function BookingForm({ booking, handleChange, handleAddWorkTime, handleRemoveWorkTime, handleSubmit, id }) {
  const formatDateTimeLocal = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    // Convert to local time, remove seconds and milliseconds for input value
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="booking-form-container">
      <h1 className="form-title">{id ? 'Edit Booking' : 'Create Booking'}</h1>
      <form onSubmit={handleSubmit} className="booking-form">
        <label className="form-label">
          Date:
          <input
            className="form-input"
            type="date"
            name="d"
            value={booking.d ? booking.d.split('T')[0] : ''}
            onChange={(e) => handleChange(e, null)}
            required
          />
        </label>
        <label className="form-label">
          All Number:
          <input
            className="form-input"
            type="number"
            name="allSlots"
            value={booking.allSlots || 0}
            onChange={(e) => handleChange(e, null)}
            required
          />
        </label>
        <div className="worktime-section">
          <h2 className="worktime-title">Work Times</h2>
          {booking.workTime && booking.workTime.map((item, index) => (
            <div key={index} className="worktime-item">
              <label className="form-label">
                Time:
                <input
                  className="form-input"
                  type="datetime-local"
                  name="time"
                  value={formatDateTimeLocal(item.time)}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
              </label>
              <label className="form-label">
                Number:
                <input
                  className="form-input"
                  type="number"
                  name="slots"
                  value={item.slots || 0}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
              </label>
              <button type="button" className="remove-btn" onClick={() => handleRemoveWorkTime(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={handleAddWorkTime}>
            Add Work Time
          </button>
        </div>
        <button type="submit" className="submit-btn">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default BookingForm;
