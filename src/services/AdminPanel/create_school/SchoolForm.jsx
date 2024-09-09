import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';  // Import uuid

const SchoolForm = ({ school, fetchSchools }) => {
    const [formData, setFormData] = useState(school || { ESL: { schoolName: '', language: [], teacher: [], id: uuidv4() } });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, ESL: { ...formData.ESL, [name]: value } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (school) {
                await axios.put(`http://localhost:5000/schools/${school._id}`, formData);
            } else {
                // Generate an ID before creating a new school
                formData.ESL.id = uuidv4();
                await axios.post('http://localhost:5000/schools', formData);
            }
            fetchSchools();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="schoolName"
                value={formData.ESL.schoolName}
                onChange={handleChange}
                placeholder="School Name"
            />
            <button type="submit">{school ? 'Update School' : 'Create School'}</button>
        </form>
    );
};

export default SchoolForm;