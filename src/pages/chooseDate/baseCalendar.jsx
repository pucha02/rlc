import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker, getJson, Page, setOptions, localeUa } from '@mobiscroll/react';
import { useCallback, useEffect, useState } from 'react';

setOptions({
  locale: localeUa,
  theme: 'ios',
  themeVariant: 'light'
});



function Calendar2() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [multiple, setMultiple] = useState([]);
  const min = '2024-08-29T00:00';
  const max = '2025-03-01T00:00';
  const [datetimeLabels, setDatetimeLabels] = useState([]);
  const [datetimeInvalid, setDatetimeInvalid] = useState([]);

  const handlePageLoadingDatetime = useCallback((args) => {
    const d = args.firstDay;
    const invalid = [];
    const labels = [];

    getJson(
      'https://trial.mobiscroll.com/getbookingtime/?year=' + d.getFullYear() + '&month=' + d.getMonth(),
      (bookings) => {
        for (let i = 0; i < bookings.length; ++i) {
          console.log(bookings)
          const booking = bookings[i];
          const d = new Date(booking.d);

          if (booking.nr > 0) {
            labels.push({
              start: d,
              title: booking.nr + ' SPOTS',
              textColor: '#e1528f',
            });
            invalid.push(...booking.invalid);
          } else {
            invalid.push(d);
          }
        }
        setDatetimeLabels(labels);
        setDatetimeInvalid(invalid);
      },
      'jsonp',
    );
  }, []);

  const handleChangeMultiple = useCallback((args) => {
    setMultiple(args.value);
    // Update localStorage
    localStorage.setItem('selectedDates', JSON.stringify(args.value));
  }, []);

  useEffect(() => {
    // Retrieve initial dates from localStorage if available
    const storedDates = localStorage.getItem('selectedDates');
    if (storedDates) {
      setMultiple(JSON.parse(storedDates));
    }
  }, []);

  return (
    <Page className="md-calendar-booking">
      <div className="mbsc-form-group">
        <div className="mbsc-form-group-title">Select date & time</div>
        <Datepicker
          display="inline"
          controls={['calendar', 'timegrid']}
          min={min}
          max={max}
          minTime="08:00"
          maxTime="19:59"
          stepMinute={60}
          width={null}
          labels={datetimeLabels}
          invalid={datetimeInvalid}
          onPageLoading={handlePageLoadingDatetime}
          cssClass="booking-datetime"
          onChange={handleChangeMultiple}
          multiple={true}
        />
      </div>
    </Page>
  );
}

export default Calendar2;
