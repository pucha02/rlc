import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function LevelList() {

    const location = useLocation();
    const { booking } = location.state || {};
    const { lang } = location.state || {};
    const { teacherId } = location.state || {};

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
                    {
                        booking.level.map(level => (
                            <tr key={level._id}>
                                <td>
                                    <Link to={`/bookinglist`} state={{ booking, lang: lang, level: level.levelName, teacherId: teacherId }}>{level.levelName}</Link>
                                </td>
                            </tr>
                        ))

                    }
                </tbody>
            </table>
        </div>
    );
}

export default LevelList;
