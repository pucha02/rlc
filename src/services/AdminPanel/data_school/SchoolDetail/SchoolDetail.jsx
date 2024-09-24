import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import AddLanguageForm from '../AddLanguageForm/AddLanguageForm';
import AddTeacherForm from '../AddTeacherForm/AddTeacherForm';
import './SchoolDetail.css';

const SchoolDetail = () => {
    const [school, setSchool] = useState(null);
    const [editingLang, setEditingLang] = useState(null);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [teacherId, setTeacherId] = useState(null);
    const location = useLocation()
    const { schoolId } = location.state || {};
    console.log(schoolId)
    const fetchSchool = async () => {
        const res = await axios.get(`http://13.60.221.226/api/schools/${schoolId}`);
        setSchool(res.data[0]);
        console.log(res.data);
    };

    useEffect(() => {
        fetchSchool();
    }, [schoolId]);

    const deleteLanguage = async (languageId) => {
        try {
            await axios.delete(`http://13.60.221.226/api/deleteLanguageFromSchool/${schoolId}/${languageId}`);
            fetchSchool();
        } catch (error) {
            console.error('Error deleting language:', error);
        }
    };

    const deleteLevel = async (languageId, levelId) => {
        try {
            await axios.delete(`http://13.60.221.226/api/deleteLevelFromLanguage/${schoolId}/${languageId}/${levelId}`);
            fetchSchool();
        } catch (error) {
            console.error('Error deleting level:', error);
        }
    };

    const deleteClassType = async (languageId, levelId, classTypeId) => {
        try {
            console.log(languageId, levelId, classTypeId); // Check if these values are correct

            await axios.delete(`http://13.60.221.226/api/deleteClassTypeFromLevel/${schoolId}`, {
                data: { languageId, levelId, classTypeId } // Sending data in the body
            });

            fetchSchool(); // Fetch the updated school info after deletion
        } catch (error) {
            console.error('Error deleting class type:', error);
        }
    };



    const deleteTeacher = async (teacherId) => {
        try {
            await axios.delete(`http://13.60.221.226/api/deleteTeacherFromSchool/${schoolId}/${teacherId}`);
            fetchSchool();
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }
    };

    const startEditTeacher = (teacher, teacherId) => {
        setEditingTeacher(teacher);
        setTeacherId(teacherId)
    };

    if (!school) return <p>Loading...</p>;

    return (
        <div className="school-detail">
            <h2 className="school-name">{school.ESL.schoolName}</h2>
            <h3>Мови:</h3>
            <ul className="language-list">
                {school.ESL.language.map(lang => (
                    <li key={lang.id} className="language-item">
                        {lang.lang}
                        <button onClick={() => deleteLanguage(lang.id)} className="delete-button">Видалити</button>
                        <button onClick={() => setEditingLang(lang)} className="edit-button">Редагувати</button>
                        <ul>
                            {lang.level.map(lvl => (
                                <li key={lvl.id} className="level-item">
                                    {lvl.levelName}
                                    <button onClick={() => deleteLevel(lang.id, lvl.id)} className="delete-button">Видалити</button>
                                    <ul>
                                        {lvl.lessonTypes.map(ct => (
                                            <li key={ct.id} className="class-type-item">
                                                {ct.typeName}
                                                {console.log(ct.id)}
                                                <button onClick={() => deleteClassType(lang.id, lvl.id, ct.id)} className="delete-button">Видалити</button>
                                            </li>
                                        ))}
                                    </ul>
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
                        <button onClick={() => deleteTeacher(t.data.teacherId)} className="delete-button">Видалити</button>
                        <button onClick={() => startEditTeacher(t.data, t.data.teacherId)} className="edit-button">Редагувати</button>
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
                editingTeacher={editingTeacher}
                setEditingTeacher={setEditingTeacher}
                teacherId={teacherId}
            />
        </div>
    );
};

export default SchoolDetail;
