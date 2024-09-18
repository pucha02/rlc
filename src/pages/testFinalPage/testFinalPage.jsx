import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { formatDateToUkrainian } from "../../common/utils/smallFn/convertDate";
import generatePaymentURL from "../../common/utils/payments/generatePaymentUrl";
import checkPaymentStatus from "../../common/utils/payments/checkPaymentStatus";
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import LogoImg from '../../services/images/Group12.svg'
import Modal from "../../common/components/modal/modal";
import Login from "../regPages/Login";
import Registration from "../regPages/Registration";
import axios from "axios";
import './finalPage.css'
import '../chooseLanguage/language.css'
import '../backet/backet.css'
import fetchUserData from "../../common/utils/smallFn/getUserData";
import UserIconImg from '../../services/images/personal-cab.svg'
import PhoneIconImg from '../../services/images/phone.svg'
import Footer from "../../common/components/Footer/Footer";

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
  const [paymentStatus, setPaymentStatus] = useState('Не оплачено');
  const [orderId, setOrderId] = useState()
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [autoFill, setAutoFill] = useState(false);

  const location = useLocation();
  const { language, level, lang_from_general_cal, teacherId, teacherName, lessonTypes, count, schoolId } = location.state || {};


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

    if (!token) {
      toggleModal(true);
      return;
    }

    try {
      const newOrderId = `order_${Math.random().toString(36).substr(2, 9)}`;

      setOrderId(newOrderId); // Обновляем состояние с новым orderId
      localStorage.setItem('OrderId', newOrderId)
      // Используем локальную переменную newOrderId для генерации ссылки
      const paymentUrl = generatePaymentURL(newOrderId);
      window.open(paymentUrl, '_blank');
    } catch (error) {
      console.error('Ошибка при оплате или отправке данных', error);
      setErrorMessage('Произошла ошибка при оплате');
    }
  };


  const handleNext = () => {
    if (currentStudentIndex < students.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStudentIndex > 0) {
      setCurrentStudentIndex(currentStudentIndex - 1);
    }
  };

  const handleAutoFillChange = (e) => {
    setAutoFill(e.target.checked);

    if (e.target.checked) {
      // Если переключатель включен, автоматически заполняем первую форму
      handleStudentChange(0, 'name', username);
      handleStudentChange(0, 'email', email);
      handleStudentChange(0, 'phone', phone);
    } else{
      handleStudentChange(0, 'name', '');
      handleStudentChange(0, 'email', '');
      handleStudentChange(0, 'phone', '');
    }
  };

  return (
    <>
      <div className="main final">
        <div className="container">
          <div className='logo'>
            <div className='logo-items'>
              <Link to={`/${schoolId}`}><img src={LogoImg} alt="Logo" /></Link>
            </div>
          </div>
          <div className="auth-form-container">
            <Modal isOpen={isModalOpen} onClose={() => toggleModal(false)}>
              <div className="tabs">
                <button
                  className={activeTab === 'login' ? 'active' : ''}
                  onClick={() => setActiveTab('login')}
                >
                  Вхід
                </button>
                <button
                  className={activeTab === 'register' ? 'active' : ''}
                  onClick={() => setActiveTab('register')}
                >
                  Реєстрація
                </button>
              </div>
              {activeTab === 'login' ? <Login /> : <Registration />}
            </Modal>
            <h2>Підтвердження запису</h2>
            <form onSubmit={handleSubmit}>
              {/* <div className="field">
                <img src={UserIconImg} alt="" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div> */}
              <div className="field">
                <img src={UserIconImg} alt="" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* <div className="field">
                <img src={PhoneIconImg} alt="" />
                <input
                  type="phone"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div> */}

{students.length > 0 && (
            <>
              <div key={currentStudentIndex}>
                <h4>Студент {currentStudentIndex + 1}</h4>
                {/* Чекбокс для автозаполнения */}
                {currentStudentIndex === 0 && (
                  <div className="auto-fill">
                    <input
                      type="checkbox"
                      id="auto-fill"
                      checked={autoFill}
                      onChange={handleAutoFillChange}
                    />
                    <label htmlFor="auto-fill">Заполнить данными профиля</label>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Ім'я студента"
                  value={students[currentStudentIndex].name}
                  onChange={(e) => handleStudentChange(currentStudentIndex, 'name', e.target.value)}
                />
                {/* <input
                  type="email"
                  placeholder="Email студента"
                  value={students[currentStudentIndex].email}
                  onChange={(e) => handleStudentChange(currentStudentIndex, 'email', e.target.value)}
                /> */}
                <input
                  type="phone"
                  placeholder="Телефон студента"
                  value={students[currentStudentIndex].phone}
                  onChange={(e) => handleStudentChange(currentStudentIndex, 'phone', e.target.value)}
                />
              </div>
              <div className="actions">
                {currentStudentIndex > 0 && <button type="button" onClick={handleBack}>Назад</button>}
                {currentStudentIndex < students.length - 1 && <button type="button" onClick={handleNext}>Далі</button>}
                {currentStudentIndex === students.length - 1 && <button type="submit">Оплатити</button>}
              </div>
            </>
          )}

              {/* <div className="actions">
                <button type="button" className="fill-me-button" onClick={handleFillMe}>Заповнити моїми даними</button>
                <button type="submit" className="submit-button">Оплатити</button>
              </div> */}

              <p>{message}</p>
              <p className="error-message">{errorMessage}</p>

              <div>
                <h3>Статус платежу: {paymentStatus}</h3>
                <button type="button" onClick={() => checkPaymentStatus({
                  orderId: localStorage.getItem('OrderId'),
                  username,
                  email,
                  phone,
                  order,
                  time,
                  lang,
                  levelName,
                  teacherId,
                  teacherName,
                  lessonTypes,
                  selectedSlots,
                  count,
                  students,
                  setPaymentStatus,
                  setMessage,
                  setErrorMessage
                })}>Перевірити статус оплати</button>
              </div>
            </form>
          </div>
        </div >
      </div >
      <Footer />
    </>
  );
};

export default FinalPage;
