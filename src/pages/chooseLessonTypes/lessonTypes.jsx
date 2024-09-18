import { useLocation } from "react-router-dom";
import LanguageSelection from "../../common/components/LanguageSelection/LanguageSelection";
import { useEffect } from "react";


const LessonTypes = () => {
    useEffect(()=>{
        localStorage.setItem('OrderId', [])
    }, [])

    const location = useLocation();
    const { level } = location.state || {};
    const { language } = location.state || {};
    const { lessonTypes } = location.state || {};
    const { schoolId } = location.state || {};
    const { count } = location.state || {};

    return (
        <LanguageSelection
            title="Оберіть тип уроку"
            data={lessonTypes}
            type="type"
            language={language}
            level={level}
            schoolId={schoolId}
            count={count}
        />

    );
};

export default LessonTypes;
