import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddLanguageForm.css';

const AddLanguageForm = ({ schoolId, fetchSchool, editingLang, setEditingLang }) => {
    const [lang, setLang] = useState(''); // Язык — строка
    const [level, setLevel] = useState(''); // Для добавления нового уровня
    const [levels, setLevels] = useState([]); // Список уровней
    const [price, setPrice] = useState(null);
    const [selectedLevelId, setSelectedLevelId] = useState(null); // Текущий выбранный уровень
    const [classType, setClassType] = useState(''); // Для добавления типов занятий

    useEffect(() => {
        if (editingLang) {
            setLang(editingLang.lang); // Язык - это строка, например 'English'
            setLevels(editingLang.level); // Уровни - массив
        }
    }, [editingLang]);

    // Добавить новый уровень
    const addLevel = () => {
        const newLevel = {
            id: Date.now(),
            levelName: level,
            lessonTypes: [] // Инициализировать пустым массивом
        };
        setLevels([...levels, newLevel]);
        setLevel(''); // Очистить поле ввода
    };

    // Добавить тип занятий к выбранному уровню
    const addClassType = () => {
        if (selectedLevelId !== null && price !== null) { // Убедиться, что цена введена
            setLevels(levels.map(lvl => {
                if (lvl.id === selectedLevelId) {
                    return {
                        ...lvl,
                        lessonTypes: [...lvl.lessonTypes, { id: Date.now(), typeName: classType, price: price }]
                    };
                }
                return lvl;
            }));
            setClassType(''); // Очистить поле типа занятий
            setPrice(''); // Очистить поле цены
        }
    };

    // Удалить тип занятий из уровня
    const deleteClassType = (levelId, classTypeId) => {
        setLevels(levels.map(lvl => {
            if (lvl.id === levelId) {
                return {
                    ...lvl,
                    lessonTypes: lvl.lessonTypes.filter(ct => ct.id !== classTypeId)
                };
            }
            return lvl;
        }));
    };

    // Изменить тип занятия
    const handleClassTypeChange = (levelId, classTypeId, newTypeName) => {
        setLevels(levels.map(lvl =>
            lvl.id === levelId
                ? {
                    ...lvl,
                    lessonTypes: lvl.lessonTypes.map(ct =>
                        ct.id === classTypeId
                            ? { ...ct, typeName: newTypeName }
                            : ct
                    )
                }
                : lvl
        ));
    };

    // Изменить цену типа занятий
    const handlePriceChange = (levelId, classTypeId, newPrice) => {
        setLevels(levels.map(lvl =>
            lvl.id === levelId
                ? {
                    ...lvl,
                    lessonTypes: lvl.lessonTypes.map(ct =>
                        ct.id === classTypeId
                            ? { ...ct, price: newPrice }
                            : ct
                    )
                }
                : lvl
        ));
    };

    // Изменить название уровня
    const handleLevelNameChange = (levelId, newLevelName) => {
        setLevels(levels.map(lvl =>
            lvl.id === levelId
                ? { ...lvl, levelName: newLevelName }
                : lvl
        ));
    };

    // Отправить данные на сервер
    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = editingLang
            ? `http://13.60.221.226/api/editLanguageForSchool/${schoolId}/${editingLang.id}`
            : 'http://13.60.221.226/api/addLanguageForSchool';

        const payload = {
            id: schoolId,
            lang, // Язык
            levels // Уровни
        };

        try {
            await axios.put(endpoint, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            fetchSchool(); // Обновить данные школы
            resetForm(); // Сброс формы
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    // Сброс формы
    const resetForm = () => {
        setLang('');
        setLevels([]);
        setClassType('');
        setLevel('');
        setEditingLang(null);
    };

    return (
        <form onSubmit={handleSubmit} className="language-form">
            <h1>{editingLang ? 'Редагувати мову' : 'Додати мову'}</h1>
            <div className="input-group">
                <input
                    type="text"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    placeholder="Введіть мову"
                    className="input-field"
                />
            </div>
            <div className="input-group">
                <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="Введіть курс"
                    className="input-field"
                />
                <button type="button" onClick={addLevel} className="add-button">
                    Додати курс
                </button>
            </div>
            <div className="levels-list">
                <h3>Додані курси:</h3>

                <ul>
                    <h4>Додайте та оберіть курс для додавання типу занять та ціни</h4>
                    {levels.map(lvl => (
                        <li key={lvl.id} className="level-item">
                            <input
                                type="text"
                                value={lvl.levelName}
                                onChange={(e) => handleLevelNameChange(lvl.id, e.target.value)}
                                className="input-field"
                                placeholder="Назва курсу"
                            />

                            <ul>
                                {lvl.lessonTypes.map(ct => (
                                    <li key={ct.id}>
                                        <input
                                            type="text"
                                            value={ct.typeName}
                                            onChange={(e) => handleClassTypeChange(lvl.id, ct.id, e.target.value)}
                                            className="input-field"
                                            disabled
                                        />
                                        <input
                                            type="number"
                                            value={ct.price}
                                            onChange={(e) => handlePriceChange(lvl.id, ct.id, e.target.value)}
                                            className="input-field"
                                            placeholder="Ціна"
                                        />
                                        <button onClick={() => deleteClassType(lvl.id, ct.id)} className="delete-button">
                                            ✖
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="button"
                                onClick={() => setSelectedLevelId(lvl.id)}
                                className={`select-button ${selectedLevelId === lvl.id ? 'selected' : ''}`}>
                                {selectedLevelId === lvl.id ? 'Обрано' : 'Обрати'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {selectedLevelId && (
                <div className="input-group">
                    <select
                        value={classType}
                        onChange={(e) => setClassType(e.target.value)}
                        className="input-field"
                    >
                        <option value="" disabled>Виберіть тип занять</option>
                        <option value="Індивідуальні">Індивідуальні</option>
                        <option value="Парні">Парні</option>
                        <option value="Групові">Групові</option>
                    </select>
                    <input
                        type="number" // Поле для ввода цены
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Введіть ціну"
                        className="input-field"
                    />
                    <button type="button" onClick={addClassType} className="add-button">
                        Додати тип занять до вибраного рівня
                    </button>
                </div>
            )}


            <button type="submit" className="submit-button">
                {editingLang ? 'Оновити дані' : 'Додати мову'}
            </button>
            {editingLang && <button type="button" onClick={resetForm} className="cancel-button">Скасувати</button>}
        </form>
    );
};

export default AddLanguageForm;
