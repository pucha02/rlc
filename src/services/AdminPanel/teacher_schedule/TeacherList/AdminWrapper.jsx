import { useParams } from 'react-router-dom';
import TeacherList from './TeacherList';

const AdminWrapper = () => {
  const { id } = useParams(); // Извлечение id из URL

  return <TeacherList schoolId={id} />; // Передача id как schoolId в Languages
};

export default AdminWrapper;
