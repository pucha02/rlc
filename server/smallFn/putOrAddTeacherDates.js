const putOrAddTeacherDates = async (SchoolModel, schoolId, teacherId, req, res) => {
    const school = await SchoolModel.findOne({ "id": schoolId, "ESL.teacher.data.teacherId": teacherId });
    if (!school) return res.status(404).json({ message: 'School or teacher not found' });
    console.log(schoolId, teacherId)

    const teacher = school.ESL.teacher.find(t => t.data.teacherId === teacherId);

    const lang = teacher.data.lang.find(l => l.lang === req.body.lang);
    if (!lang) return res.status(404).json({ message: 'Language not found' });

    let level

    if (typeof (req.body.levelName) != 'object') {
        level = lang.level.find(lv => lv.levelName === req.body.levelName);
    } else {
        level = lang.level.find(lv => lv.levelName === req.body.levelName.levelName);
    }
    if (!level) return res.status(404).json({ message: 'Level not found' });

    const lessonTypes = level.lessonTypes.find(lv => lv.typeName === req.body.lessonTypes);
    if (!lessonTypes) return res.status(404).json({ message: 'Level not found' });


    const workTimes = req.body.workTime.map(wt => {
        const adjustedTime = new Date(new Date(wt.time).getTime() + 3 * 60 * 60 * 1000);
        console.log(adjustedTime)
        return { ...wt, time: adjustedTime };
    }).sort((a, b) => new Date(a.time) - new Date(b.time));

    const nonWorkTimes = [];

    // Non-working time from the start of the day to the first work time
    const startOfDay = new Date(new Date(workTimes[0].time).setUTCHours(0, 0, 0, 0));
    const firstWorkTime = new Date(workTimes[0].time);

    if (startOfDay < firstWorkTime) {
        nonWorkTimes.push({
            start: startOfDay,
            end: new Date(firstWorkTime.getTime() - 60 * 1000) // 1 minute before work starts
        });
    }

    // Process work times and add non-working intervals where nr = 0
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
            end: endOfDay
        });
    }

    // Create a new date entry
    const newDate = {
        d: new Date(req.body.d), // Convert the string date to a Date object
        allSlots: req.body.allSlots,
        workTime: workTimes,
        nonWorkTime: nonWorkTimes
    };

    // Remove any existing date entry with the same date
    lessonTypes.date = lessonTypes.date.filter(date => date.d.getTime() !== newDate.d.getTime());
    // Add the new date to the teacher's dates array
    lessonTypes.date.push(newDate);
    console.log(level)
    await school.save();
    res.status(200).json({ message: 'Schedule updated successfully' });

}

module.exports = putOrAddTeacherDates;