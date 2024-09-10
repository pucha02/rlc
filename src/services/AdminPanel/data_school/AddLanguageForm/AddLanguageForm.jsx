import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddLanguageForm.css';

const AddLanguageForm = ({ schoolId, fetchSchool, editingLang, setEditingLang }) => {
    const [lang, setLang] = useState('');
    const [level, setLevel] = useState('');
    const [levels, setLevels] = useState([]);

    useEffect(() => {
        if (editingLang) {
            setLang(editingLang.lang);
            setLevels(editingLang.level);
        }
    }, [editingLang]);

    const addLevel = () => {
        const newLevel = {
            id: Date.now(),
            levelName: level
        };
        setLevels([...levels, newLevel]);
        setLevel('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = editingLang 
            ? `http://localhost:5000/editLanguageForSchool/bbd935fb-a9bd-4412-810f-8ecd7189d5e7/${editingLang.id}` 
            : 'http://localhost:5000/addLanguageForSchool';

        const payload = {
            id: 'bbd935fb-a9bd-4412-810f-8ecd7189d5e7',
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
            if (error.response) {
                console.log('Response data:', error.response.data);
            } else if (error.request) {
                console.log('Request error:', error.request);
            } else {
                console.log('Error:', error.message);
            }
        }
    };

    const resetForm = () => {
        setLang('');
        setLevels([]);
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
                    {levels.map((lvl) => (
                        <li key={lvl.id} className="level-item">
                            {lvl.levelName} (id: {lvl.id})
                        </li>
                    ))}
                </ul>
            </div>
            <button type="submit" className="submit-button">
                {editingLang ? 'Update Language' : 'Add Language with Levels'}
            </button>
            {editingLang && <button type="button" onClick={resetForm} className="cancel-button">Cancel Edit</button>}
        </form>
    );
};

export default AddLanguageForm;
