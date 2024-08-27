import { arrayIteration } from "../../common/utils/smallFn/iterateFn";
import { useLocation } from "react-router-dom";


const Teachers = () => {
  let teacherList = [
    { id: 1, name: 'Anna', lang: 'en' },
    { id: 2, name: 'Petro', lang: 'sp' },
    { id: 3, name: 'Klyim', lang: 'en' },
    { id: 4, name: 'Gwintivka', lang: 'sp' },
  ]

  let state = useLocation().state

  return (
    <div>
      <h1>Оберіть вчителя</h1>
      {arrayIteration(teacherList)}
      {console.log(state)}
    </div>
  );
};

export default Teachers;
