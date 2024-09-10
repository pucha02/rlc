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
            <h1>Оберіть курс</h1>

            <div className='teacher-list'>
                {
                    booking.level.map(level => (

                        <Link to={`/bookinglist`} className="teacher-item" state={{ booking, lang: lang, level: level.levelName, teacherId: teacherId }}>{level.levelName}</Link>

                    ))

                }
            </div>
        </div>
    );
}

export default LevelList;
