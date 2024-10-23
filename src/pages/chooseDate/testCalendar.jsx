import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Draggable, Dropcontainer, Eventcalendar, setOptions, Toast, localeUa } from '@mobiscroll/react';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

setOptions({
  locale: localeUa,
  theme: 'ios',
  themeVariant: 'light'
});

const now = new Date();
const today = new Date(now.setMinutes(59));
const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

const Appointment = (props) => {
  const [draggable, setDraggable] = useState();

  const setDragElm = useCallback((elm) => {
    setDraggable(elm);
  }, []);

  const event = props.data;
  const eventLength = Math.abs(new Date(event.end).getTime() - new Date(event.start).getTime()) / (60 * 60 * 1000);

  return (
    <div>
      {!event.hide && (
        <div ref={setDragElm} className="docs-appointment-task" style={{ background: event.color }}>
          <div>{event.title}</div>
          <div>{eventLength + ' hour' + (eventLength > 1 ? 's' : '')}</div>
          <Draggable dragData={event} element={draggable} />
        </div>
      )}
    </div>
  );
};

Appointment.propTypes = {
  data: PropTypes.object.isRequired,
};

const App = () => {
  const [myEvents, setEvents] = useState([
    {
      id: 'job1',
      start: '2024-08-29T14:00',
      end: '2024-08-29T16:00',
      resource: 1,
      title: 'Myla Bennett',
      job: 'Wisdom tooth removal',
      color: '#334ab9',
    },
    {
      id: 'job2',
      start: '2024-08-29T17:00',
      end: '2024-08-29T18:30',
      resource: 1,
      title: 'Beatrix Foley',
      job: 'Braces',
      color: '#177e70',
    },
    {
      id: 'job3',
      start: '2024-08-29T08:00',
      end: '2024-08-29T09:30',
      resource: 3,
      title: 'Frank Watson',
      job: 'Teeth whitening',
      color: '#d1891f',
    },
    {
      id: 'job4',
      start: '2024-08-29T10:00',
      end: '2024-08-29T12:30',
      resource: 3,
      title: 'Jaime Joyce',
      job: 'Root canal treatment',
      color: '#cb3939',
    },
    {
      id: 'job5',
      start: '2024-08-29T13:00',
      end: '2024-08-29T14:00',
      resource: 3,
      title: 'Corey Shepard',
      job: 'Tooth extraction',
      color: '#aba343',
    },
    {
      id: 'job6',
      start: '2024-08-29T14:00',
      end: '2024-08-29T16:00',
      resource: 4,
      title: 'Callie Leonard',
      job: 'Crown and bridge',
      color: '#1ca11a',
    },
    {
      id: 'job7',
      start: '2024-08-29T17:00',
      end: '2024-08-29T18:00',
      resource: 4,
      title: 'Harley Thomson',
      job: 'Tartar removal',
      color: '#a446b5',
    },
    {
      id: 'job8',
      start: '2024-08-29T09:00',
      end: '2024-08-29T11:00',
      resource: 6,
      title: 'Ricky Welch',
      job: 'Wisdom tooth removal',
      color: '#334ab9',
    },
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: 'd1',
      title: 'Winfred Lesley',
      job: 'Teeth whitening',
      color: '#d1891f',
      start: '2024-08-29T08:00',
      end: '2024-08-29T09:30',
      unscheduled: true,
    },
    {
      id: 'd2',
      title: 'Rosalin Delice',
      job: 'Crown and bridge',
      color: '#1ca11a',
      start: '2024-08-29T08:00',
      end: '2024-08-29T10:00',
      unscheduled: true,
    },
    {
      id: 'd3',
      title: 'Macy Steven',
      job: 'Root canal treatment',
      color: '#cb3939',
      start: '2024-08-29T10:00',
      end: '2024-08-29T12:30',
      unscheduled: true,
    },
    {
      id: 'd4',
      title: 'Lavern Cameron',
      job: 'Tartar removal',
      color: '#a446b5',
      start: '2024-08-29T12:00',
      end: '2024-08-29T13:00',
      unscheduled: true,
    },
  ]);

  const [contBg, setContBg] = useState('');
  const [myColors, setColors] = useState([]);
  const [dropCont, setDropCont] = useState();
  const [toastMessage, setToastMessage] = useState('');
  const [isToastOpen, setToastOpen] = useState(false);

  const doctors = useMemo(
    () => [
      {
        id: 1,
        name: 'Dr. Keila Delores',
      },
      {
        id: 2,
        name: 'Dr. Gene Cortez',
      },
      {
        id: 3,
        name: 'Dr. Paula Bush',
      },
      {
        id: 4,
        name: 'Dr. Pete Nichols',
      },
      {
        id: 5,
        name: 'Dr. Jean Pearson',
      },
      {
        id: 6,
        name: 'Dr. Thelma Cain',
      },
    ],
    [],
  );

  const myView = useMemo(
    () => ({
      schedule: {
        type: 'day',
        startTime: '08:00',
        endTime: '20:00',
        allDay: false,
      },
    }),
    [],
  );

  const myInvalid = useMemo(
    () => [
      {
        recurring: {
          repeat: 'daily',
          until: yesterday,
        },
      },
      {
        start: yesterday,
        end: today,
      },
    ],
    [],
  );

  const setDropElm = useCallback((elm) => {
    setDropCont(elm);
  }, []);

  const handleEventCreate = useCallback((args) => {
    const event = args.event;
    event.unscheduled = false;
    setColors([]);
  }, []);

  const handleEventCreated = useCallback((args) => {
    setToastMessage(args.event.title + ' added');
    setToastOpen(true);
    setEvents((prevEvents) => [...prevEvents, args.event]);
    setAppointments((prevAppointments) => prevAppointments.filter((item) => item.id !== args.event.id));
  }, []);

  const handleFailed = useCallback((event) => {
    if (event.start <= today) {
      setToastMessage("Can't add event in the past");
    } else {
      setToastMessage('Make sure not to double book');
    }
    setToastOpen(true);
  }, []);

  const handleEventCreateFailed = useCallback(
    (args) => {
      handleFailed(args.event);
    },
    [handleFailed],
  );

  const handleEventUpdateFailed = useCallback(
    (args) => {
      handleFailed(args.event);
    },
    [handleFailed],
  );

  const handleEventDelete = useCallback((args) => {
    setToastMessage(args.event.title + ' unscheduled');
    setToastOpen(true);
    setEvents((prevEvents) => prevEvents.filter((item) => item.id !== args.event.id));
  }, []);

  const handleEventDragEnter = useCallback(() => {
    setColors([
      {
        background: '#f1fff24d',
        start: '08:00',
        end: '20:00',
        recurring: {
          repeat: 'daily',
        },
      },
    ]);
  }, []);

  const handleEventDragLeave = useCallback(() => {
    setColors([]);
  }, []);

  const handleItemDrop = useCallback((args) => {
    if (args.data) {
      args.data.unscheduled = true;
      setAppointments((prevAppointments) => [...prevAppointments, args.data]);
    }
    setContBg('');
  }, []);

  const handleItemDragEnter = useCallback((args) => {
    if (!(args.data && args.data.unscheduled)) {
      setContBg('#d0e7d2cc');
    }
  }, []);

  const handleItemDragLeave = useCallback(() => {
    setContBg('');
  }, []);

  const handleCloseToast = useCallback(() => {
    setToastOpen(false);
  }, []);

  useEffect(() => {
    for (const event of myEvents) {
      // convert dates to date objects
      event.start = event.start ? new Date(event.start) : event.start;
      event.end = event.end ? new Date(event.end) : event.end;
      // mark past events as fixed by setting the event.editable property to false
      event.editable = !!(event.start && today < event.start);
    }
  }, [myEvents]);

  return (
    <div className="mbsc-grid mbsc-no-padding">
      <div className="mbsc-row">
        <div className="mbsc-col-sm-9 docs-appointment-calendar">
          <Eventcalendar
            data={myEvents}
            view={myView}
            resources={doctors}
            invalid={myInvalid}
            dragToMove={true}
            dragToCreate={true}
            eventOverlap={false}
            externalDrop={true}
            externalDrag={true}
            colors={myColors}
            onEventCreate={handleEventCreate}
            onEventCreated={handleEventCreated}
            onEventCreateFailed={handleEventCreateFailed}
            onEventUpdateFailed={handleEventUpdateFailed}
            onEventDelete={handleEventDelete}
            onEventDragEnter={handleEventDragEnter}
            onEventDragLeave={handleEventDragLeave}
          />
          <Toast isOpen={isToastOpen} message={toastMessage} onClose={handleCloseToast} />
        </div>
        <div className="mbsc-col-sm-3 docs-appointment-cont" ref={setDropElm} style={{ backgroundColor: contBg }}>
          <Dropcontainer
            onItemDrop={handleItemDrop}
            onItemDragEnter={handleItemDragEnter}
            onItemDragLeave={handleItemDragLeave}
            element={dropCont}
          >
            <div className="mbsc-form-group-title">Unscheduled appointments</div>
            {appointments.map((app) => (
              <Appointment key={app.id} data={app} />
            ))}
          </Dropcontainer>
        </div>
      </div>
    </div>
  );
};

export default App;