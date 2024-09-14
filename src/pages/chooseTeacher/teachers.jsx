import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { parseUkrainianDate, formatDateToUkrainian } from '../../common/utils/smallFn/convertDate'
import getTeacherAvailableTimes from "../../common/utils/smallFn/getTeacherAvaliableTimes";
import selectTeacherAndDates from "../../common/utils/smallFn/selectTeacherDataFromGeneralCalendar";
import '../chooseLanguage/language.css';

const Teachers = () => {
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allTeachers, setAllTeachers] = useState([]);
  const [lang, setLang] = useState();
  const [selectTimes, setSelectTimes] = useState([])
  const [counts, setCount] = useState(1)

  const location = useLocation();
  const { level } = location.state || {};
  const { language } = location.state || {};
  const { lessonTypes } = location.state || {};
  const { lang_from_general_cal } = location.state || {};
  const { schoolId } = location.state || {};
  const { count } = location.state || {};

  const selectedTimes = localStorage.getItem('selectedDates');
  console.log(schoolId)
  const HandleFinish = () => {
    if (language) {
      return '/date';
    } else {
      return '/final';
    }
  };

  const fetchSchoolData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/schools/${schoolId}`);
      let teachers = response.data[0].ESL.teacher;
      console.log(teachers)
      if (level) {
        let parsedSelectedTimes = [];
        if (typeof selectedTimes === 'string' && selectedTimes.length > 0) {
          try {
            // Parse selectedTimes from localStorage
            parsedSelectedTimes = JSON.parse(selectedTimes);
          } catch (e) {
            console.error('Invalid JSON string for selectedTimes:', e);
          }
        }
        // Ensure parsedSelectedTimes is always an array
        if (!Array.isArray(parsedSelectedTimes)) {
          parsedSelectedTimes = [];
        }
        teachers = teachers.filter(teacher =>
          teacher.data &&
          teacher.data.lang.some(langObj =>
            langObj.level &&
            langObj.level.some(l =>
              l.levelName === level &&
              (langObj.lang === language || langObj.lang === lang_from_general_cal) &&
              l.lessonTypes.some(lessonTypeObj =>
                lessonTypeObj.typeName === lessonTypes &&
                (parsedSelectedTimes.length === 0 ||
                  parsedSelectedTimes.some(selectedDate =>
                    lessonTypeObj.date.some(dateObj =>
                      dateObj.workTime.some(workTimeSlot =>
                        new Date(workTimeSlot.time).getTime() === new Date(parseUkrainianDate(selectedDate)).getTime() && workTimeSlot.slots > 0
                      )
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
              .flatMap(lv => lv.lessonTypes.filter(lv => lv.typeName == lessonTypes)
                .flatMap(lv => lv.date)
              )

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


  useEffect(() => {
    const keys = Object.keys(localStorage);

    keys.forEach(key => {
      if (key.startsWith('availableTimes_')) {
        localStorage.removeItem(key);
      }
    });
    fetchSchoolData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="main">
      <div className="container">
        <div className="container-items-block">
          <h1 className="languages-title">Оберіть вчителя</h1>
          {schoolData && (
            <div className="school-data">
              {language && <div>
                <Link to={'/date'} state={{ allTeachers: allTeachers, level: level, lang: lang, lessonTypes: lessonTypes, schoolId: schoolId, count: count ? count : counts }} className="select-date-link">
                  <button>Select Date</button>
                </Link>
                {lessonTypes != 'Індивідуальні' && <input
                  type="number"
                  placeholder="Кількість учнів для бронювання"
                  value={counts}
                  min={1}
                  max={lessonTypes == 'Парні' ? 2 : ''}
                  onChange={(e) => setCount(e.target.value)}
                />}

              </div>}

              {schoolData.map((teacher, index) => (
                <div className="language-item" key={index}>
                  <Link to={HandleFinish()} state={{
                    teacherDate: teacher.data.lang.filter(lang => lang.lang === language),
                    level: level,
                    lang_from_general_cal: lang,
                    teacherId: teacher.data.teacherId,
                    teacherName: teacher.data.teacherName,
                    lessonTypes: lessonTypes,
                    schoolId: schoolId,
                    count: count ? count : counts
                  }} className="teacher-link">
                    <p>{teacher.data.teacherName}</p>
                  </Link>

                  <div className="teacher-times">
                    {getTeacherAvailableTimes(teacher, selectedTimes, lang_from_general_cal, level, parseUkrainianDate).length > 0 ? (
                      <>
                        <ul>
                          {getTeacherAvailableTimes(teacher, selectedTimes, lang_from_general_cal, level, parseUkrainianDate).map((time, idx) => (
                            <li
                              key={idx}
                              onClick={() => selectTeacherAndDates(
                                teacher,
                                lang,
                                level,
                                lessonTypes,
                                time,
                                setSelectTimes,
                                selectTimes
                              )}
                              style={{
                                cursor: 'pointer',
                                backgroundColor: selectTimes.includes(`${teacher.data.teacherName}, ${teacher.data.teacherId}, ${lang}, ${level}, ${lessonTypes}, ${time}`) ? 'lightgreen' : 'black'
                              }}
                            >
                              {formatDateToUkrainian(time)}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}

              {/* Отображаем кнопку "Далі" один раз, после всех учителей */}
              {schoolData.some(teacher =>
                getTeacherAvailableTimes(teacher, selectedTimes, lang_from_general_cal, level, parseUkrainianDate).length > 0
              ) && (
                  <Link to={HandleFinish()} state={{
                    teacherDate: schoolData[0].data.lang.filter(lang => lang.lang === language),
                    level: level,
                    lang_from_general_cal: lang,
                    teacherId: schoolData[0].data.teacherId,
                    lessonTypes: lessonTypes,
                    schoolId: schoolId,
                    count: count ? count : counts
                  }} className="teacher-link">
                    <p>Далі</p>
                  </Link>
                )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teachers;
