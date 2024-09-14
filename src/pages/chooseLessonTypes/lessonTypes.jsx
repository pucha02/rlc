import { useLocation } from "react-router-dom";
import LanguageSelection from "../../common/components/LanguageSelection/LanguageSelection";


const LessonTypes = () => {

    const location = useLocation();
    const { level } = location.state || {};
    const { language } = location.state || {};
    const { lessonTypes } = location.state || {};
    const { schoolId } = location.state || {};

    return (
        <LanguageSelection
            title="Оберіть рівень"
            data={lessonTypes}
            type="type"
            language={language}
            level={level}
            schoolId={schoolId}
        />

    );
};

export default LessonTypes;
