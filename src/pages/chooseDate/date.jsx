import { arrayIteration } from "../../common/utils/smallFn/iterateFn";

const Date = () => {
  let dateList = [
    {id:1, name: "1"},
    {id:2, name: "11"},
    {id:3, name: "15"}
  ];

  return (
    <div>
      <h1>Виберіть дату</h1>
      {arrayIteration(dateList)}
    </div>
  );
};

export default Date;
