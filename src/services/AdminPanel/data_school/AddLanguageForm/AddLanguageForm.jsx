import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddLanguageForm.css';

const AddLanguageForm = ({ schoolId, fetchSchool, editingLang, setEditingLang }) => {
    const [lang, setLang] = useState('');
    const [level, setLevel] = useState(''); // For adding a new level
    const [levels, setLevels] = useState([]); // List of levels
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
        if (selectedLevelId !== null) {
            setLevels(levels.map(lvl => {
                if (lvl.id === selectedLevelId) {
                    return {
                        ...lvl,
                        lessonTypes: [...lvl.lessonTypes, { id: Date.now(), typeName: classType }]
                    };
                }
                return lvl;
            }));
            setClassType(''); // Reset class type input
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
            ? `http://localhost:5000/editLanguageForSchool/school123/${editingLang.id}` 
            : 'http://localhost:5000/addLanguageForSchool';

        const payload = {
            id: 'school123',
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
                    placeholder="Add Level"
                    className="input-field"
                />
                <button type="button" onClick={addLevel} className="add-button">
                    Add Level
                </button>
            </div>
            <div className="levels-list">
                <h3>Added Levels:</h3>
                <ul>
                    {levels.map(lvl => (
                        <li key={lvl.id} className="level-item">
                            {lvl.levelName}
                            <ul>
                                {lvl.lessonTypes.map(ct => (
                                    <li key={ct.id}>
                                        {ct.typeName} 
                                        <button onClick={() => deleteClassType(lvl.id, ct.id)} className="delete-button">
                                            Delete Class Type
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="button"
                                onClick={() => setSelectedLevelId(lvl.id)}
                                className={`select-button ${selectedLevelId === lvl.id ? 'selected' : ''}`}>
                                {selectedLevelId === lvl.id ? 'Selected' : 'Select'} Level for Class Types
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
                    <button type="button" onClick={addClassType} className="add-button">
                        Add Class Type to Selected Level
                    </button>
                </div>
            )}
            <button type="submit" className="submit-button">
                {editingLang ? 'Update Language' : 'Add Language with Levels and Class Types'}
            </button>
            {editingLang && <button type="button" onClick={resetForm} className="cancel-button">Cancel Edit</button>}
        </form>
    );
};

export default AddLanguageForm;
