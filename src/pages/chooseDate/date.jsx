import { arrayIteration } from "../../common/utils/smallFn/iterateFn";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";


const Date = () => {
  let dateList = [
    {id:1, name: "1"},
    {id:2, name: "11"},
    {id:3, name: "15"}
  ];

  let state = useLocation().state

  return (
    <div>
      <h1>Виберіть дату</h1>
      {arrayIteration(dateList)}
      {console.log(state)}
      <Link to={'/teachers'}>
        <div>Choose Teacher</div>
      </Link>
    </div>
  );
};

export default Date;
