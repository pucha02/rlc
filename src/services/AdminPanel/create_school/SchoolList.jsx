import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import SchoolForm from './SchoolForm';

const SchoolList = () => {
    const [schools, setSchools] = useState([]);
    const [editingSchool, setEditingSchool] = useState(null);

    const location = useLocation()
    const { schoolId } = location.state || {};


    const fetchSchools = async () => {
        const res = await axios.get(`http://13.60.221.226/api/schools/${schoolId}`);
        setSchools(res.data);
    };

    const handleEdit = (school) => {
        setEditingSchool(school);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://13.60.221.226/api/schools/${id}`);
        fetchSchools();
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    return (
        <div>
            <h2>Schools List</h2>
            <SchoolForm school={editingSchool} fetchSchools={fetchSchools} />
            <ul>
                {schools.map((school) => (
                    <li key={school._id}>
                        {school.ESL.schoolName}
                        <button onClick={() => handleEdit(school)}>Edit</button>
                        <button onClick={() => handleDelete(school._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SchoolList;
