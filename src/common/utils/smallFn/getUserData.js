const fetchUserData = async (setUser, axios, setUsername = null, setEmail = null, setPhone = null, setOrders = null) => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await axios.get('http://localhost:5000/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log('Response Data:', response.data);

            const { user, orders } = response.data;
            console.log('Response Data:', orders[0]);
            setUser(user);
            setUsername(user.username);
            setEmail(user.email);
            setPhone(user.phone);
            setOrders(orders)

        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
};

export default fetchUserData;
