const getTeacherAvailableTimes = (teacher, selectedTimes, lang_from_general_cal, level, parseUkrainianDate, lessonTypes) => {
  // Попытка загрузить данные из localStorage
  const savedAvailableTimes = localStorage.getItem(`availableTimes_${teacher.data.teacherId}`);
  if (savedAvailableTimes) {
    try {
      const parsedAvailableTimes = JSON.parse(savedAvailableTimes);
      return parsedAvailableTimes.map(timeSlot => timeSlot.time);
    } catch (e) {
      console.error('Invalid JSON string for availableTimes', e);
    }
  }

  // Если в localStorage данных нет, выполняем стандартный расчет
  let parsedSelectedTimes = [];
  if (typeof selectedTimes === 'string') {
    try {
      parsedSelectedTimes = JSON.parse(selectedTimes);
      // Дополнительная проверка, чтобы убедиться, что parsedSelectedTimes является массивом
      if (!Array.isArray(parsedSelectedTimes)) {
        console.error('parsedSelectedTimes is not an array:', parsedSelectedTimes);
        parsedSelectedTimes = []; // Обнуляем, чтобы избежать ошибок в дальнейшем
      }
    } catch (e) {
      console.error('Invalid JSON string for selectedTimes', e);
    }
  } else if (Array.isArray(selectedTimes)) {
    parsedSelectedTimes = selectedTimes; // Если selectedTimes уже массив
  }
  // .filter(lv => lv.lessonTypes == lessonTypes)
  const availableTimes = teacher.data.lang
    .filter(langObj => langObj.lang === lang_from_general_cal)
    .flatMap(langObj => langObj.level)
    .filter(lv => lv.levelName === level)
    .flatMap(lv =>lv.lessonTypes.filter(lv => lv.typeName == lessonTypes))
    .flatMap(lv => lv.date)
    .flatMap(dateObj => dateObj.workTime)
    .filter(workTimeSlot =>
      parsedSelectedTimes.some(selectedDate =>
        new Date(new Date(workTimeSlot.time).getTime() + new Date(workTimeSlot.time).getTimezoneOffset() * 60000).getTime() === new Date(new Date(parseUkrainianDate(selectedDate))).getTime() && workTimeSlot.slots > 0      )
    );
  console.log(availableTimes)
  localStorage.setItem(`availableTimes_${teacher.data.teacherId}`, JSON.stringify(availableTimes));

  return availableTimes.map(timeSlot => timeSlot.time);
};

export default getTeacherAvailableTimes;
