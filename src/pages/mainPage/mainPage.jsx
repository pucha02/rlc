import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Backet from '../backet/backet';

const Languages = lazy(() => import('../chooseLanguage/language'));
const Teachers = lazy(() => import('../chooseTeacher/teachers'));
const Date = lazy(() => import('../chooseDate/date'));
const Courses = lazy(() => import('../chooseCourse/courses'));
const FinalPage = lazy(() => import('../testFinalPage/testFinalPage'));
const UserProfile = lazy(() => import('../regPages/UserProfile'));


const MainPage = () => {
  localStorage.setItem('data', {})
  return (
    <Router>
      <Backet />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Languages />} />
          <Route path="/course" element={<Courses />} />
          <Route path="/date" element={<Date />} />
          <Route path="/teacher" element={<Teachers />} />
          <Route path='/final' element={<FinalPage/>}/>
          <Route path="/cabinet" element={<UserProfile/>}/>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default MainPage;
