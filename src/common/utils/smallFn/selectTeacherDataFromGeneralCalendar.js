const selectTeacherAndDates = (teacher, lang, level, lessonTypes, time, setSelectTimes, selectTimes) => {
    const selected = `${teacher.data.teacherName}, ${teacher.data.teacherId}, ${lang}, ${level}, ${lessonTypes}, ${time}`;
    const isSelected = selectTimes.includes(selected);

    if (isSelected) {
        // Удаляем время, если оно уже выбрано
        const updatedTimes = selectTimes.filter(item => item !== selected);
        setSelectTimes(updatedTimes);
        localStorage.setItem('selectedSlots', JSON.stringify(updatedTimes));
    } else {

        const updatedTimes = [...selectTimes, selected];
        setSelectTimes(updatedTimes);
        localStorage.setItem('selectedSlots', JSON.stringify(updatedTimes));
    }
};
export default selectTeacherAndDates