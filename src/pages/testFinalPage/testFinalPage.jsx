import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  const [order, setOrder] = useState(null);
  const [time, setTime] = useState(null);

  const location = useLocation();
  const { language } = location.state || {};
  const { level } = location.state || {};
  const { lang_from_general_cal } = location.state || {};
  const { teacherId } = location.state || {};
  
  console.log(lang_from_general_cal, level, teacherId)

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData(setUser, axios, setUsername, setEmail, setPhone);

      const existingData = localStorage.getItem('data');
      const selectedTimes = localStorage.getItem('selectedDates');
      console.log(existingData)
      setOrder(existingData);
      setTime(selectedTimes);
      if (language) {
        setLang(language)
      } else if (lang_from_general_cal) {
        setLang(lang_from_general_cal)
      }
      setLevelName(level)
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        `http://localhost:5000/registerorder`,
        { username, email, phone, order, time, lang, levelName, teacherId }
      );

      setMessage(response.data.message);
      
    } catch (error) {
      setMessage(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  return (
    <div>
      <div className="auth-form-container">
        <h2>Оформлення</h2>
        <form onSubmit={handleSubmit}>
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

          <button type="submit">Замовити</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default FinalPage;





