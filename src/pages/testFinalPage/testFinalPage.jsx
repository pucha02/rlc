import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { formatDateToUkrainian } from "../../common/utils/smallFn/convertDate";
import RenderSelectedSlots from "../../common/utils/smallFn/getResultData";
import generatePaymentURL from "../../common/utils/payments/generatePaymentUrl";
import orderRequest from "../../common/utils/payments/orderRequest";
import { Link } from 'react-router-dom';
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
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [time, setTime] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState(null);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [activeTabResult, setActiveTabResult] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderId, setOrderId] = useState()
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

  const location = useLocation();
  const { language, level, lang_from_general_cal, teacherId, teacherName, lessonTypes, count, schoolId,  price, logo, name } = location.state || {};

  console.log(price)
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get('http://13.60.221.226/api/checkpaymentstatus', {
          params: { orderId }
        });

        console.log(response.data)
        // Останавливаем проверку, если оплата прошла успешно
        if (response.data === 'success') {
          try {
            setPaymentStatus('Оплачено');
            setMessage('Оплату успішно підтверджено.');

            // Отправляем данные заказа на сервер
            const resp = await axios.post('http://13.60.221.226/api/registerorder', {
              username, email, phone, order, time, lang, levelName, teacherId, teacherName, lessonTypes, selectedSlots, count, students, payment_status: 'Оплачено'
            });

            if (resp.status === 201) {
              // Если время было успешно забронировано
              const bookedTimes = resp.data.unBookedSlots.map(slot => formatDateToUkrainian(slot));
              setMessage(`Час заброньовано: ${bookedTimes.join(', ')}`);
            }
          } catch (error) {
            if (error.response && error.response.status === 400) {
              const bookedTimes = error.response.data.bookedSlots.map(slot => formatDateToUkrainian(slot));
              const unBookedTimes = error.response.data.unBookedSlots.map(slot => formatDateToUkrainian(slot));

              let errorMessage = `Ви вже маєте запис на час: ${bookedTimes.join(', ')}`;

              if (unBookedTimes.length > 0) {
                errorMessage += `\nУспішно заброньовані: ${unBookedTimes.join(', ')}`;
              }

              setErrorMessage(errorMessage);
            } else {
              setErrorMessage(error.response ? error.response.data.error : 'Виникла помилка');
            }
          }
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Ошибка проверки статуса оплаты", error);
      }
    }, 5000); // Проверяем каждые 5 секунд

    return () => clearInterval(intervalId);  // Чистим интервал при размонтировании компонента
  }, [orderId]);

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

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const toggleModal = (open = !isModalOpen) => {
    setIsModalOpen(open);
    setActiveTabResult(open)
  };

  const toggleModalResult = (open = !activeTabResult) => {
    setActiveTabResult(open)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const token = localStorage.getItem('token');

    // if (!token) {
    //   toggleModal(true);
    //   return;
    // }

    try {
      const newOrderId = `order_${Math.random().toString(36).substr(2, 9)}`;

      setOrderId(newOrderId); // Обновляем состояние с новым orderId
      localStorage.setItem('OrderId', newOrderId)
      // Используем локальную переменную newOrderId для генерации ссылки
      const paymentUrl = generatePaymentURL(newOrderId);
      window.open(paymentUrl, '_blank');
    } catch (error) {
      console.error('Помилка при оплаті або надсиланні даних', error);
      setErrorMessage('Сталася помилка під час оплати');
    }
  };

  const handleNext = () => {
    // Проверяем валидность email при нажатии на кнопку
    if (!isValidEmail(email)) {
      setErrorMessageEmail('Email введено неправильно');
      return; // Прерываем выполнение функции, если email некорректен
    }
  
    setErrorMessageEmail('');
  
    // Переходим к следующему студенту
    if (currentStudentIndex < students.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1);
    }
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  
    if (errorMessageEmail) {
      setErrorMessageEmail(''); // Очищаем сообщение, если оно было выведено
    }
  };

  const handleBack = () => {
    if (currentStudentIndex > 0) {
      setCurrentStudentIndex(currentStudentIndex - 1);
    }
  };

  return (
    <>
      <div className="main final">
        <div className="container">
          <div className='logo'>
            <div className='logo-items'>
              <Link to={`/${schoolId}`}><img src={logo} alt="Logo" /></Link>
              <div className='logo-name'>Мовна школа <span>{name}</span></div>
            </div>
          </div>
          <div className="auth-form-container">
            <Modal className={'modal-content'} isOpen={isModalOpen} onClose={() => toggleModal(false)}>
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
            <form className="order-confirm-form" onSubmit={handleSubmit}>

              <div className="field">
                <img src={UserIconImg} alt="" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                />
                <p className="error-message-email">{errorMessageEmail}</p>
              </div>

              {students.length > 0 && (
                <>
                  <div key={currentStudentIndex}>
                    <h4 className="student-number">Студент {currentStudentIndex + 1}</h4>

                    <div className="field">
                      <img src={UserIconImg} alt="" />
                      <input
                        type="text"
                        placeholder="Ім'я студента"
                        value={students[currentStudentIndex].name}
                        onChange={(e) =>
                          handleStudentChange(currentStudentIndex, 'name', e.target.value)
                        }
                      />
                    </div>

                    <div className="field">
                      <img src={PhoneIconImg} alt="" />
                      <input
                        type="phone"
                        placeholder="Телефон студента"
                        value={students[currentStudentIndex].phone}
                        onChange={(e) =>
                          handleStudentChange(currentStudentIndex, 'phone', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="actions">
                    {currentStudentIndex > 0 && (
                      <button type="button" onClick={handleBack}>
                        Назад
                      </button>
                    )}

                    {currentStudentIndex < students.length - 1 && (
                      <button
                        type="button"
                        onClick={handleNext}
                        
                      // disabled={!students[currentStudentIndex].name || !students[currentStudentIndex].phone || !isValidEmail(email)}
                      >
                        Далі
                      </button>
                    )}

                    {currentStudentIndex === students.length - 1 && (
                      <button
                        type="button"
                        onClick={() => toggleModalResult(true)}
                        disabled={!students[currentStudentIndex].name || !students[currentStudentIndex].phone || !isValidEmail(email)}
                      >
                        Оплатити
                      </button>
                    )}
                  </div>
                </>
              )}
              <div>
                <Modal className={'modal-content-result'} isOpen={activeTabResult} onClose={() => toggleModalResult(false)}>
                  <div >
                    <div className="">
                      <h2>Підсумок</h2>
                      <div className="studentsList" >
                        <span className="modal-close" onClick={() => toggleModalResult(false)}>&times;</span>
                        {/* <div className="triangle"></div> */}
                        <div className="students-block">
                          <div className="students-head">Учні:</div>
                          <div className="contents-block">
                            {students.map((student, index) => (
                              <div className="content" key={index}>
                                <p>{student.name}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {language && <div>{teacherName}{RenderSelectedSlots(language, level, lang_from_general_cal, teacherId, teacherName, lessonTypes, count, schoolId, price)}</div>}
                      {lang_from_general_cal && <div>{RenderSelectedSlots(language, level, lang_from_general_cal, teacherId, teacherName, lessonTypes, count, schoolId, price)}</div>}
                    </div>
                    <div className="pay-btns">
                      <button type="submit">Оплатити</button>
                      <button type="button" onClick={() => {
                        orderRequest({
                          username, email, phone, order, time, lang, levelName, teacherId, teacherName, lessonTypes, selectedSlots, count, students, setMessage, setErrorMessage
                        });
                        toggleModalResult(false); // Вызов дополнительной функции
                      }}>Зробити заявку</button>
                    </div>
                    <div className="status-pay">
                      <h3>{paymentStatus && <div>Статус платежу: {paymentStatus}</div>}</h3>
                    </div>
                  </div>
                </Modal>
              </div>
              <p>{message}</p>
              <p className="error-message">{errorMessage}</p>
            </form>
          </div>
        </div >
      </div >
      <Footer />
    </>
  );
};

export default FinalPage;
