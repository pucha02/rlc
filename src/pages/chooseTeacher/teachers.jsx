<<<<<<< HEAD
const Teachers = () => {
    return (
        <div>
            <p>Teachers</p>

        </div>
    )
}

export default Teachers
=======
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LogoImg from '../../services/images/Group12.svg'
import { parseUkrainianDate, formatDateToUkrainian } from '../../common/utils/smallFn/convertDate'
import getTeacherAvailableTimes from "../../common/utils/smallFn/getTeacherAvaliableTimes";
import selectTeacherAndDates from "../../common/utils/smallFn/selectTeacherDataFromGeneralCalendar";

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
  const { price } = location.state || {};
  const { logo } = location.state || {};
  const { name } = location.state || {};

  console.log(price)
  console.log(lang_from_general_cal, level, lessonTypes, schoolId, count)

  const selectedTimes = localStorage.getItem('selectedDates');
  console.log(schoolId)
  const HandleFinish = () => {
    if (language) {
      return `/date`;
    } else {
      return `/final`;
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
            <Link to={`/${schoolId}`}><img src={logo} alt="Logo" /></Link>
          </div>
        </div>
        <div className="container-items-block teach">
          <h1 className="teacher-title">Оберіть вчителя</h1>
  
          {schoolData && (
            <>
              <div className="teachers-data">
                {schoolData.length > 0 ? (
                  schoolData.map((teacher, index) => (
                    <div className="teacher" key={index}>
                      <div className="teacherData">
                        <div className="teacherImg">
                          <img src={teacher.data.teacherImg} alt="" />
                        </div>
                        <div className="name-and-btn">
                          <div className="teacher-link">
                            <p>{teacher.data.teacherName}</p>
                          </div>
                          {getTeacherAvailableTimes(teacher, selectedTimes, lang_from_general_cal, level, parseUkrainianDate, lessonTypes).length <= 0 ? (
                            <Link to={HandleFinish()} state={{
                              teacherDate: teacher.data.lang.filter(lang => lang.lang === language),
                              level: level,
                              lang_from_general_cal: lang,
                              teacherId: teacher.data.teacherId,
                              teacherName: teacher.data.teacherName,
                              lessonTypes: lessonTypes,
                              schoolId: schoolId,
                              count: count ? count : counts,
                              price: price,
                              logo: logo,
                              name: name
                            }} className="select-btn">
                              <div>
                                <p>Обрати</p>
                              </div>
                            </Link>
                          ) : (
                            <div className="select-btn">
                              <div className="teacher-times">
                                {getTeacherAvailableTimes(teacher, selectedTimes, lang_from_general_cal, level, parseUkrainianDate).length > 0 ? (
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
                                          backgroundColor: selectTimes.includes(`${teacher.data.teacherName}, ${teacher.data.teacherId}, ${lang}, ${level}, ${lessonTypes}, ${time}`) ? '#4D7D6DB2' : '#D9D9D980',
                                          color: selectTimes.includes(`${teacher.data.teacherName}, ${teacher.data.teacherId}, ${lang}, ${level}, ${lessonTypes}, ${time}`) ? 'white' : '#205C48'
                                        }}
                                      >
                                        {formatDateToUkrainian(time)}
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))
                ) : (
                  <div>
                    <p>Немає доступних вчителів</p>
                  </div>
                )}
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
                  count: count ? count : counts,
                  price: price,
                  logo: logo,
                  name: name
                }} className="select-btn">
                  <button disabled={selectTimes.length === 0}>Далі</button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    <Footer />
  </>
  
  );
};

export default Teachers;
>>>>>>> feature/slon/update-calendar
