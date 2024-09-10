import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddTeacherForm.css';

const AddTeacherForm = ({ schoolId, fetchSchool, editingTeacher, setEditingTeacher }) => {
    const [teacherName, setTeacherName] = useState('');
    const [lang, setLang] = useState('');
    const [langs, setLangs] = useState([]);
    const [level, setLevel] = useState('');
    const [selectedLangId, setSelectedLangId] = useState('');


    useEffect(() => {
        if (editingTeacher) {
            setTeacherName(editingTeacher.teacherName);
            setLangs(editingTeacher.lang);
        }
    }, [editingTeacher]);

    const addLevel = () => {
        if (!selectedLangId) {
            alert('Выберите язык для добавления уровня');
            return;
        }
        const newLevel = {
            id: Date.now().toString(),
            levelName: level,
            date: [],
        };

        setLangs(langs.map(lng =>
            lng.id === selectedLangId
                ? { ...lng, level: [...lng.level, newLevel] }
                : lng
        ));

        setLevel('');
    };

    const addLang = () => {
        const newLang = {
            id: Date.now().toString(),
            lang: lang,
            level: [],
        };
        setLangs([...langs, newLang]);
        setLang('');
    };

    // Edit language
    const handleEditLang = (langId, newLangName) => {
        setLangs(langs.map(lng =>
            lng.id === langId
                ? { ...lng, lang: newLangName }
                : lng
        ));
    };

    // Edit level
    const handleEditLevel = (langId, levelId, newLevelName) => {
        setLangs(langs.map(lng =>
            lng.id === langId
                ? {
                    ...lng,
                    level: lng.level.map(lvl =>
                        lvl.id === levelId ? { ...lvl, levelName: newLevelName } : lvl
                    )
                }
                : lng
        ));
    };

    // Delete language
    const handleDeleteLang = (langId) => {
        setLangs(langs.filter(lng => lng.id !== langId));
    };

    // Delete level
    const handleDeleteLevel = (langId, levelId) => {
        setLangs(langs.map(lng =>
            lng.id === langId
                ? { ...lng, level: lng.level.filter(lvl => lvl.id !== levelId) }
                : lng
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingTeacher
            ? `http://localhost:5000/updateTeacher/bbd935fb-a9bd-4412-810f-8ecd7189d5e7`
            : `http://localhost:5000/addTeacherForSchool`;
        try {
            await axios.put(url, {
                id: 'bbd935fb-a9bd-4412-810f-8ecd7189d5e7',
                teacherName,
                langs,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            fetchSchool();
            setTeacherName('');
            setLang('');
            setLangs([]);
            setEditingTeacher(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-teacher-form">
            <h1>{editingTeacher ? 'Edit Teacher' : 'Add Teacher'}</h1>
            <input
                className="input-field"
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Teacher Name"
            />
            <div className="lang-input-group">
                <input
                    className="input-field"
                    type="text"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    placeholder="Add Lang"
                />
                <button type="button" onClick={addLang} className="add-lang-btn">
                    Add Lang
                </button>
            </div>
            <div className="langs-list">
                <h3>Added Langs:</h3>
                <ul>
                    {langs.map((lng) => (
                        <li key={lng.id} className="lang-item">
                            <input
                                type="text"
                                value={lng.lang}
                                onChange={(e) => handleEditLang(lng.id, e.target.value)}
                                placeholder="Edit Language"
                            />
                            <button onClick={() => handleDeleteLang(lng.id)}>Delete Language</button>
                            <ul>
                                {lng.level.length > 0 ? (
                                    lng.level.map((lvl) => (
                                        <li key={lvl.id} className="level-item">
                                            <input
                                                type="text"
                                                value={lvl.levelName}
                                                onChange={(e) => handleEditLevel(lng.id, lvl.id, e.target.value)}
                                                placeholder="Edit Level"
                                            />
                                            <button onClick={() => handleDeleteLevel(lng.id, lvl.id)}>Delete Level</button>
                                        </li>
                                    ))
                                ) : (
                                    <li>No levels added yet</li>
                                )}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="add-level-group">
                <select
                    value={selectedLangId}
                    onChange={(e) => setSelectedLangId(e.target.value)}
                    className="select-field"
                >
                    <option value="">Select a language</option>
                    {langs.map((lng) => (
                        <option key={lng.id} value={lng.id}>
                            {lng.lang}
                        </option>
                    ))}
                </select>
                <input
                    className="input-field"
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="Add Level"
                />
                <button type="button" onClick={addLevel} className="add-level-btn">
                    Add Level
                </button>
            </div>
            <button type="submit" className="submit-btn">
                {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
            </button>
        </form>
    );
};

export default AddTeacherForm;
