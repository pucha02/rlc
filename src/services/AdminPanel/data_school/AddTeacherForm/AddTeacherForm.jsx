import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddTeacherForm.css';

const AddTeacherForm = ({ schoolId, fetchSchool, editingTeacher, setEditingTeacher, teacherId, school }) => {
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
            alert('Виберіть мову для доповнення рівня');
            return;
        }

        const newLevel = {
            id: Date.now().toString(),
            levelName: level,
            lessonTypes: [],
            date: [],
        };

        setLangs(langs.map(lng =>
            lng.lang === selectedLangId
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
            alert('Виберіть рівень для доповнення типу зайнятостей');
            return;
        }
        const newClassType = {
            id: Date.now().toString(),
            typeName: classType,
        };

        setLangs(langs.map(lng =>
            lng.lang === selectedLangId
                ? {
                    ...lng,
                    level: lng.level.map(lvl =>
                        lvl.levelName === selectedLevelId
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
                placeholder="Ім'я вчителя"
            />
            <input
                className="input-field"
                type="text"
                value={teacherImg}
                onChange={(e) => setTeacherImg(e.target.value)}
                placeholder="Посилання на фотографію (напр. https://i.postimg.cc/63c0Qbkn/image.jpg)"
            />
            <div className="lang-input-group">
                <select
                    value={selectedLangId}
                    onChange={(e) => {
                        const selectedLang = school.ESL.language.find(lang => lang.id === e.target.value);
                        setSelectedLangId(e.target.value);
                        setLang(selectedLang?.lang || ''); // Устанавливаем выбранный язык в setLang
                    }}
                    className="select-field"
                >
                    <option value="">Оберіть мову</option>
                    {school.ESL.language.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                            {lang.lang}
                        </option>
                    ))}
                </select>
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
                    onChange={(e) => { setSelectedLangId(e.target.value) }}
                    className="select-field"
                >
                    <option value="">Оберіть мову</option>
                    {langs.map((lng) => (
                        <option key={lng.id} value={lng.lang} onChange={() => setLang(lng.lang)}>
                            {lng.lang}
                        </option>
                    ))}
                </select>
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="select-field"
                >
                    <option value="">Оберіть курс</option>
                    {console.log(selectedLangId)}
                    {school.ESL.language
                        .filter((lang) => lang.lang === selectedLangId) // Сравниваем по имени языка
                        .flatMap((lang) => lang.level) // Получаем уровни выбранного языка
                        .map((lvl) => (
                            <option key={lvl.levelName} value={lvl.levelName}>
                                {lvl.levelName}
                            </option>
                        ))}
                </select>
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
                        .filter(lng => lng.lang === selectedLangId)
                        .flatMap(lng => lng.level)
                        .map((lvl) => (
                            <option key={lvl.id} value={lvl.levelName}>
                                {lvl.levelName}
                            </option>
                        ))}
                </select>
               
                <select
                    value={classType}
                    onChange={(e) => setClassType(e.target.value)}
                    className="select-field"
                >
                    <option value="">Оберіть тип занять</option>
                    
                    {school.ESL.language
                        .filter((lang) => lang.lang === selectedLangId)
                        .flatMap((lang) => lang.level)
                        .filter((level) => level.levelName === selectedLevelId)
                        .flatMap((level) => level.lessonTypes)
                        .map((type) => (
                            <option key={type.typeName} value={type.typeName}>
                                {type.typeName}
                            </option>
                        ))}
                </select>
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
