import { arrayIteration } from "../../common/utils/smallFn/iterateFn";

const Languages = () => {
  let langList = [
    {id:1, name: 'English', tab: 'lang'},
    {id:2, name: 'Spanish', tab: 'lang'}
  ];

  return (
    <div>
      <h1>Оберіть мову</h1>
      <ul>{arrayIteration(langList)}</ul>
    </div>
  );
};

export default Languages;
