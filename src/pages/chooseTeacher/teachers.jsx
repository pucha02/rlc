import { arrayIteration } from "../../common/utils/smallFn/iterateFn";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import ButtonNext from "../../common/components/buttonNext/buttonNext";

const Teachers = () => {
  let teacherList = [
    {id:1, name: 'Anna', lang: 'en', tab: 'teacher'},
    {id:2, name: 'Petro', lang: 'sp', tab: 'teacher'},
    {id:3, name: 'Klyim', lang: 'en', tab: 'teacher'},
    {id:4, name: 'Gwintivka', lang: 'sp', tab: 'teacher'},
  ]  

  const navigate = useNavigate();

    const handleFinish = () => {
        navigate('/final');
      };

  let state = useLocation().state

    return (
    <div>
      <h1>Оберіть вчителя</h1>
      {arrayIteration(teacherList, '/final')}
      <ButtonNext/>
      {console.log(state)}
    </div>
  );
};

export default Teachers;
