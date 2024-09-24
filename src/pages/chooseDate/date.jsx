import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Calendar2 from "./testCalendarWithDatePickerDefault";
import Footer from "../../common/components/Footer/Footer";

const Date = () => {

  const [final, setFinal] = useState(null)

  const location = useLocation();
  const { teacherDate } = location.state || {};
  const { level } = location.state || {};
  const { allTeachers } = location.state || {};
  const { lang } = location.state || {};
  const { teacherId } = location.state || {};
  const { teacherName } = location.state || {};
  const { lessonTypes } = location.state || {};
  const { schoolId } = location.state || {};
  const { count } = location.state || {};

  const HandleFinish = () => {
    if (allTeachers) {
      return `/teacher`;
    } else if (teacherDate) {
      return `/final`;
    }

  };
 

  useEffect(() => {
    const keys = Object.keys(localStorage);
    localStorage.setItem('OrderId', [])
    keys.forEach(key => {
      if (key.startsWith('availableTimes_')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.setItem('selectedSlots', [])
    if (teacherDate) {
      setFinal(teacherDate[0].lang)
    }
    else if (allTeachers) {
      localStorage.removeItem('selectedDates');
      setFinal(lang)
      console.log(lang)
    }

  }, [])
  return (
    <div className="calendar">
      <Calendar2 HandleFinish={HandleFinish} final={final} teacherId={teacherId} teacherName={teacherName} schoolId={schoolId} />
      <div className="calendar-footer">
        <Footer />
      </div>
    </div>
  );
};

export default Date;
