import React, { useState } from 'react';
import axios from 'axios';

const AddLanguageForm = ({ schoolId, fetchSchool }) => {
    const [lang, setLang] = useState(''); // Состояние для языка
    const [level, setLevel] = useState(''); // Состояние для имени уровня
    const [levels, setLevels] = useState([]); // Массив уровней

    // Добавление уровня в массив уровней
    const addLevel = () => {
        const newLevel = {
            id: Date.now(), // Генерируем уникальный id для каждого уровня
            levelName: level
        };
        setLevels([...levels, newLevel]);
        setLevel(''); // Очищаем поле после добавления уровня
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ levels }); // Проверьте, что отправляются правильные значения

        try {
            await axios.put(
                `http://localhost:5000/addLanguageForSchool`,
                {
                    id: 'bbd935fb-a9bd-4412-810f-8ecd7189d5e7',
                    lang,
                    levels
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            fetchSchool();
        } catch (error) {
            if (error.response) {
                console.log('Данные ответа:', error.response.data);
                console.log('Код состояния:', error.response.status);
                console.log('Заголовки ответа:', error.response.headers);
            } else if (error.request) {
                console.log('Запрос:', error.request);
            } else {
                console.log('Ошибка:', error.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    placeholder="Language"
                />
            </div>
            <div>
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
            <div>
                <h3>Added Levels:</h3>
                <ul>
                    {levels.map((lvl) => (
                        <li key={lvl.id}>
                            {lvl.levelName} (id: {lvl.id})
                        </li>
                    ))}
                </ul>
            </div>
            <button type="submit">Add Language with Levels</button>
        </form>
    );
};

export default AddLanguageForm;
