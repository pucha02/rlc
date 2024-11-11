import axios from "axios";
import { parseUkrainianDate } from "./convertDate";

const fetchSchoolData = async (schoolId, level, selectedTimes, language, lang_from_general_cal, lessonTypes, setLang, setAllTeachers, setSchoolData, setError, setLoading) => {
    try {
      const response = await axios.get(`http://13.60.221.226/api/schools/${schoolId}`);
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
              (langObj.lang === language || langObj.lang === lang_from_general_cal) &&
              l.lessonTypes.some(lessonTypeObj =>
                lessonTypeObj.typeName === lessonTypes &&
                (parsedSelectedTimes.length === 0 ||
                  parsedSelectedTimes.some(selectedDate =>
                    lessonTypeObj.date.some(dateObj =>
                      dateObj.workTime.some(workTimeSlot =>
                        new Date(new Date(workTimeSlot.time).getTime() + new Date(workTimeSlot.time).getTimezoneOffset() * 60000).getTime() === new Date(new Date(parseUkrainianDate(selectedDate))).getTime() && workTimeSlot.slots > 0                      )
                    )
                  )
                )
              )
            )
          )
        );
      }
      console.log(teachers)
      const languages = teachers.flatMap(teacher =>
        teacher.data.lang.flatMap(langObj =>
          langObj.lang
        )
      );

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

      if (language) {
        setLang(languages);
      } else if (lang_from_general_cal) {
        setLang(lang_from_general_cal);
      }

      setAllTeachers(allTeacherDates);
      setSchoolData(teachers);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  export default fetchSchoolData