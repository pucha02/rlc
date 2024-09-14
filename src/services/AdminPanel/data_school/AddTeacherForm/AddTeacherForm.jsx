import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddTeacherForm.css';

const AddTeacherForm = ({ schoolId, fetchSchool, editingTeacher, setEditingTeacher, teacherId }) => {
    const [teacherName, setTeacherName] = useState('');
    const [lang, setLang] = useState('');
    const [langs, setLangs] = useState([]);
    const [level, setLevel] = useState('');
    const [selectedLangId, setSelectedLangId] = useState('');
    const [classType, setClassType] = useState('');
    const [selectedLevelId, setSelectedLevelId] = useState('');

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
            lessonTypes: [],
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

    const addClassType = () => {
        if (!selectedLevelId) {
            alert('Выберите уровень для добавления типа занятий');
            return;
        }
        const newClassType = {
            id: Date.now().toString(),
            typeName: classType,
        };

        setLangs(langs.map(lng =>
            lng.id === selectedLangId
                ? {
                    ...lng,
                    level: lng.level.map(lvl =>
                        lvl.id === selectedLevelId
                            ? { ...lvl, lessonTypes: [...lvl.lessonTypes, newClassType] }
                            : lvl
                    ),
                }
                : lng
        ));
        setClassType('');
    };

    const handleEditLang = (langId, newLangName) => {
        setLangs(langs.map(lng =>
            lng.id === langId
                ? { ...lng, lang: newLangName }
                : lng
        ));
    };

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

    const handleDeleteLang = (langId) => {
        setLangs(langs.filter(lng => lng.id !== langId));
    };

    const handleDeleteLevel = (langId, levelId) => {
        setLangs(langs.map(lng =>
            lng.id === langId
                ? { ...lng, level: lng.level.filter(lvl => lvl.id !== levelId) }
                : lng
        ));
    };

    const handleDeleteClassType = (langId, levelId, classTypeId) => {
        setLangs(langs.map(lng =>
            lng.id === langId
                ? {
                    ...lng,
                    level: lng.level.map(lvl =>
                        lvl.id === levelId
                            ? { ...lvl, lessonTypes: lvl.lessonTypes.filter(cls => cls.id !== classTypeId) }
                            : lvl
                    )
                }
                : lng
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingTeacher
            ? `http://localhost:5000/updateTeacher/${schoolId}`
            : `http://localhost:5000/addTeacherForSchool`;
        try {
            await axios.put(url, {
                id: schoolId,
                teacherName,
                langs,
                teacherId,
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
                    placeholder="Add Language"
                />
                <button type="button" onClick={addLang} className="add-lang-btn">
                    Add Language
                </button>
            </div>
            <div className="langs-list">
                <h3>Added Languages:</h3>
                <ul>
                    {langs.map((lng) => (
                        <li key={lng.id} className="lang-item">
                            <input
                                type="text"
                                value={lng.lang}
                                onChange={(e) => handleEditLang(lng.id, e.target.value)}
                                placeholder="Edit Language"
                            />
                            <button className="delete-btn" onClick={() => handleDeleteLang(lng.id)}>
                                Delete
                            </button>
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
                                            <button className="delete-btn" onClick={() => handleDeleteLevel(lng.id, lvl.id)}>
                                                Delete
                                            </button>
                                            
                                            {/* Class types for each level */}
                                            <ul>
                                                {lvl.lessonTypes.length > 0 ? (
                                                    lvl.lessonTypes.map((cls) => (
                                                        <li key={cls.id} className="class-type-item">
                                                            <input
                                                                type="text"
                                                                value={cls.typeName}
                                                                onChange={(e) => {
                                                                    const updatedClassTypes = lvl.lessonTypes.map(ct =>
                                                                        ct.id === cls.id
                                                                            ? { ...ct, lessonTypes: e.target.value }
                                                                            : ct
                                                                    );
                                                                    setLangs(langs.map(lng =>
                                                                        lng.id === selectedLangId
                                                                            ? {
                                                                                ...lng,
                                                                                level: lng.level.map(lvl =>
                                                                                    lvl.id === selectedLevelId
                                                                                        ? { ...lvl, lessonTypes: updatedClassTypes }
                                                                                        : lvl
                                                                                ),
                                                                            }
                                                                            : lng
                                                                    ));
                                                                }}
                                                                placeholder="Edit Class Type"
                                                            />
                                                            <button className="delete-btn" onClick={() => handleDeleteClassType(lng.id, lvl.id, cls.id)}>
                                                                Delete Class Type
                                                            </button>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>No class types added yet</li>
                                                )}
                                            </ul>
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

            {/* Add level section */}
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

            {/* Add class type section */}
            <div className="add-class-type-group">
                <select
                    value={selectedLevelId}
                    onChange={(e) => setSelectedLevelId(e.target.value)}
                    className="select-field"
                >
                    <option value="">Select a level</option>
                    {langs
                        .filter(lng => lng.id === selectedLangId)
                        .flatMap(lng => lng.level)
                        .map((lvl) => (
                            <option key={lvl.id} value={lvl.id}>
                                {lvl.levelName}
                            </option>
                        ))}
                </select>
                <input
                    className="input-field"
                    type="text"
                    value={classType}
                    onChange={(e) => setClassType(e.target.value)}
                    placeholder="Add Class Type"
                />
                <button type="button" onClick={addClassType} className="add-class-type-btn">
                    Add Class Type
                </button>
            </div>

            <button type="submit" className="submit-btn">
                {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
            </button>
        </form>
    );
};

export default AddTeacherForm;
