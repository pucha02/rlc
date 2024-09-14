import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker, Page, setOptions, localeUa } from '@mobiscroll/react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { mergeWorkAndNonWorkTimes } from '../../common/utils/smallFn/calculateTimes';
import { parseUkrainianDate } from '../../common/utils/smallFn/convertDate';
import './date.css'

setOptions({
  locale: localeUa,
  theme: 'ios',
  themeVariant: 'light'
});

function Calendar2() {
  const [dates, setDates] = useState([]);
  const [multiple, setMultiple] = useState([]);
  const min = '2024-09-01T00:00';
  const max = '2024-09-20T00:00';
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

  const handlePageLoadingDatetime = useCallback(() => {
    const invalid = [];
    const labels = [];

    date.forEach(booking => {
      
      const d = new Date(booking.d);
      const localDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
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
    console.log(invalid)
    

    setDatetimeLabels(labels);
    setDatetimeInvalid(invalid);
  }, [date]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (teacherDate) {
          const teacherDates = teacherDate[0].level.filter(lv => lv.levelName === level)[0].lessonTypes.filter(ls => ls.typeName == lessonTypes);

          teacherDates[0].date.forEach((booking) => {
            booking.allSlots = booking.workTime.reduce((total, item) => total + item.slots, 0);
          });
          const workTimes = teacherDates[0].date.flatMap(time => time.workTime);
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
      setDates((prevDates) => [...prevDates, ...multiple.map(formatDateTime)]);
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
          stepMinute={10}
          width={null}
          labels={datetimeLabels}
          invalid={datetimeInvalid}
          onPageLoading={handlePageLoadingDatetime}
          cssClass="booking-datetime"
          onChange={handleChangeMultiple}
          multiple={true}
        />
        <button onClick={handleSaveDates}>Сохранить выбранные даты и время</button>
      </div>
      <div className="selected-dates">
        <h3>Selected Dates & Times:</h3>
        {Array.isArray(dates) && dates.length > 0 ? (
          <ul>
            {dates.map((date, index) => {
              // Найдем соответствующий объект workTime по времени
              const matchedItem = freeSlot.find(item => new Date(item.time).getTime() === new Date(parseUkrainianDate(date)).getTime());
              return (
                <li key={index}>
                  {date} {matchedItem && `(Вільних місць: ${matchedItem.slots})`}
                  <button onClick={() => handleRemoveDate(date)}>Удалить</button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No dates selected.</p>
        )}
      </div>
    </Page>

  );
}

export default Calendar2;
