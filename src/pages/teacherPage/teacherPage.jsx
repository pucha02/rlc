// import { useLocation } from "react-router-dom";
// import Footer from "../../common/components/Footer/Footer";
// import { Link } from 'react-router-dom';
// import LogoImg from '../../services/images/Group12.svg'
// import Teacher1Img from '../../services/images/teach1.jpg'

// const TeacherPage = () => {
//     const location = useLocation();
//     const { teacher } = location.state || {};
//     const { schoolId } = location.state || {};

//     const addReview = async () => {
//         if (newReview.username && newReview.rating && newReview.text) {
//             const updatedReviews = [...reviews, newReview];
//             setReviews(updatedReviews);
//             setNewReview({ username: '', rating: '', text: '' });

//             // Save the new review to the backend
//             try {
//                 const response = await fetch(`http://13.53.147.216http://13.60.221.226/api/itemProducts/${id}/reviews`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(newReview)
//                 });

//                 if (!response.ok) {
//                     console.error('Failed to save review:', response.statusText);
//                 }
//             } catch (error) {
//                 console.error('Error saving review:', error);
//             }
//         }
//     };

//     console.log(teacher.data.description)
//     return (
//         <>
//             <div className="main">
//                 <div className="container">
//                     <div className='logo'>
//                         <div className='logo-items'>
//                             <Link to={`/${schoolId}`}><img src={LogoImg} alt="Logo" /></Link>
//                             <div className='logo-name'>Мовна школа <span>EAGLES</span></div>
//                         </div>
//                     </div>
//                     <div className='container-items-block'>
//                         <div className="school-data">
//                             <div className="teacherImg">
//                                 <img src={Teacher1Img} alt="" />
//                             </div>
//                             <div>{teacher.data.description}</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     )
// }

// export default TeacherPage