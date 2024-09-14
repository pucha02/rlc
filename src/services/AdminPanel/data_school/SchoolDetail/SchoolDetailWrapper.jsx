import { useParams } from 'react-router-dom';
import SchoolDetail from './SchoolDetail';

const SchoolDetailWrapper = () => {
  const { id } = useParams(); // Извлечение id из URL

  return <SchoolDetail schoolId={id} />; // Передача id как schoolId в Languages
};

export default SchoolDetailWrapper;
