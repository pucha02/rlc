import { useLocation } from "react-router-dom";
import LanguageSelection from "../../common/components/LanguageSelection/LanguageSelection";
import { parseUkrainianDate } from "../../common/utils/smallFn/convertDate";
import axios from "axios";
import { useEffect, useState } from "react";


const ChoosePriority = () => {
    const [allTeachers, setAllTeachers] = useState([])

    const location = useLocation();
    const { level } = location.state || {};
    const { language } = location.state || {};
    const { schoolId } = location.state || {};
    const { lessonTypes } = location.state || {};
    const { count } = location.state || {};

    const selectedTimes = [];

    useEffect(() => {
        localStorage.setItem('selectedDates', []);
        localStorage.setItem('OrderId', [])
        fetchSchoolData()
    }, [])

    const fetchSchoolData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/schools/${schoolId}`);
            let teachers = response.data[0].ESL.teacher;

            if (level) {
                let parsedSelectedTimes = [];
                if (typeof selectedTimes === 'string' && selectedTimes.length > 0) {
                    try {
                        // Parse selectedTimes from localStorage
                        parsedSelectedTimes = JSON.parse(selectedTimes);
                    } catch (e) {
                        console.error('Invalid JSON string for selectedTimes:', e);
                    }
                }
                // Ensure parsedSelectedTimes is always an array
                if (!Array.isArray(parsedSelectedTimes)) {
                    parsedSelectedTimes = [];
                }
                teachers = teachers.filter(teacher =>
                    teacher.data &&
                    teacher.data.lang.some(langObj =>
                        langObj.level &&
                        langObj.level.some(l =>
                            l.levelName === level &&
                            (langObj.lang === language) &&
                            l.lessonTypes.some(lessonTypeObj =>
                                lessonTypeObj.typeName === lessonTypes &&
                                (parsedSelectedTimes.length === 0 ||
                                    parsedSelectedTimes.some(selectedDate =>
                                        lessonTypeObj.date.some(dateObj =>
                                            dateObj.workTime.some(workTimeSlot =>
                                                new Date(workTimeSlot.time).getTime() === new Date(parseUkrainianDate(selectedDate)).getTime() && workTimeSlot.slots > 0
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                );
            }

            const allTeacherDates = teachers.flatMap(teacher =>
                teacher.data.lang
                    .filter(langObj => langObj.lang === language)
                    .flatMap(langObj =>
                        langObj.level
                            .filter(lv => lv.levelName === level)
                            .flatMap(lv => lv.lessonTypes.filter(lv => lv.typeName == lessonTypes)
                                .flatMap(lv => lv.date)
                            )

                    )
            );
            console.log(allTeacherDates)
            setAllTeachers(allTeacherDates);

        } catch (error) {

        }
    };

    return (
        <LanguageSelection
            title="Оберіть Пріорітет"
            type="priority"
            language={language}
            level={level}
            schoolId={schoolId}
            lessonTypes={lessonTypes}
            count={count}
            allTeachers={allTeachers}
        />

    );
};

export default ChoosePriority;
