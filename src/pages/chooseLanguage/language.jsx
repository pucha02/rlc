import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './language.css'

const Languages = ({ schoolId }) => {
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchoolData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/schools`);
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
    <div className="languages-container">
      <h1 className="languages-title">Оберіть мову</h1>
      {schoolData && (
        <div className="school-data">

          {schoolData[0].ESL.language.map((lang, index) => (
            <Link
              className="language-link"
              to={'/course'}
              state={{ level: lang.level, language: lang.lang }}
            >
              <div className="language-item" key={index}>
                <p>
                  {lang.lang}
                  {console.log(schoolData)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Languages;
