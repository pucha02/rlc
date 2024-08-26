import { arrayIteration } from "../../common/utils/smallFn/iterateFn";

const Teachers = ({}) => {
  let teacherList = [
    {id:1, name: 'Anna'},
    {id:2, name: 'Petro'},
    {id:3, name: 'Klyim'},
    {id:4, name: 'Gwintivka'},
  ]  
    return (
    <div>
      <h1>Оберіть вчителя</h1>
      {arrayIteration(teacherList)}
    </div>
  );
};

export default Teachers;
