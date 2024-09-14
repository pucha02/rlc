import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LanguageSelection from '../../common/components/LanguageSelection/LanguageSelection';
import './language.css'

const Languages = ({ schoolId }) => {
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(schoolId)
  const fetchSchoolData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/schools/${schoolId}`);
      setSchoolData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const keys = Object.keys(localStorage);

    keys.forEach(key => {
      if (key.startsWith('availableTimes_')) {
        localStorage.removeItem(key);
      }
    });
    fetchSchoolData();
  }, [schoolId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <LanguageSelection
      title="Оберіть мову"
      data={schoolData[0].ESL.language}
      type="language"
      schoolId={schoolId}
    />
  );
};

export default Languages;
