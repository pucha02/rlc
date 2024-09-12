import { ArrayIteration } from "../../common/utils/smallFn/iterateFn";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";


const LessonTypes = () => {

    const location = useLocation();
    const { level } = location.state || {};
    const { language } = location.state || {};
    const { lessonTypes } = location.state || {};
    {console.log(lessonTypes)}
    return (
        <div className="course-page">
            <h1 className="course-page-title">Оберіть Вид занятть</h1>
            {lessonTypes && (
                <div className="course-levels">
                    {lessonTypes.map((ls, index) => (
                        <Link
                            className="course-level-link"
                            to={'/teacher'}
                            state={{ level: level, language: language, lessonTypes: ls.typeName }}
                        >
                            <div className="course-level-card" key={index}>
                                <p> 
                                    {ls.typeName}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>

    );
};

export default LessonTypes;
