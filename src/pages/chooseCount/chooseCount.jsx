import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import LanguageSelection from "../../common/components/LanguageSelection/LanguageSelection";


const ChooseCount = () => {

    useEffect(()=>{
        localStorage.setItem('OrderId', [])
    }, [])

    const location = useLocation();
    const { level } = location.state || {};
    const { language } = location.state || {};
    const { schoolId } = location.state || {};
    const { lessonTypes } = location.state || {};


    return (
        <LanguageSelection
            title="Оберіть кількість учнів"
            type="count"
            language={language}
            level={level}
            schoolId={schoolId}
            lessonTypes={lessonTypes}
        />

    );
};

export default ChooseCount;
