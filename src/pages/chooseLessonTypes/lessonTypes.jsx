import { useLocation } from "react-router-dom";
import LanguageSelection from "../../common/components/LanguageSelection/LanguageSelection";
import { useEffect } from "react";


const LessonTypes = () => {
    useEffect(() => {
        localStorage.setItem('OrderId', [])
    }, [])

    const location = useLocation();
    const { level } = location.state || {};
    const { language } = location.state || {};
    const { lessonTypes } = location.state || {};
    const { schoolId } = location.state || {};
    const { count } = location.state || {};
    const { logo } = location.state || {};
    const { name } = location.state || {};
    console.log(lessonTypes)
    return (
        <>
            <LanguageSelection
                title="Оберіть тип уроку"
                data={lessonTypes}
                type="type"
                language={language}
                level={level}
                schoolId={schoolId}
                count={count}
                logo={logo}
                name={name}
            />
            {lessonTypes && !lessonTypes.find(type => type.typeName === 'Групові') ? <p>Нема</p> : null}

        </>

    );
};

export default LessonTypes;
