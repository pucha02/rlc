import React from 'react';

function BookingForm({ booking, handleChange, handleAddWorkTime, handleRemoveWorkTime, handleSubmit, id }) {

  const formatDateTimeLocal = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };



  return (
    <div>
      <h1>{id ? 'Edit Booking' : 'Create Booking'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input
            type="date"
            name="d"
            value={booking.d ? booking.d.split('T')[0] : ''} // Handle undefined booking.d
            onChange={(e) => handleChange(e, null)}
            required
          />
        </label>
        <label>
          All Number:
          <input
            type="number"
            name="allSlots"
            value={booking.allSlots || 0} // Handle undefined booking.allNr
            onChange={(e) => handleChange(e, null)}
            required
          />
        </label>
        <div>
          <h2>Work Times</h2>
          {booking.workTime && booking.workTime.map((item, index) => (
            <div key={index}>
              <label>
                Time:
                <input
                  type="datetime-local"
                  name="time"
                  value={formatDateTimeLocal(item.time)} // Format the time correctly
                  onChange={(e) => handleChange(e, index)}
                  required
                />
              </label>
              <label>
                Number:
                <input
                  type="number"
                  name="slots"
                  value={item.slots || 0} // Handle undefined item.nr
                  onChange={(e) => handleChange(e, index)}
                  required
                />
              </label>
              <button type="button" onClick={() => handleRemoveWorkTime(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddWorkTime}>
            Add Work Time
          </button>
        </div>
        <button type="submit">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default BookingForm;
