import { useNavigate, useLocation } from "react-router-dom";

const ButtonNext = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAppendPath = () => {
    const currentPath = location.pathname;
    const newPath = '/final';
    const combinedPath = `${currentPath}${newPath}`;

    navigate(combinedPath);
  };

  return <div onClick={handleAppendPath}>The end</div>;
};

export default ButtonNext;
