import { ArrayIteration } from "../../common/utils/smallFn/iterateFn";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import './courses.css'

const Courses = () => {

    const location = useLocation();
    const { level } = location.state || {};
    const { language } = location.state || {};
    console.log(level)
    return (
        <div className="course-page">
            <h1 className="course-page-title">Оберіть рівень</h1>
            {level && (
                <div className="course-levels">
                    {level.map((lv, index) => (
                        <Link
                            className="course-level-link"
                            to={'/teacher'}
                            state={{ level: lv.levelName, language: language }}
                        >
                            <div className="course-level-card" key={index}>
                                <p>

                                    {lv.levelName}

                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>

    );
};

export default Courses;
