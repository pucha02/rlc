import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddLanguageForm from './AddLanguageForm';
import AddTeacherForm from './AddTeacherForm';

const SchoolDetail = ({ schoolId }) => {
    const [school, setSchool] = useState(null);

    const fetchSchool = async () => {
        const res = await axios.get(`http://localhost:5000/api/schools`);
        setSchool(res.data[0]);
        console.log(res.data)
    };

    useEffect(() => {
        fetchSchool();
    }, [schoolId]);

    if (!school) return <p>Loading...</p>;

    return (
        <div>
            <h2>{school.ESL.schoolName}</h2>
            <h3>Languages:</h3>
            <ul>
                {school.ESL.language.map(lang => (
                    <li key={lang.id}>{lang.lang} (Levels: {lang.level.map(l => l.levelName).join(', ')})</li>
                ))}
            </ul>

            <h3>Teachers:</h3>
            <ul>
                {school.ESL.teacher.map(t => (
                    <li key={t.data.teacherId}>{t.data.teacherName}</li>
                ))}
            </ul>

            <AddLanguageForm schoolId={schoolId} fetchSchool={fetchSchool} />
            <AddTeacherForm schoolId={schoolId} fetchSchool={fetchSchool} />
            {/* Add forms for adding work/non-work times and levels */}
        </div>
    );
};

export default SchoolDetail;
