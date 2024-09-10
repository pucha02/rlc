import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddLanguageForm from '../AddLanguageForm/AddLanguageForm';
import AddTeacherForm from '../AddTeacherForm/AddTeacherForm';
import './SchoolDetail.css';

const SchoolDetail = ({ schoolId }) => {
    const [school, setSchool] = useState(null);
    const [editingLang, setEditingLang] = useState(null);
    const [editingTeacher, setEditingTeacher] = useState(null); // Для редактирования учителя

    const fetchSchool = async () => {
        const res = await axios.get('http://localhost:5000/api/schools');
        setSchool(res.data[0]);
        console.log(res.data);
    };

    useEffect(() => {
        fetchSchool();
    }, [schoolId]);

    const deleteLanguage = async (languageId) => {
        try {
            await axios.delete(`http://localhost:5000/deleteLanguageFromSchool/bbd935fb-a9bd-4412-810f-8ecd7189d5e7/${languageId}`);
            fetchSchool();
        } catch (error) {
            console.error('Error deleting language:', error);
        }
    };

    const deleteLevel = async (languageId, levelId) => {
        try {
            await axios.delete(`http://localhost:5000/deleteLevelFromLanguage/bbd935fb-a9bd-4412-810f-8ecd7189d5e7/${languageId}/${levelId}`);
            fetchSchool();
        } catch (error) {
            console.error('Error deleting level:', error);
        }
    };

    const deleteTeacher = async (teacherId) => {
        try {
            await axios.delete(`http://localhost:5000/deleteTeacherFromSchool/bbd935fb-a9bd-4412-810f-8ecd7189d5e7/${teacherId}`);
            fetchSchool();
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }
    };

    const startEditTeacher = (teacher) => {
        setEditingTeacher(teacher);
    };

    if (!school) return <p>Loading...</p>;

    return (
        <div className="school-detail">
            <h2 className="school-name">{school.ESL.schoolName}</h2>
            <h3>Languages:</h3>
            <ul className="language-list">
                {school.ESL.language.map(lang => (
                    <li key={lang.id} className="language-item">
                        {lang.lang}
                        <button onClick={() => deleteLanguage(lang.id)} className="delete-button">Delete</button>
                        <button onClick={() => setEditingLang(lang)} className="edit-button">Edit</button>
                        <ul>
                            {lang.level.map(l => (
                                <li key={l.id} className="level-item">
                                    {l.levelName}
                                    <button onClick={() => deleteLevel(lang.id, l.id)} className="delete-button">Delete Level</button>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <h3>Teachers:</h3>
            <ul className="teacher-list">
                {school.ESL.teacher.map(t => (
                    <li key={t.data.teacherId} className="teacher-item">
                        {t.data.teacherName}
                        <button onClick={() => deleteTeacher(t.data.teacherId)} className="delete-button">Delete</button>
                        <button onClick={() => startEditTeacher(t.data)} className="edit-button">Edit</button>
                    </li>
                ))}
            </ul>

            <AddLanguageForm
                schoolId={schoolId}
                fetchSchool={fetchSchool}
                editingLang={editingLang}
                setEditingLang={setEditingLang}
            />
            <AddTeacherForm
                schoolId={schoolId}
                fetchSchool={fetchSchool}
                editingTeacher={editingTeacher} // Передаем редактируемого учителя
                setEditingTeacher={setEditingTeacher} // Для сброса редактируемого учителя
            />
        </div>
    );
};

export default SchoolDetail;
