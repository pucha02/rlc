import { useParams } from 'react-router-dom';
import Languages from './language';

const LanguagesWrapper = () => {
  const { id } = useParams(); // Извлечение id из URL

  return <Languages schoolId={id} />; // Передача id как schoolId в Languages
};

export default LanguagesWrapper;
