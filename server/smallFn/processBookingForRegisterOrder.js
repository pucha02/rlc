const { email } = require('react-admin');
const { parseUkrainianDate, formatDateToUkrainian } = require('./convertDate')
const { v4: uuidv4 } = require('uuid');

const processBooking = async (username, teacherId, lang, levelName, lessonTypes, parsedDate, SchoolModel, bookedSlots, unBookedSlots, order, teacherName, count, students, payment_status) => {

    const school = await SchoolModel.findOne({
        "ESL.teacher.data.teacherId": teacherId,
        "ESL.teacher.data.lang.lang": lang,
        "ESL.teacher.data.lang.level.levelName": levelName,
        "ESL.teacher.data.lang.level.lessonTypes.typeName": lessonTypes,
        "ESL.teacher.data.lang.level.lessonTypes.date.workTime.time": new Date(parsedDate),
    });

    if (school) {
        const teacher = school.ESL.teacher.find(teacher =>
            teacher.data.teacherId === teacherId &&
            teacher.data.lang.some(langItem =>
                langItem.lang === lang &&
                langItem.level.some(levelItem =>
                    levelItem.levelName === levelName &&
                    levelItem.lessonTypes.some(typeItem =>
                        typeItem.typeName === lessonTypes &&
                        typeItem.date.some(date =>
                            date.workTime.some(workTime =>
                                workTime.time.getTime() === new Date(parsedDate).getTime() && workTime.slots > 0
                            )
                        )
                    )
                )
            )
        );

        // Поиск соответствующего рабочего времени
        const dateObj = teacher.data.lang
            .find(langItem => langItem.lang === lang)
            .level
            .find(levelItem => levelItem.levelName === levelName)
            .lessonTypes
            .find(typeItem => typeItem.typeName === lessonTypes)
            .date
            .find(date =>
                date.workTime.some(workTime => workTime.time.getTime() === new Date(parsedDate).getTime())
            );



        // Декремент слотов
        const workTimeSlot = dateObj.workTime.find(workTime => workTime.time.getTime() === new Date(parsedDate).getTime());

        // Если слот уже забронирован пользователем
        if (workTimeSlot.bookings.some(booking => booking.userName === email)) {
            bookedSlots.push(workTimeSlot.time);
        } else {
            workTimeSlot.bookings.push({ userName: email });
            workTimeSlot.slots = (workTimeSlot.slots || 0) - count;
            unBookedSlots.push(workTimeSlot.time);
            order.push({
                teacherId,
                lang,
                levelName,
                lessonTypes,
                time: workTimeSlot.time,
                teacherName,
                students,
                payment_status
            });
        }

        // Sort workTime by time
        dateObj.workTime.sort((a, b) => new Date(a.time) - new Date(b.time));

        // Initialize an array to store non-working intervals
        const nonWorkTimes = [];
        const workTimes = dateObj.workTime;

        // Determine the start of the day and the first work interval
        const startOfDay = new Date(new Date(workTimes[0].time).setUTCHours(0, 0, 0, 0));
        const firstWorkTime = new Date(workTimes[0].time);

        // Add a non-working interval if the start of the day is before the first work interval
        if (startOfDay < firstWorkTime) {
            nonWorkTimes.push({
                start: startOfDay,
                end: new Date(firstWorkTime.getTime() - 60 * 1000),
            });
        }

        // Iterate through work intervals to find non-working intervals
        for (let i = 0; i < workTimes.length; i++) {
            const currentStart = new Date(workTimes[i].time);
            if (workTimes[i].slots === 0) {
                const previousEnd = i > 0 ? new Date(workTimes[i - 1].time) : startOfDay;
                const nextStart = i < workTimes.length - 1 ? new Date(workTimes[i + 1].time) : new Date(currentStart.setUTCHours(23, 59, 0, 0));

                if (previousEnd < currentStart) {
                    nonWorkTimes.push({
                        start: new Date(previousEnd.getTime() + 60 * 60 * 1000 - 60 * 1000 * 59),
                        end: new Date(currentStart.getTime() - 60 * 1000),
                    });
                }

                if (currentStart < nextStart) {
                    nonWorkTimes.push({
                        start: currentStart,
                        end: new Date(nextStart.getTime() - 60 * 1000),
                    });
                }
            }
        }

        // Additional pass to add remaining non-working intervals
        for (let i = 0; i < workTimes.length; i++) {
            const currentStart = new Date(workTimes[i].time);
            if (workTimes[i].slots === 0) {
                const nextStart = i < workTimes.length - 1 ? new Date(workTimes[i + 1].time) : new Date(currentStart.setUTCHours(23, 59, 0, 0));
                nonWorkTimes.push({
                    start: currentStart,
                    end: new Date(nextStart.getTime() - 60 * 1000),
                });
            } else {
                if (i > 0 && workTimes[i - 1].slots !== 0) {
                    const previousEnd = new Date(workTimes[i - 1].time);
                    if (previousEnd < currentStart) {
                        nonWorkTimes.push({
                            start: new Date(previousEnd.getTime() + 60 * 60 * 1000 - 60 * 1000 * 59),
                            end: new Date(currentStart.getTime() - 60 * 1000),
                        });
                    }
                }
            }
        }

        const lastWorkTime = new Date(workTimes[workTimes.length - 1].time);
        const endOfDay = new Date(lastWorkTime);
        endOfDay.setUTCHours(23, 59, 0, 0);

        if (lastWorkTime < endOfDay) {
            nonWorkTimes.push({
                start: new Date(lastWorkTime.getTime() + 60 * 60 * 1000 - 60 * 1000 * 59),
                end: endOfDay,
            });
        }

        // Save non-working intervals to the date object
        dateObj.nonWorkTime = nonWorkTimes;

        // Обновляем данные школы
        await school.save();
        console.log(`Бронирование подтверждено для времени ${formatDateToUkrainian(parsedDate)}`);
    } else {
        console.log(`Школа не найдена для времени ${parsedDate}`);
    }
}

module.exports = processBooking