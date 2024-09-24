import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddTeacherForm.css';

const AddTeacherForm = ({ schoolId, fetchSchool, editingTeacher, setEditingTeacher, teacherId }) => {
    const [teacherName, setTeacherName] = useState('');
    const [teacherImg, setTeacherImg] = useState('');
    const [lang, setLang] = useState('');
    const [langs, setLangs] = useState([]);
    const [level, setLevel] = useState('');
    const [selectedLangId, setSelectedLangId] = useState('');
    const [classType, setClassType] = useState('');
    const [selectedLevelId, setSelectedLevelId] = useState('');

    useEffect(() => {
        if (editingTeacher) {
            setTeacherName(editingTeacher.teacherName);
            setTeacherImg(editingTeacher.teacherImg);
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
            ? `http://13.60.221.226/api/updateTeacher/${schoolId}`
            : `http://13.60.221.226/api/addTeacherForSchool`;
        try {
            await axios.put(url, {
                id: schoolId,
                teacherName,
                teacherImg,
                langs,
                teacherId,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            fetchSchool();
            setTeacherName('');
            setTeacherImg('')
            setLang('');
            setLangs([]);
            setEditingTeacher(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-teacher-form">
            <h1>{editingTeacher ? 'Редагувати вчителя' : 'Додати вчителя'}</h1>
            <input
                className="input-field"
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Teacher Name"
            />
            <input
                className="input-field"
                type="text"
                value={teacherImg}
                onChange={(e) => setTeacherImg(e.target.value)}
                placeholder="Teacher Image"
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
                    Додати мову
                </button>
            </div>
            <div className="langs-list">
                <h3>Додані мови:</h3>
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
                                ✖
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
                                                ✖
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
                                                                ✖
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

            {/* Додати курс section */}
            <div className="add-level-group">
                <select
                    value={selectedLangId}
                    onChange={(e) => setSelectedLangId(e.target.value)}
                    className="select-field"
                >
                    <option value="">Оберіть мову</option>
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
                    placeholder="Додати курс"
                />
                <button type="button" onClick={addLevel} className="add-level-btn">
                    Додати курс
                </button>
            </div>

            {/* Add class type section */}
            <div className="add-class-type-group">
                <select
                    value={selectedLevelId}
                    onChange={(e) => setSelectedLevelId(e.target.value)}
                    className="select-field"
                >
                    <option value="">Оберіть курс</option>
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
                    Додати тип занять
                </button>
            </div>

            <button type="submit" className="submit-btn">
                {editingTeacher ? 'Оновити вчителя' : 'Додати вчителя'}
            </button>
        </form>
    );
};

export default AddTeacherForm;
