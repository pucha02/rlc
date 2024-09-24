import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function TypeLessonList() {

    const location = useLocation();
    const { lessonTypes } = location.state || {};
    const { lang } = location.state || {};
    const { level } = location.state || {};
    const { teacherId } = location.state || {};
    const { booking } = location.state || {};
    const { schoolId } = location.state || {};

    return (
        <div className='teacher-list-container'>
            <h1>Оберіть Тип занять</h1>

            <div className='teacher-list'>
                {
                    lessonTypes.map(type => (

                        <Link to={`/bookinglist`} className="teacher-item" state={{ booking: booking, lang: lang, level: level, teacherId: teacherId, lessonTypes: type.typeName, schoolId: schoolId }}>{type.typeName}</Link>

                    ))

                }
            </div>
        </div>
    );
}

export default TypeLessonList;
