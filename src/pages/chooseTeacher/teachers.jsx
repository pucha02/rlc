import { arrayIteration } from "../../common/utils/smallFn/iterateFn";

const Teachers = ({}) => {
  let teacherList = ['Anna', 'Petro', 'Klyim', 'Gwintivka']  
    return (
    <div>
      <h1>Оберіть вчителя</h1>
      {arrayIteration(teacherList)}
    </div>
  );
};

export default Teachers;
