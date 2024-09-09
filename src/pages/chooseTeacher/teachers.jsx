import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import parseUkrainianDate from "../../common/utils/smallFn/convertDate";
import './teachers.css';

const Teachers = ({ schoolId }) => {
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allTeachers, setAllTeachers] = useState([]);
  const [lang, setLang] = useState();
  const [selectedSlots, setSelectedSlots] = useState([]);

  const location = useLocation();
  const { level } = location.state || {};
  const { language } = location.state || {};
  const { lang_from_general_cal } = location.state || {};

  const selectedTimes = localStorage.getItem('selectedDates');

  const HandleFinish = () => {
    if (language) {
      return '/date';
    } else {
      return '/final';
    }
  };

  const fetchSchoolData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/schools`);
      let teachers = response.data[0].ESL.teacher;

      if (level) {
        let parsedSelectedTimes = [];
        if (typeof selectedTimes === 'string') {
          try {
            parsedSelectedTimes = JSON.parse(selectedTimes);
          } catch (e) {
            console.error('Invalid JSON string for selectedTimes');
          }
        }

        teachers = teachers.filter(teacher =>
          teacher.data &&
          teacher.data.lang.some(langObj =>
            langObj.level &&
            langObj.level.some(l =>
              l.levelName === level &&
              (langObj.lang === language || langObj.lang === lang_from_general_cal) &&
              (parsedSelectedTimes.length === 0 ||
                parsedSelectedTimes.some(selectedDate =>
                  l.date.some(dateObj =>
                    dateObj.workTime.some(workTimeSlot =>
                      new Date(workTimeSlot.time).getTime() === new Date(parseUkrainianDate(selectedDate)).getTime()
                    )
                  )
                )
              )
            )
          )
        );
      }

      const languages = teachers.flatMap(teacher =>
        teacher.data.lang.flatMap(langObj =>
          langObj.lang
        )
      );

      const allTeacherDates = teachers.flatMap(teacher =>
        teacher.data.lang
          .filter(langObj => langObj.lang === language)
          .flatMap(langObj =>
            langObj.level
              .filter(lv => lv.levelName === level)
              .flatMap(lv => lv.date)
          )
      );

      if (language) {
        setLang(languages);
      } else if (lang_from_general_cal) {
        setLang(lang_from_general_cal);
      }

      setAllTeachers(allTeacherDates);
      setSchoolData(teachers);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTeacherAvailableTimes = (teacher) => {
    let parsedSelectedTimes = [];
    if (typeof selectedTimes === 'string') {
      try {
        parsedSelectedTimes = JSON.parse(selectedTimes);
      } catch (e) {
        console.error('Invalid JSON string for selectedTimes');
      }
    }

    const availableTimes = teacher.data.lang
      .filter(langObj => langObj.lang === lang_from_general_cal)
      .flatMap(langObj =>
        langObj.level
          .filter(lv => lv.levelName === level)
          .flatMap(lv => lv.date
            .flatMap(dateObj => dateObj.workTime
              .filter(workTimeSlot =>
                parsedSelectedTimes.some(selectedDate =>
                  new Date(workTimeSlot.time).getTime() === new Date(parseUkrainianDate(selectedDate)).getTime()
                )
              )
            )
          )
      );

    return availableTimes.map(timeSlot => timeSlot.time);
  };

  useEffect(() => {
    fetchSchoolData();
  }, [schoolId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="teachers-container">
      <h1 className="teachers-title">Оберіть мову</h1>
      {schoolData && (
        <div className="school-data">
          <div>
            <Link to={'/date'} state={{ allTeachers: allTeachers, level: level, lang: lang }} className="select-date-link">
              <button>Select Date</button>
            </Link>
          </div>
          {schoolData.map((teacher, index) => (
            <Link to={HandleFinish()} state={{ teacherDate: teacher.data.lang.filter(lang => lang.lang === language), level: level, lang_from_general_cal: lang, teacherId: teacher.data.teacherId }} className="teacher-link" key={index}>
              <div className="teacher-item">
                <p>{teacher.data.teacherName}</p>
                <div className="teacher-times">
                  {getTeacherAvailableTimes(teacher).length > 0 ? (

                    <ul>

                      {getTeacherAvailableTimes(teacher).map((time, idx) => (

                        <li key={idx}>{new Date(time).toLocaleDaString()}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No available times matching the selected dates</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teachers;
