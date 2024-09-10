const calculateCombinedWorkTime = (workTimes) => {

    const sortedTimes = workTimes.map(time => new Date(time)).sort((a, b) => a - b);

    const combined = [];
    let currentInterval = null;

    sortedTimes.forEach(time => {
        if (!currentInterval) {
            currentInterval = [time, time]; // Start a new interval
        } else {
            // If the current time is within or adjacent to the current interval, extend it
            if (time <= currentInterval[1]) {
                currentInterval[1] = new Date(Math.max(currentInterval[1], time)); // Extend the end time
            } else {
                // Otherwise, push the current interval to the combined list and start a new interval
                combined.push(currentInterval);
                currentInterval = [time, time];
            }
        }
    });

    if (currentInterval) {
        combined.push(currentInterval);

    }

    return combined.map(([start]) => ({ start }));
};

const calculateNonWorkTime = (nonWorkTime, workTimes) => {

    workTimes = workTimes.map(wt => {
        const adjustedTime = new Date(wt.start.getTime() - 3 * 60 * 60 * 1000);
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
            const nextStart = (i < workTimes.length - 1) ? new Date(workTimes[i + 1].time) : new Date(currentStart.setUTCHours(23, 59, 0, 0));
            nonWorkTimes.push({
                start: currentStart,
                end: new Date(nextStart.getTime() - 60 * 1000)
            });
        } else {
            if (i > 0 && workTimes[i - 1].slots !== 0) {
                const previousEnd = new Date(workTimes[i - 1].time);
                if (previousEnd < currentStart) {
                    nonWorkTimes.push({
                        start: new Date(previousEnd.getTime() + 60 * 60 * 1000 - 60 * 1000 * 31),  // 1 minute after 1 hour
                        end: new Date(currentStart.getTime() - 60 * 1000)  // 1 minute before the current work interval
                    });
                }
            }
        }
    }

    // Non-working time from the end of the last work time to the end of the day
    const lastWorkTime = new Date(workTimes[workTimes.length - 1].time);
    const endOfDay = new Date(lastWorkTime);
    endOfDay.setUTCHours(23, 59, 0, 0);

    if (lastWorkTime < endOfDay) {
        nonWorkTimes.push({
            start: new Date(lastWorkTime.getTime() + 60 * 60 * 1000 - 60 * 1000 * 31),
            end: endOfDay
        });
    }

    const mergedNonWorkTime = [...nonWorkTimes];
    const uniqueNonWorkTime = Array.from(
        new Set(mergedNonWorkTime.map(nwt => `${nwt.start}-${nwt.end}`))
    ).map(str => {
        const [start, end] = str.split('-');
        return { start: new Date(start), end: new Date(end) };
    });

    return uniqueNonWorkTime;
};

const mergeWorkAndNonWorkTimes = (data) => {

    const grouped = data.reduce((acc, booking) => {
      const dateKey = booking.d;

      if (!acc[dateKey]) {
        acc[dateKey] = {
          ...booking,
          workTime: [...booking.workTime],
          nonWorkTime: [...booking.nonWorkTime],
          allSlots: booking.allSlots || 0,
        };
      } else {

        acc[dateKey].workTime = [...acc[dateKey].workTime, ...booking.workTime];
        acc[dateKey].nonWorkTime = [...new Set([...acc[dateKey].nonWorkTime, ...booking.nonWorkTime])]; // Unique nonWorkTime
        acc[dateKey].allSlots += booking.allSlots || 0;
      }
      return acc;
    }, {});
    // Recalculate non-working intervals
    return Object.values(grouped).map((booking) => {
      const allWorkTimes = []
      booking.workTime.forEach((wt) => {
        console.log('workTime:', booking);

        if (wt.slots > 0) { // Проверка наличия wt.time
          allWorkTimes.push(wt.time);
        } else if (booking.allSlots <= 0) {
          const currentDate = wt.time.split('T')[0] + 'T00:00:00.000Z';
          allWorkTimes.push(currentDate);
          console.log(currentDate)
        }
      });

      const combinedWorkTime = calculateCombinedWorkTime(allWorkTimes);
      const nonWorkTime = calculateNonWorkTime(booking.nonWorkTime, combinedWorkTime);
      return {
        ...booking,
        workTime: combinedWorkTime,
        nonWorkTime,
        allSlots: booking.allSlots,
      };
    });
  };

export {calculateCombinedWorkTime, calculateNonWorkTime, mergeWorkAndNonWorkTimes}