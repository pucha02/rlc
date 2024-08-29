import { useState, useEffect } from "react";
import axios from "axios";
import fetchUserData from "../../common/utils/smallFn/getUserData";

const FinalPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);

  const existingData = localStorage.getItem('data');

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData(setUser, axios, setUsername, setEmail, setPhone);
      setOrder(existingData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/registerorder', { username, email, phone, order });
      console.log(username, email, phone, order);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response ? error.response.data.error : 'An error occurred');
      console.log(order);
    }
  };

  return (
    <div>
      <h2>Последняя страница</h2>
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
