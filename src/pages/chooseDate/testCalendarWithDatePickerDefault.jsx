import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker, Page, setOptions, localeUa } from '@mobiscroll/react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
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
  const max = '2024-09-11T00:00';
  const [datetimeLabels, setDatetimeLabels] = useState([]);
  const [datetimeInvalid, setDatetimeInvalid] = useState([]);
  const [date, setDate] = useState([]);

  const location = useLocation();
  const { teacherDate } = location.state || {};
  const { level } = location.state || {};
  const { allTeachers } = location.state || {};

  const mergeWorkAndNonWorkTimes = (data) => {

    const grouped = data.reduce((acc, booking) => {
      const dateKey = booking.d;

      if (!acc[dateKey]) {
        acc[dateKey] = {
          ...booking,
          workTime: [...booking.workTime],
          nonWorkTime: [...booking.nonWorkTime],
          allSlots: booking.allSlots || 0,
        };
      } else {

        acc[dateKey].workTime = [...acc[dateKey].workTime, ...booking.workTime];
        acc[dateKey].nonWorkTime = [...new Set([...acc[dateKey].nonWorkTime, ...booking.nonWorkTime])]; // Unique nonWorkTime
        acc[dateKey].allSlots += booking.allSlots || 0;
      }
      return acc;
    }, {});
    // Recalculate non-working intervals
    return Object.values(grouped).map((booking) => {
      const allWorkTimes = []
      booking.workTime.forEach((wt) => {
        console.log('workTime:', booking);

        if (wt.slots > 0) { // Проверка наличия wt.time
          allWorkTimes.push(wt.time);
        } else if (booking.allSlots <= 0) {
          const currentDate = wt.time.split('T')[0] + 'T00:00:00.000Z'; // Текущая дата с временем 00:00:00
          allWorkTimes.push(currentDate);
          console.log(currentDate)
        }
      });

      const combinedWorkTime = calculateCombinedWorkTime(allWorkTimes); // Custom function to combine overlapping times
      const nonWorkTime = calculateNonWorkTime(booking.nonWorkTime, combinedWorkTime);
      return {
        ...booking,
        workTime: combinedWorkTime,
        nonWorkTime,
        allSlots: booking.allSlots,
      };
    });
  };

  const calculateCombinedWorkTime = (workTimes) => {

    const sortedTimes = workTimes.map(time => new Date(time)).sort((a, b) => a - b);

    const combined = [];
    let currentInterval = null;

    sortedTimes.forEach(time => {
      if (!currentInterval) {
        currentInterval = [time, time]; // Start a new interval
      } else {
        // If the current time is within or adjacent to the current interval, extend it
        if (time <= currentInterval[1]) {
          currentInterval[1] = new Date(Math.max(currentInterval[1], time)); // Extend the end time
        } else {
          // Otherwise, push the current interval to the combined list and start a new interval
          combined.push(currentInterval);
          currentInterval = [time, time];
        }
      }
    });


    if (currentInterval) {
      combined.push(currentInterval);

    }

    return combined.map(([start]) => ({ start }));
  };

  const calculateNonWorkTime = (nonWorkTime, workTimes) => {

    workTimes = workTimes.map(wt => {
      const adjustedTime = new Date(wt.start.getTime() - 3 * 60 * 60 * 1000);
      return { ...wt, time: adjustedTime };
    }).sort((a, b) => new Date(a.time) - new Date(b.time));

    const nonWorkTimes = [];

    // Non-working time from the start of the day to the first work time
    const startOfDay = new Date(new Date(workTimes[0].time).setUTCHours(0, 0, 0, 0));
    const firstWorkTime = new Date(workTimes[0].time);



    if (startOfDay < firstWorkTime) {
      nonWorkTimes.push({
        start: startOfDay,
        end: new Date(firstWorkTime.getTime() - 60 * 1000) // 1 minute before work starts
      });
    }

    // Process work times and add non-working intervals where nr = 0
    for (let i = 0; i < workTimes.length; i++) {
      const currentStart = new Date(workTimes[i].time);

      if (workTimes[i].slots === 0) {
        const nextStart = (i < workTimes.length - 1) ? new Date(workTimes[i + 1].time) : new Date(currentStart.setUTCHours(23, 59, 0, 0));
        nonWorkTimes.push({
          start: currentStart,
          end: new Date(nextStart.getTime() - 60 * 1000)
        });
      } else {
        if (i > 0 && workTimes[i - 1].slots !== 0) {
          const previousEnd = new Date(workTimes[i - 1].time);
          if (previousEnd < currentStart) {
            nonWorkTimes.push({
              start: new Date(previousEnd.getTime() + 60 * 60 * 1000 - 60 * 1000 * 31),  // 1 minute after 1 hour
              end: new Date(currentStart.getTime() - 60 * 1000)  // 1 minute before the current work interval
            });
          }
        }
      }
    }

    // Non-working time from the end of the last work time to the end of the day
    const lastWorkTime = new Date(workTimes[workTimes.length - 1].time);
    const endOfDay = new Date(lastWorkTime);
    endOfDay.setUTCHours(23, 59, 0, 0);

    if (lastWorkTime < endOfDay) {
      nonWorkTimes.push({
        start: new Date(lastWorkTime.getTime() + 60 * 60 * 1000 - 60 * 1000 * 31),
        end: endOfDay
      });
    }

    const mergedNonWorkTime = [...nonWorkTimes];
    const uniqueNonWorkTime = Array.from(
      new Set(mergedNonWorkTime.map(nwt => `${nwt.start}-${nwt.end}`))
    ).map(str => {
      const [start, end] = str.split('-');
      return { start: new Date(start), end: new Date(end) };
    });

    return uniqueNonWorkTime;
  };

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

    setDatetimeLabels(labels);
    setDatetimeInvalid(invalid);
  }, [date]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (teacherDate) {
          const teacherDates = teacherDate[0].level.filter(lv => lv.levelName === level);
          teacherDates[0].date.forEach((booking) => {
            booking.allSlots = booking.workTime.reduce((total, item) => total + item.slots, 0);
          });

          setDate(teacherDates[0].date);
        } else if (allTeachers) {
          allTeachers.forEach((booking) => {
            booking.allSlots = booking.workTime.reduce((total, item) => total + item.slots, 0);
          });
          console.log(allTeachers)
          const mergedTeachers = mergeWorkAndNonWorkTimes(allTeachers);
          console.log(mergedTeachers)
          setDate(mergedTeachers);
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
          stepMinute={30}
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
            {dates.map((date, index) => (
              <li key={index}>
                {date}
                <button onClick={() => handleRemoveDate(date)}>Удалить</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No dates selected.</p>
        )}
      </div>
    </Page>

  );
}

export default Calendar2;
