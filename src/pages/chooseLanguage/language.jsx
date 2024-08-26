import { arrayIteration } from "../../common/utils/smallFn/iterateFn";  

const Languages = () => {
  let langList = ["Анеглійська", "Іспанська"];

  return (
    <div>
      <h1>Оберіть мову</h1>
      <ul>{arrayIteration(langList)}</ul>
    </div>
  );
};

export default Languages;
