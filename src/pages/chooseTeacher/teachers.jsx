import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LogoImg from '../../services/images/Group12.svg'
import { parseUkrainianDate, formatDateToUkrainian } from '../../common/utils/smallFn/convertDate'
import getTeacherAvailableTimes from "../../common/utils/smallFn/getTeacherAvaliableTimes";
import selectTeacherAndDates from "../../common/utils/smallFn/selectTeacherDataFromGeneralCalendar";
import Teacher1Img from '../../services/images/teach1.jpg'
import Teacher2Img from '../../services/images/teach2.jpg'
import Footer from "../../common/components/Footer/Footer";
import fetchSchoolData from "../../common/utils/smallFn/fetchSchoolData";

import '../chooseLanguage/language.css';
import './teachers.css'

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

  console.log(lang_from_general_cal, level, lessonTypes, schoolId, count)

  const selectedTimes = localStorage.getItem('selectedDates');
  console.log(schoolId)
  const HandleFinish = () => {
    if (language) {
      return '/date';
    } else {
      return '/final';
    }
  };

  useEffect(() => {
    const keys = Object.keys(localStorage);
    localStorage.setItem('OrderId', [])
    // keys.forEach(key => {
    //   if (key.startsWith('availableTimes_')) {
    //     localStorage.removeItem(key);
    //   }
    // });
    fetchSchoolData(schoolId, level, selectedTimes, language, lang_from_general_cal, lessonTypes, setLang, setAllTeachers, setSchoolData, setError, setLoading);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      <div className="main">
        <div className="container">
          <div className='logo'>
            <div className='logo-items'>
              <Link to={`/${schoolId}`}><img src={LogoImg} alt="Logo" /></Link>
            </div>
          </div>
          <div className="container-items-block">
            <h1 className="teacher-title">Оберіть вчителя</h1>

            {schoolData && (
              <>
                {/* {language &&
                  <div className="selectDateAndCount">
                    <Link to={'/date'} state={{ allTeachers: allTeachers, level: level, lang: lang, lessonTypes: lessonTypes, schoolId: schoolId, count: count ? count : counts }} className="select-date-link">
                      <button>Обрати час</button>
                    </Link>


                  </div>
                } */}
                <div className="teachers-data">
                  {schoolData.map((teacher, index) => (
                    <div className="teacher" key={index}>
                      <div className="teacherData">
                        <div className="teacherImg">
                          <img src={Teacher1Img} alt="" />
                        </div>
                        <div className="name-and-btn">
                          <div className="teacher-link">
                            <Link to={'/teacherPage'} state={{ teacher }}><p>{teacher.data.teacherName}</p></Link>
                          </div>
                          {getTeacherAvailableTimes(teacher, selectedTimes, lang_from_general_cal, level, parseUkrainianDate, lessonTypes).length <= 0 ?
                            <Link to={HandleFinish()} state={{
                              teacherDate: teacher.data.lang.filter(lang => lang.lang === language),
                              level: level,
                              lang_from_general_cal: lang,
                              teacherId: teacher.data.teacherId,
                              teacherName: teacher.data.teacherName,
                              lessonTypes: lessonTypes,
                              schoolId: schoolId,
                              count: count ? count : counts
                            }} className="select-btn">
                              <div><p>Обрати</p></div>
                            </Link> : <div className="select-btn">
                              <div className="teacher-times">
                                {getTeacherAvailableTimes(teacher, selectedTimes, lang_from_general_cal, level, parseUkrainianDate).length > 0 ? (
                                  <>
                                    <ul className="teachers-times">
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
                                            backgroundColor: selectTimes.includes(`${teacher.data.teacherName}, ${teacher.data.teacherId}, ${lang}, ${level}, ${lessonTypes}, ${time}`) ? '#205C48' : '#D9D9D9',
                                            color: selectTimes.includes(`${teacher.data.teacherName}, ${teacher.data.teacherId}, ${lang}, ${level}, ${lessonTypes}, ${time}`) ? 'white' : '#205C48'
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
                          }

                        </div>
                      </div>
                      <hr />

                    </div>
                  ))}

                </div>
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
                    }} className="select-btn">
                      <p>Далі</p>
                    </Link>
                  )}
              </>)}

          </div>

        </div>

      </div >
      <Footer />
    </>
  );
};

export default Teachers;
