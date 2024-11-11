import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker, Page, setOptions, localeUa } from '@mobiscroll/react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { mergeWorkAndNonWorkTimes } from '../../common/utils/smallFn/calculateTimes';
import { parseUkrainianDate } from '../../common/utils/smallFn/convertDate';
import LogoImg from '../../services/images/Group12.svg'

import { Link } from 'react-router-dom';
import './date.css'

setOptions({
  locale: localeUa,
  theme: 'ios',
  themeVariant: 'light'
});

function Calendar2({ HandleFinish, final, teacherId, teacherName, schoolId }) {
  const [dates, setDates] = useState([]);
  const [multiple, setMultiple] = useState([]);
  const min = '2024-11-01T00:00';
  const max = '2024-12-15T00:00';
  const [datetimeLabels, setDatetimeLabels] = useState([]);
  const [datetimeInvalid, setDatetimeInvalid] = useState([]);
  const [date, setDate] = useState([]);
  const [freeSlot, setFreeSlot] = useState([])

  const location = useLocation();
  const { teacherDate } = location.state || {};
  const { level } = location.state || {};
  const { allTeachers } = location.state || {};
  const { lessonTypes } = location.state || {};
  const { count } = location.state || {};
  const { price } = location.state || {};
  const { logo } = location.state || {};
  const { name } = location.state || {};


  console.log(count, lessonTypes, allTeachers, level, price)

  const handlePageLoadingDatetime = useCallback(() => {
    const invalid = [];
    const labels = [];

    // Создаем список всех возможных дат в диапазоне
    const allPossibleDates = [];
    const minDate = new Date(min);
    const maxDate = new Date(max);

    for (let d = minDate; d <= maxDate; d.setDate(d.getDate() + 1)) {
      allPossibleDates.push(new Date(d));
    }

    // Сохраняем все рабочие и нерабочие даты как доступные и недоступные
    date.forEach(booking => {
      const d = new Date(booking.d);

      const localDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
      console.log(localDate)
      if (booking.allSlots > 0) {
        labels.push({
          start: localDate,
          title: booking.allSlots + ' SPOTS',
          textColor: '#e1528f',
        });
        invalid.push(...booking.nonWorkTime);
      } else {
        invalid.push(localDate);
      }
    });
    console.log(date)
    // Добавляем недоступные даты, которых нет в date
    allPossibleDates.forEach(possibleDate => {
      const isDateAvailable = date.some(booking => {
        const bookingDate = new Date(booking.d);
        return bookingDate.toDateString() === possibleDate.toDateString();
      });

      if (!isDateAvailable) {
        invalid.push(possibleDate);
      }
    });

    setDatetimeLabels(labels);
    setDatetimeInvalid(invalid);
  }, [date]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (teacherDate) {
          const teacherDates = teacherDate[0].level.filter(lv => lv.levelName === level)[0].lessonTypes.filter(ls => ls.typeName === lessonTypes);

          teacherDates[0].date.forEach((booking) => {
            booking.allSlots = booking.workTime.reduce((total, item) => total + item.slots, 0);
          });
          const workTimes = teacherDates[0].date.flatMap(time => time.workTime);
          console.log(workTimes)
          setFreeSlot(workTimes)

          setDate(mergeWorkAndNonWorkTimes(teacherDates[0].date, count));


        } else if (allTeachers) {

          allTeachers.forEach((booking) => {
            booking.allSlots = booking.workTime.reduce((total, item) => total + item.slots, 0);
          });
          const workTimes = allTeachers.flatMap(time => time.workTime);
          const mergedTeachers = mergeWorkAndNonWorkTimes(allTeachers, count);
          setDate(mergedTeachers);
          setFreeSlot(workTimes)
          
        }

        const storedDates = localStorage.getItem('selectedDates');
        if (storedDates) {
          setMultiple(JSON.parse(storedDates));
        }
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    handlePageLoadingDatetime();
  }, [date, handlePageLoadingDatetime]); // Update datetime labels and invalid dates when date changes

  useEffect(() => {
    localStorage.setItem('selectedDates', JSON.stringify(dates));
  }, [dates]);

  const handleSaveDates = () => {
    if (Array.isArray(multiple)) {
      setDates((prevDates) => {
        const newDates = multiple.map(formatDateTime);
        const uniqueDates = [...new Set([...prevDates, ...newDates])]; // Убираем дубликаты
        return uniqueDates;
      });
    } else {
      console.error("Expected 'multiple' to be an array, but got:", typeof multiple);
    }
  };


  const handleChangeMultiple = useCallback((args) => {
    let newValue = args.value;

    if (newValue === null) {
      setMultiple([]);
    } else if (newValue instanceof Date) {
      setMultiple([newValue]);
    } else if (Array.isArray(newValue)) {
      setMultiple(newValue);
    } else {
      console.error("Unexpected type for 'args.value':", newValue);
      setMultiple([]);
    }
  }, []);

  const handleRemoveDate = (dateToRemove) => {
    setDates((prevDates) => prevDates.filter(date => date !== dateToRemove));
  };

  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('uk-UA', options);
  };

  return (
    <Page className="md-calendar-booking">

      <div className="mbsc-form-group">

        <div className="mbsc-form-group-title">Select date & time</div>
        <Datepicker
          display="inline"
          controls={['calendar', 'timegrid']}
          min={min}
          max={max}
          minTime="05:00"
          maxTime="23:59"
          stepMinute={5}
          width={null}
          labels={datetimeLabels}
          invalid={datetimeInvalid}
          onPageLoading={handlePageLoadingDatetime}
          cssClass="booking-datetime"
          onChange={handleChangeMultiple}
          multiple={true}
        />
        <button onClick={handleSaveDates}>Обрати</button>
      </div>
      <div className="selected-dates">
        <h3>Обрані записи:</h3>
        {Array.isArray(dates) && dates.length > 0 ? (
          <ul>
            {dates.map((date, index) => {

              const matchedItems = freeSlot.filter(item =>
                new Date(new Date(item.time).getTime() + new Date(item.time).getTimezoneOffset() * 60000).getTime() === new Date(new Date(parseUkrainianDate(date))).getTime() && item.slots > 0
              );

              const matchedItemsc = freeSlot.filter(item =>
                console.log(new Date(new Date(item.time).getTime() + new Date(item.time).getTimezoneOffset() * 60000), new Date(new Date(parseUkrainianDate(date)))),
                // console.log(),
                console.log(parseUkrainianDate(date))
              );

              console.log(matchedItemsc)

              const totalSlots = matchedItems.reduce((sum, item) => sum + item.slots, 0); return (
                <li key={index}>
                  {date} {totalSlots && `(Вільних місць: ${totalSlots})`}
                  {console.log(totalSlots)}
                  <button className='delete-btn' onClick={() => handleRemoveDate(date)}>
                    ✖
                  </button>
                </li>
              );
            })}

          </ul>
        ) : (
          <p>Немає обраних дат</p>
        )}
        <div className='next-btn'>
          <Link to={HandleFinish()} state={{
            lang_from_general_cal: final,
            level: level,
            teacherId: teacherId,
            teacherName: teacherName,
            lessonTypes: lessonTypes,
            schoolId: schoolId,
            count: count,
            price: price,
            logo: logo,
            name: name

          }}>
            <button disabled={dates.length === 0}>Далі</button>
          </Link>
        </div>

      </div>

    </Page>

  );
}

export default Calendar2;
