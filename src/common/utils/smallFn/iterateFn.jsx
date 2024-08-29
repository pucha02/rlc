import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function ArrayIteration(array, objectKey, path) {

  const navigate = useNavigate();

  const handleFinish = () => {
    const existingData = localStorage.getItem('data');

    if (existingData) {
      try {
        const dataObject = JSON.parse(existingData);

        if (!dataObject.hasOwnProperty('date') && dataObject.hasOwnProperty('teacherName')) {
          navigate('/date');

        } else if (!dataObject.hasOwnProperty('teacherName') && dataObject.hasOwnProperty('date')) {
          navigate('/teacher');
        }
        else if (dataObject.hasOwnProperty('teacherName') && dataObject.hasOwnProperty('date')) {
          navigate('/final');
        }
      } catch (e) {
        console.error('Error parsing localStorage data:', e);
        navigate('/date');
      }
    } else {
      navigate('/date');
    }
  };

  const handleClick = (item) => {
    const existingData = localStorage.getItem('data');

    let dataObject = {};
    if (existingData) {
      try {
        dataObject = JSON.parse(existingData);
        if (typeof dataObject !== 'object' || Array.isArray(dataObject)) {
          dataObject = {};
        }
      } catch (e) {
        dataObject = {};
      }
    }

    dataObject[objectKey] = item;
    localStorage.setItem('data', JSON.stringify(dataObject));
    handleFinish()
    console.log('Updated localStorage:', dataObject);
  };

  return (
    <ul>
      {array.map((item) => (
        <li onClick={() => handleClick(item)}
          key={item.id}>
          <Link to={path} state={item}>
            {item[objectKey]}
          </Link>
        </li>
      ))}
    </ul>
  );
}