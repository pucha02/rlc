import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function LanguagesList() {
    
    const location = useLocation();
    const { booking } = location.state || {};
    const { teacherId } = location.state || {};
    console.log(booking)
    return (
        <div>
            <h1>Bookings</h1>
            
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>All Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {booking.data.lang.map(booking => (

                        <tr key={booking._id}>
                            <td>
                                <Link to={`/levelList`} state={{ booking, lang: booking.lang, teacherId: teacherId}}>{booking.lang}</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LanguagesList;
