import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "../../common/components/modal/modal"
import Registration from "../regPages/Registration";
import Login from "../regPages/Login";
import './backet.css'

const Backet = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const navigate = useNavigate();

    const toggleModal = (open = !isModalOpen) => {
        setIsModalOpen(open);
    };

    const handlePersonalCabinetClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/cabinet');
        } else {
            toggleModal(true);
        }
    }

    return (
        <div className="backet-container">
            <div className="reg-btn-container">
                <div className="reg-btn" onClick={() => toggleModal(true)}>Вхід / Реєстрація</div>
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
            </div>
            <div className="personal-cabinet-btn" onClick={handlePersonalCabinetClick}>
                PersonalCabinet
            </div>
        </div>
    )
}

export default Backet