import { arrayIteration } from "../../common/utils/smallFn/iterateFn";

const Date = () => {
  let dateList = ["13", "23", "11"];

  return (
    <div>
      <h1>Виберіть дату</h1>
      {arrayIteration(dateList)}
    </div>
  );
};

export default Date;
