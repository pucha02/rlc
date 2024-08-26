import Languages from "../chooseLanguage/language";
import Teachers from "../chooseTeacher/teachers"
import Date from "../chooseDate/date";
import Courses from "../chooseCourse/courses";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";

const MainPage = () => {
 return (
    <div>
      <p>MainPage</p>
      <Languages/>
      <Courses/>
      <Teachers/>
      <Date/>
    </div>
  );
};

export default MainPage;
