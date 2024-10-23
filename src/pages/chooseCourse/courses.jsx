import { useLocation } from "react-router-dom";
import LanguageSelection from "../../common/components/LanguageSelection/LanguageSelection";
import { useEffect } from "react";


const Courses = () => {

    useEffect(() => {
        localStorage.setItem('OrderId', [])
    }, [])

    const location = useLocation();
    const { level } = location.state || {};
    const { language } = location.state || {};
    const { schoolId } = location.state || {};
    const { logo } = location.state || {};
    const { name } = location.state || {};
    console.log(schoolId)
    return (
        <LanguageSelection
            title="Оберіть рівень"
            data={level}
            type="level"
            language={language}
            schoolId={schoolId}
            logo={logo}
            name={name}
        />

    );
};

export default Courses;
