const getTeacherAvailableTimes = (teacher, selectedTimes, lang_from_general_cal, level, parseUkrainianDate) => {
  // Попытка загрузить данные из localStorage
  const savedAvailableTimes = localStorage.getItem(`availableTimes_${teacher.data.teacherId}`);
  if (savedAvailableTimes) {
    try {
      const parsedAvailableTimes = JSON.parse(savedAvailableTimes);
      return parsedAvailableTimes.map(timeSlot => timeSlot.time);
    } catch (e) {
      console.error('Invalid JSON string for availableTimes');
    }
  }
  // Если в localStorage данных нет, выполняем стандартный расчет
  let parsedSelectedTimes = [];
  if (typeof selectedTimes === 'string') {
    try {
      parsedSelectedTimes = JSON.parse(selectedTimes);
    } catch (e) {
      console.error('Invalid JSON string for selectedTimes');
    }
  }
  console.log('getTeacherAvailableTimes', )
  const availableTimes = teacher.data.lang.filter(langObj => langObj.lang === lang_from_general_cal).flatMap(langObj => langObj.level).filter(lv => lv.levelName === level).flatMap(lv => lv.lessonTypes).flatMap(lv => lv.date).flatMap(dateObj => dateObj.workTime).filter(workTimeSlot =>
    parsedSelectedTimes.some(selectedDate =>
      new Date(workTimeSlot.time).getTime() === new Date(parseUkrainianDate(selectedDate)).getTime() && workTimeSlot.slots > 0
    )
  )

  localStorage.setItem(`availableTimes_${teacher.data.teacherId}`, JSON.stringify(availableTimes));

  return availableTimes.map(timeSlot => timeSlot.time);
};

export default getTeacherAvailableTimes;