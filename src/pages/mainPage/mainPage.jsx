import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Backet from '../backet/backet';
import AddBookingForm from '../../services/AdminPanel/teacher_schedule/AddBookingForm';
import EditBookingForm from '../../services/AdminPanel/teacher_schedule/EditBookingForm';
const Languages = lazy(() => import('../chooseLanguage/language'));
const Teachers = lazy(() => import('../chooseTeacher/teachers'));
const Date = lazy(() => import('../chooseDate/date'));
const Courses = lazy(() => import('../chooseCourse/courses'));
const FinalPage = lazy(() => import('../testFinalPage/testFinalPage'));
const UserProfile = lazy(() => import('../regPages/UserProfile'));
const BookingList = lazy(() => import('../../services/AdminPanel/teacher_schedule/BookingList'));
const TeacherList = lazy(() => import('../../services/AdminPanel/teacher_schedule/TeacherList'));
const LanguagesList = lazy(() => import('../../services/AdminPanel/teacher_schedule/LanguagesList'));
const LevelList = lazy(() => import('../../services/AdminPanel/teacher_schedule/LevelsList'));
const SchoolDetail = lazy(() => import('../../services/AdminPanel/data_school/SchoolDetail/SchoolDetail'));
const SchoolList = lazy(() => import('../../services/AdminPanel/create_school/SchoolList'));
const LessonTypes = lazy(() => import('../chooseLessonTypes/lessonTypes'));
const TypeLessonList = lazy(() => import('../../services/AdminPanel/teacher_schedule/TypeLessonList'));


const MainPage = () => {
  localStorage.setItem('data', {})
  localStorage.setItem('selectedDates', {})
  return (
    <Router>
      <Backet />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Languages schoolId='1'/>} />
          <Route path="/course" element={<Courses />} />
          <Route path="/date" element={<Date />} />
          <Route path="/lessoTypes" element={<LessonTypes />}/>
          <Route path="/teacher" element={<Teachers schoolId='1'/>} />
          <Route path='/final' element={<FinalPage/>}/>
          <Route path="/cabinet" element={<UserProfile/>}/>
          <Route path="/admin" element={<TeacherList/>}/>
          <Route path="/admin/school-detail" element={<SchoolDetail/>}/>
          <Route path="/admin/school-list" element={<SchoolList/>}/>
          <Route path="/add-booking" element={<AddBookingForm />} />
          <Route path="/bookinglist" element={<BookingList />} />
          <Route path="/typeLessonList" element={<TypeLessonList />}/>
          <Route path="/edit-booking/:id" element={<EditBookingForm />} />
          <Route path="/languageslist" element={<LanguagesList/>}/>
          <Route path="/levelList" element={<LevelList/>}/>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default MainPage;
