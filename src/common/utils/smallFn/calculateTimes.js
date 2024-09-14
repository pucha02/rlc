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
        if (!wt.start) {
            console.error('Missing time in workTimes:', wt); // Log missing time
            return null; // Skip or return a default value
        }
        const adjustedTime = new Date(wt.start.getTime() - 3 * 60 * 60 * 1000);
        return { ...wt, time: adjustedTime };
    }).filter(wt => wt !== null) // Filter out any null values
        .sort((a, b) => new Date(a.time) - new Date(b.time));

    if (workTimes.length === 0) {
        console.error('No valid work times available');
        return []; // Return an empty array if there are no valid work times
    }

    const nonWorkTimes = [];

    const startOfDay = new Date(new Date(workTimes[0].time).setHours(0, 0, 0, 0));
    console.log(startOfDay)
    const firstWorkTime = new Date(workTimes[0].time);

    if (startOfDay < firstWorkTime) {
        nonWorkTimes.push({
            start: startOfDay,
            end: new Date(firstWorkTime.getTime() - 60 * 1000) // 1 minute before work starts
        });
    }

    for (let i = 0; i < workTimes.length; i++) {
        const currentStart = new Date(workTimes[i].time);

        if (workTimes[i].slots === 0) {
            const nextStart = (i < workTimes.length - 1) ? new Date(workTimes[i + 1].time) : new Date(currentStart.setHours(23, 59, 0, 0));
            nonWorkTimes.push({
                start: currentStart,
                end: new Date(nextStart.getTime() - 60 * 1000)
            });
        } else {
            if (i > 0 && workTimes[i - 1].slots !== 0) {
                const previousEnd = new Date(workTimes[i - 1].time);
                if (previousEnd < currentStart) {
                    nonWorkTimes.push({
                        start: new Date(previousEnd.getTime() + 60 * 60 * 1000 - 60 * 1000 * 59), // 1 minute after 1 hour
                        end: new Date(currentStart.getTime() - 60 * 1000)  // 1 minute before the current work interval
                    });
                }
            }
        }
    }

    const lastWorkTime = new Date(workTimes[workTimes.length - 1].time);
    const endOfDay = new Date(lastWorkTime);
    endOfDay.setHours(23, 59, 0, 0);

    if (lastWorkTime < endOfDay) {
        nonWorkTimes.push({
            start: new Date(lastWorkTime.getTime() + 60 * 60 * 1000 - 60 * 1000 * 59),
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
    console.log(uniqueNonWorkTime)
    return uniqueNonWorkTime;
};


const mergeWorkAndNonWorkTimes = (data, count) => {

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
        const allWorkTimes = [];
        const nonTimes = [];
    
        // Check if all work times have slots < 4
        let allSlotsLessThanFour = booking.workTime.every(wt => wt.slots < count);
    
        // Flag to ensure `booking.d` is pushed only once
        let bookingDAdded = false;
    
        booking.workTime.forEach((wt) => {
            if (wt.slots >= count && wt.time) {
                allWorkTimes.push(wt.time);
            } else if (booking.allSlots <= 0 && wt.time) {
                const currentDate = wt.time.split('T')[0] + 'T00:00:00.000Z';
                allWorkTimes.push(currentDate);
            } else if (allSlotsLessThanFour && !bookingDAdded) {
                allWorkTimes.push(booking.d);
                booking.allSlots = 0
                bookingDAdded = true; // Set the flag to true after adding booking.d
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

export { calculateCombinedWorkTime, calculateNonWorkTime, mergeWorkAndNonWorkTimes }