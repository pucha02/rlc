import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { formatDateToUkrainian } from "../../common/utils/smallFn/convertDate";
import Modal from "../../common/components/modal/modal";
import Login from "../regPages/Login";
import Registration from "../regPages/Registration";
import axios from "axios";
import fetchUserData from "../../common/utils/smallFn/getUserData";

const FinalPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lang, setLang] = useState('');
  const [user, setUser] = useState(null);
  const [levelName, setLevelName] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [order, setOrder] = useState(null);
  const [time, setTime] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState(null);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');



  const location = useLocation();
  const { language, level, lang_from_general_cal, teacherId, teacherName, lessonTypes, count } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData(setUser, axios, setUsername, setEmail, setPhone);

      const existingData = localStorage.getItem('data');
      const selectedTimes = localStorage.getItem('selectedDates');
      const selectedSlots = localStorage.getItem('selectedSlots');

      setOrder(existingData);
      setTime(selectedTimes);
      setSelectedSlots(selectedSlots);

      if (language) {
        setLang(language);
      } else if (lang_from_general_cal) {
        setLang(lang_from_general_cal);
      }
      setLevelName(level);

      // Initialize student fields based on the count
      if (count) {
        const initialStudents = Array.from({ length: count }, () => ({ name: '', email: '', phone: '' }));
        setStudents(initialStudents);
      }
    };

    fetchData();
  }, [count]);

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const handleFillMe = () => {
    const updatedStudents = [...students];
    updatedStudents[0] = { name: username, email, phone };
    setStudents(updatedStudents);
  };

  const toggleModal = (open = !isModalOpen) => {
    setIsModalOpen(open);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/registerorder`,
          { username, email, phone, order, time, lang, levelName, teacherId, teacherName, lessonTypes, selectedSlots, count, students }
        );

        if (response.status === 201) {
          const bookedTimes = response.data.unBookedSlots.map(slot => formatDateToUkrainian(slot));
          setMessage(`Час забронирован: ${bookedTimes.join(', ')}`);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const bookedTimes = error.response.data.bookedSlots.map(slot => formatDateToUkrainian(slot));
          const unBookedTimes = error.response.data.unBookedSlots.map(slot => formatDateToUkrainian(slot));

          let errorMessage = `Ви вже маєте запис на час: ${bookedTimes.join(', ')}`;

          if (unBookedTimes.length > 0) {
            errorMessage += `\nУспешно забронированы: ${unBookedTimes.join(', ')}`;
          }
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage(error.response ? error.response.data.error : 'Произошла ошибка');
        }
      }
    } else{
      toggleModal(true)
    }
  };

  const renderSelectedSlots = () => {
    const selectedSlots = localStorage.getItem('selectedSlots');
    if (selectedSlots) {
      try {
        const parsedSlots = JSON.parse(selectedSlots);
        if (Array.isArray(parsedSlots)) {
          return parsedSlots.map((slot, index) => {
            const [student, teacherId, language, level, lessonType, date] = slot.split(', ');
            const formattedDate = formatDateToUkrainian(date);

            return (
              <ul key={index}>
                <li>
                  <strong>Вчитель:</strong> {student}, <strong>Мова:</strong> {language}, <strong>Рівень:</strong> {level}, <strong>Тип уроку:</strong> {lessonType}, <strong>Дата:</strong> {formattedDate}
                </li>
              </ul>
            );
          });
        } else {
          return <p>No valid slots found.</p>;
        }
      } catch (error) {
        console.error("Error parsing selectedSlots", error);
        return <p>Error retrieving slots.</p>;
      }
    } else {
      const selectedTimes = localStorage.getItem('selectedDates');
      if (selectedTimes) {
        try {
          const parsedTimes = JSON.parse(selectedTimes);
          if (Array.isArray(parsedTimes)) {
            return parsedTimes.map((slot, index) => (
              <ul key={index}>
                <li>{slot}</li>
              </ul>
            ));
          } else {
            return <p>No valid times found.</p>;
          }
        } catch (error) {
          console.error("Error parsing selectedTimes", error);
          return <p>Error retrieving times.</p>;
        }
      }
    }

    return <p>No selected slots or times found.</p>;
  };


  return (
    <div>
      <div className="auth-form-container">
        <Modal isOpen={isModalOpen} onClose={() => toggleModal(false)}>
          <div className="tabs">
            <button
              className={activeTab === 'login' ? 'active' : ''}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={activeTab === 'register' ? 'active' : ''}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>
          {activeTab === 'login' ? <Login /> : <Registration />}
        </Modal>
        <h2>Оформлення</h2>
        <form onSubmit={handleSubmit}>
          <h3>Дані особистого кабінету</h3>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="phone"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {students.map((student, index) => (
            <div key={index}>
              <h4>Студент {index + 1}</h4>
              <input
                type="text"
                placeholder="Ім'я студента"
                value={student.name}
                onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
              />
              <input
                type="email"
                placeholder="Email студента"
                value={student.email}
                onChange={(e) => handleStudentChange(index, 'email', e.target.value)}
              />
              <input
                type="phone"
                placeholder="Телефон студента"
                value={student.phone}
                onChange={(e) => handleStudentChange(index, 'phone', e.target.value)}
              />
              {index === 0 && <button type="button" onClick={handleFillMe}>Я</button>}
            </div>
          ))}

          <button type="submit">Замовити</button>
        </form>
        {errorMessage && <p>{errorMessage}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </div>
      {teacherName && <div>{teacherName}{renderSelectedSlots()}</div>}
      {selectedSlots && <div>{renderSelectedSlots()}</div>}
    </div>
  );
};

export default FinalPage;
