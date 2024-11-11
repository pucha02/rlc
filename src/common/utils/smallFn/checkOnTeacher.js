import { useNavigate } from "react-router-dom";

const HandleFinish = (navigate) => {
    

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

const handleClick = (item, objectKey, navigate) => {
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
    HandleFinish(navigate)
    console.log('Updated localStorage:', dataObject);
};
 
  export default handleClick;