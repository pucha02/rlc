import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Languages from "../chooseLanguage/language";
import Teachers from "../chooseTeacher/teachers";
import Date from "../chooseDate/date";
import Courses from "../chooseCourse/courses";

const MainPage = () => {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Languages />}></Route>
        <Route exact path=":name/:date/:name" element={<Teachers />}></Route>
        <Route exact path=":name/:date" element={<Date />}></Route>
        <Route exact path=":name" element={<Courses />}></Route>
      </Routes>
    </Router>
  );
};

export default MainPage;