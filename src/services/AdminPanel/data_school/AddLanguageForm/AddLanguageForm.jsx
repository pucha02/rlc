import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddLanguageForm.css';

const AddLanguageForm = ({ schoolId, fetchSchool, editingLang, setEditingLang }) => {
    const [lang, setLang] = useState('');
    const [level, setLevel] = useState(''); // For adding a new level
    const [levels, setLevels] = useState([]); // List of levels
    const [price, setPrice] = useState(null)
    const [selectedLevelId, setSelectedLevelId] = useState(null); // Track selected level for class types
    const [classType, setClassType] = useState(''); // For adding class types

    useEffect(() => {
        if (editingLang) {
            setLang(editingLang.lang);
            setLevels(editingLang.level);
        }
    }, [editingLang]);

    // Add a new level
    const addLevel = () => {
        const newLevel = {
            id: Date.now(),
            levelName: level,
            lessonTypes: [] // Initialize with empty class types array
        };
        setLevels([...levels, newLevel]);
        setLevel(''); // Reset level input
    };

    // Add a class type to the selected level
    const addClassType = () => {
        if (selectedLevelId !== null && price !== null) { // Check that price is entered
            setLevels(levels.map(lvl => {
                if (lvl.id === selectedLevelId) {
                    return {
                        ...lvl,
                        lessonTypes: [...lvl.lessonTypes, { id: Date.now(), typeName: classType, price: price }]
                    };
                }
                return lvl;
            }));
            setClassType(''); // Reset class type input
            setPrice(''); // Reset price input
        }
    };


    // Delete a class type from a specific level
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = editingLang
            ? `http://13.60.221.226/api/editLanguageForSchool/${schoolId}/${editingLang.id}`
            : 'http://13.60.221.226/api/addLanguageForSchool';

        const payload = {
            id: schoolId,
            lang,
            levels
        };

        try {
            await axios.put(endpoint, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            fetchSchool();
            resetForm();
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    const resetForm = () => {
        setLang('');
        setLevels([]);
        setClassType('');
        setLevel('');
        setEditingLang(null);
    };

    return (
        <form onSubmit={handleSubmit} className="language-form">
            <h1>{editingLang ? 'Edit Language' : 'Add Language'}</h1>
            <div className="input-group">
                <input
                    type="text"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    placeholder="Language"
                    className="input-field"
                />
            </div>
            <div className="input-group">
                <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="Add course"
                    className="input-field"
                />
                <button type="button" onClick={addLevel} className="add-button">
                    Додати курс
                </button>
            </div>
            <div className="levels-list">
                <h3>Додані курси:</h3>
                <ul>
                    {levels.map(lvl => (
                        <li key={lvl.id} className="level-item">
                            {lvl.levelName}

                            <ul>
                                {lvl.lessonTypes.map(ct => (
                                    <li key={ct.id}>

                                        {ct.typeName} - {ct.price}
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
                    <input
                        type="text"
                        value={classType}
                        onChange={(e) => setClassType(e.target.value)}
                        placeholder="Add Class Type"
                        className="input-field"
                    />
                    <input
                        type="number" // Number input for price
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter Price"
                        className="input-field"
                    />
                    <button type="button" onClick={addClassType} className="add-button">
                        Додати вид занять до вибраного рівня
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
