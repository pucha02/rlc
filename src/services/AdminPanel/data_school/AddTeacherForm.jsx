import React, { useState } from 'react';
import axios from 'axios';

const AddTeacherForm = ({ schoolId, fetchSchool }) => {
    const [teacherName, setTeacherName] = useState('');
    const [lang, setLang] = useState(''); // Состояние для имени языка
    const [langs, setLangs] = useState([]); // Массив языков
    const [level, setLevel] = useState(''); // Состояние для имени уровня
    const [selectedLangId, setSelectedLangId] = useState(''); // Выбранный язык для добавления уровня

    const addLevel = () => {
        if (!selectedLangId) {
            alert('Выберите язык для добавления уровня');
            return;
        }
    
        const newLevel = {
            id: Date.now().toString(), // Генерируем уникальный id для каждого уровня
            levelName: level,
            date: [], // Инициализируем пустым массивом
        };
    
        setLangs(langs.map(lng =>
            lng.id === selectedLangId
                ? { ...lng, level: [...lng.level, newLevel] } // Заменено на levels
                : lng
        ));
    
        setLevel(''); 
    };

    const addLang = () => {
        const newLang = {
            id: Date.now().toString(),
            lang: lang,
            level: [], // Инициализируем пустым массивом уровней
        };
        setLangs([...langs, newLang]);
        setLang(''); // Очищаем поле после добавления языка
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:5000/addTeacherForSchool`,
                {
                    id: 'bbd935fb-a9bd-4412-810f-8ecd7189d5e7',
                    teacherName,
                    langs, 
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(langs);
            fetchSchool();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Teacher Name"
            />
            <div>
                <input
                    type="text"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    placeholder="Add Lang"
                />
                <button type="button" onClick={addLang}>
                    Add Lang
                </button>
            </div>
            <div>
                <h3>Added Langs:</h3>
                <ul>
                    {langs.map((lng) => (
                        <li key={lng.id}>
                            <strong>{lng.lang}</strong> (id: {lng.id})
                            <ul>
                                {lng.level.length > 0 ? (
                                    lng.level.map((lvl) => (
                                        <li key={lvl.id}>
                                            {lvl.levelName} (id: {lvl.id})
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
            <div>
                <select
                    value={selectedLangId}
                    onChange={(e) => setSelectedLangId(e.target.value)}
                >
                    <option value="">Select a language</option>
                    {langs.map((lng) => (
                        <option key={lng.id} value={lng.id}>
                            {lng.lang}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="Add Level"
                />
                <button type="button" onClick={addLevel}>
                    Add Level
                </button>
            </div>
            <button type="submit">Add Teacher</button>
        </form>
    );
};

export default AddTeacherForm;
