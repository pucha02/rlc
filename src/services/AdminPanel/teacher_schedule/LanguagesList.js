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
            <h1>Оберіть мову</h1>

            <div className='teacher-list'>
                {booking.data.lang.map(booking => (


                    <Link to={`/levelList`} className="teacher-item" state={{ booking, lang: booking.lang, teacherId: teacherId }}>{booking.lang}</Link>

                ))}
            </div>
        </div>
    );
}

export default LanguagesList;
