const parseUkrainianDate = require('./smallFn/convertDate')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User, Order } = require('./models/Models');
const SchoolModel = require('./models/SchoolModel')


const secret = 'jwt_secret';
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://seksikoleg5:se4HivNRYKdydnzc@cluster0.pdc2rrh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

const bookingSchema = new mongoose.Schema({
    d: Date,
    allNr: Number,
    workTime: [
        {
            time: Date,
            nr: Number
        }
    ],
    nonWorkTime: [
        {
            start: Date,
            end: Date
        }
    ]
});


const Booking = mongoose.model('Booking', bookingSchema);


app.get('/api/schools', async (req, res) => {
    try {
        const school = await SchoolModel.find({ id: 'school123' });
        if (!school) {

            return res.status(404).json({ message: 'School not found' });
        }

        res.json(school);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/bookings', async (req, res) => {
    try {

        const schools = await SchoolModel.find({ id: 'school123' });

        const allTeachers = schools.map(school => school.ESL.teacher).flat();

        res.json(allTeachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



app.get('/api/bookings/:id', async (req, res) => {
    try {
        const booking = await SchoolModel.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/schools/:schoolId/teachers/:teacherId/dateses', async (req, res) => {
    try {
        const { schoolId, teacherId } = req.params;

        // Find the school by ID and the specific teacher within that school
        const school = await SchoolModel.findOne({ "id": schoolId, "ESL.teacher.data.teacherId": teacherId });
        if (!school) return res.status(404).json({ message: 'School or teacher not found' });

        const teacher = school.ESL.teacher.find(t => t.data.teacherId === teacherId);

        // Find the specific language and level
        const lang = teacher.data.lang.find(l => l.lang === req.body.lang);
        if (!lang) return res.status(404).json({ message: 'Language not found' });

        const level = lang.level.find(lv => lv.levelName === req.body.levelName);
        if (!level) return res.status(404).json({ message: 'Level not found' });

        const lessonTypes = level.lessonTypes.find(lv => lv.typeName === req.body.lessonTypes);
        if (!lessonTypes) return res.status(404).json({ message: 'Level not found' });
        // Process and adjust work times
        const workTimes = req.body.workTime.map(wt => {
            const adjustedTime = new Date(new Date(wt.time).getTime()); // Adjust for your timezone
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

        // Create a new date entry
        const newDate = {
            d: req.body.d,
            allSlots: req.body.allSlots,
            workTime: workTimes,
            nonWorkTime: nonWorkTimes
        };

        // Add the new date to the level's dates array
        lessonTypes.date.push(newDate);

        // Save the updated school document
        await school.save();
        res.status(200).json({ message: 'Schedule updated successfully' });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.put('/api/schools/:schoolId/teachers/:teacherId/dates', async (req, res) => {
    try {
        const { schoolId, teacherId } = req.params;

        // Find the school and teacher
        const school = await SchoolModel.findOne({ "id": schoolId, "ESL.teacher.data.teacherId": teacherId });
        if (!school) return res.status(404).json({ message: 'School or teacher not found' });


        const teacher = school.ESL.teacher.find(t => t.data.teacherId === teacherId);

        const lang = teacher.data.lang.find(l => l.lang === req.body.lang);
        if (!lang) return res.status(404).json({ message: 'Language not found' });

        const level = lang.level.find(lv => lv.levelName === req.body.levelName.levelName);
        if (!level) return res.status(404).json({ message: 'Level not found' });

        const lessonTypes = level.lessonTypes.find(lv => lv.typeName === req.body.lessonTypes);
        if (!lessonTypes) return res.status(404).json({ message: 'Level not found' });


        const workTimes = req.body.workTime.map(wt => {
            const adjustedTime = new Date(new Date(wt.time).getTime()); // Adjust for your timezone
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
                        start: new Date(previousEnd.getTime() + 60 * 60 * 1000 - 60 * 1000 * 31),
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
                            start: new Date(previousEnd.getTime() + 60 * 60 * 1000 - 60 * 1000 * 31),
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
                start: new Date(lastWorkTime.getTime() + 60 * 60 * 1000 - 60 * 1000 * 31),
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
        console.log(newDate)
        // Remove any existing date entry with the same date
        lessonTypes.date = lessonTypes.date.filter(date => date.d.getTime() !== newDate.d.getTime());
        // Add the new date to the teacher's dates array
        lessonTypes.date.push(newDate);

        await school.save();
        res.status(200).json({ message: 'Schedule updated successfully' });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/register', async (req, res) => {
    const { username, email, phone, password } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, phone, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/registerorder', async (req, res) => {
    const { username, email, phone, time, lang, levelName, teacherId, teacherName, lessonTypes } = req.body;

    try {
        // Save the new order
        const parsedTimes = JSON.parse(time);
        const bookedSlots = [];
        for (const t of parsedTimes) {
            // Parse the date from the provided time
            const parsedDate = parseUkrainianDate(t);

            // Find the relevant school and teacher with workTime matching the parsedDate, lang, and levelName
            const school = await SchoolModel.findOne({
                "ESL.teacher.data.teacherId": teacherId,
                "ESL.teacher.data.lang.lang": lang,
                "ESL.teacher.data.lang.level.levelName": levelName,
                "ESL.teacher.data.lang.level.lessonTypes.typeName": lessonTypes,
                "ESL.teacher.data.lang.level.lessonTypes.date.workTime.time": parsedDate,
            });

            if (school) {
                const teacher = school.ESL.teacher.find(teacher =>
                    teacher.data.teacherId === teacherId &&
                    teacher.data.lang.some(langItem =>
                        langItem.lang === lang &&
                        langItem.level.some(levelItem =>
                            levelItem.levelName === levelName &&
                            levelItem.lessonTypes.some(typeItem =>
                                typeItem.typeName === lessonTypes &&  // Check for typeName
                                typeItem.date.some(date =>
                                    date.workTime.some(workTime => workTime.time.getTime() === new Date(parsedDate).getTime())
                                )
                            )
                        )
                    )
                );

                if (!teacher) {
                    console.log(`No teacher ${teacherId} found with work time ${parsedDate}, lang ${lang}, level ${levelName}, and type ${lessonTypes}`);
                    continue;
                }

                const dateObj = teacher.data.lang
                    .find(langItem => langItem.lang === lang)
                    .level
                    .find(levelItem => levelItem.levelName === levelName)
                    .lessonTypes
                    .find(typeItem => typeItem.typeName === lessonTypes)  // Find the correct lesson type
                    .date
                    .find(date =>
                        date.workTime.some(workTime => workTime.time.getTime() === new Date(parsedDate).getTime())
                    );

                if (!dateObj) {
                    console.log(`No date object found for time ${parsedDate}`);
                    continue;
                }

                // Decrement the slot count for the specific workTime
                const workTimeSlot = dateObj.workTime.find(workTime => workTime.time.getTime() === new Date(parsedDate).getTime());

                // Если слот уже был забронирован пользователем
                if (workTimeSlot.bookings.some(booking => booking.userName === username)) {
                    bookedSlots.push(workTimeSlot.time); // Добавляем забронированный слот в массив
                } else {

                    workTimeSlot.bookings.push({ userName: username });
                    workTimeSlot.slots = (workTimeSlot.slots || 0) - 1;
                }


                console.log(dateObj.workTime)
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
                                start: new Date(previousEnd.getTime() + 60 * 60 * 1000 - 60 * 1000 * 31),
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
                                    start: new Date(previousEnd.getTime() + 60 * 60 * 1000 - 60 * 1000 * 31),
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
                        start: new Date(lastWorkTime.getTime() + 60 * 60 * 1000 - 60 * 1000 * 31),
                        end: endOfDay,
                    });
                }

                // Save non-working intervals to the date object
                dateObj.nonWorkTime = nonWorkTimes;

                // Save the updated school data
                await school.save();
                console.log(`Updated booking for time ${parsedDate}, lang ${lang}, and level ${levelName}: Decremented slots by 1 and recalculated all non-work times`);

            } else {
                console.log(`No booking found for time ${parsedDate}, lang ${lang}, and level ${levelName}`);
            }
        }
        if (bookedSlots.length > 0) {
            return res.status(400).json({
                message: 'User has already booked these slots.',
                bookedSlots // Возвращаем массив всех забронированных слотов
            });
        } else if(bookedSlots.length == 0) {
            const newOrder = new Order({ username, email, phone, teacherName, lang, levelName, time });
            await newOrder.save();
        }
        res.status(201).json({ message: 'Order confirmed successfully' });
    } catch (error) {
        console.error('Error registering order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true });

        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out successfully' });
});

const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

app.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const orders = await Order.find({ email: user.email });

        console.log('User:', user);
        console.log('Orders:', orders);

        res.json({ user, orders });
    } catch (error) {
        console.error('Error fetching user data or orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/schools', async (req, res) => {
    try {
        const newSchool = new SchoolModel({
            ESL: {
                ...req.body.ESL,
                id: uuidv4()  // Generate a unique ID here
            },
            id: uuidv4()   // If the whole school needs an ID
        });
        await newSchool.save();
        res.status(201).send(newSchool);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Edit school by ID
app.put('/schools/:id', async (req, res) => {
    try {
        const updatedSchool = await SchoolModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedSchool);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete school
app.delete('/schools/:id', async (req, res) => {
    try {
        const school = await SchoolModel.findByIdAndDelete(req.params.id);
        res.send(school);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/schools/:id/languages', async (req, res) => {
    try {

        const school = await SchoolModel.findById(req.params.id);
        console.log(school)
        school.ESL.language.push(req.body);
        await school.save();
        res.send(school);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.put('/addLanguageForSchool', async (req, res) => {
    const { id, lang, levels } = req.body;

    console.log(levels)

    try {
        const school = await SchoolModel.findOneAndUpdate(
            { id: id },
            { $push: { 'ESL.language': { id: uuidv4(), lang: lang, level: levels } } },
            { new: true }
        );

        if (!school) {
            return res.status(404).send('School not found');
        }

        res.send(`Language updated for school with id ${id}`);
    } catch (error) {
        console.error('Ошибка обновления:', error);
        res.status(500).send('Error updating language');
    }
});

app.put('/addTeacherForSchool', async (req, res) => {
    const { id, teacherName, langs } = req.body;

    console.log(teacherName)

    try {
        const school = await SchoolModel.findOneAndUpdate(
            { id: id },
            { $push: { 'ESL.teacher': { data: { teacherName: teacherName, teacherId: uuidv4(), lang: langs } } } },
            { new: true }
        );

        if (!school) {
            return res.status(404).send('School not found');
        }

        res.send(`Language updated for school with id ${id}`);
    } catch (error) {
        console.error('Ошибка обновления:', error);
        res.status(500).send('Error updating language');
    }
});

app.put('/editLanguageForSchool/:schoolId/:langId', async (req, res) => {
    const { schoolId, langId } = req.params;
    const { lang, levels } = req.body;

    try {
        const school = await SchoolModel.findOne({ id: schoolId });
        if (!school) return res.status(404).json({ message: 'School not found' });

        const language = school.ESL.language.find(lang => lang.id === langId);
        if (!language) return res.status(404).json({ message: 'Language not found' });

        language.lang = lang;
        language.level = levels;
        await school.save();

        res.json(school);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Маршрут для удаления языка
app.delete('/deleteLanguageFromSchool/:schoolId/:langId', async (req, res) => {
    const { schoolId, langId } = req.params;

    try {
        const school = await SchoolModel.findOne({ id: schoolId });
        if (!school) return res.status(404).json({ message: 'School not found' });

        school.ESL.language = school.ESL.language.filter((lang) => lang.id !== langId);
        await school.save();

        res.json(school);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Маршрут для удаления уровня из языка
app.delete('/deleteLevelFromLanguage/:schoolId/:langId/:levelId', async (req, res) => {
    const { schoolId, langId, levelId } = req.params;

    try {
        const school = await SchoolModel.findOne({ id: 'school123' });
        
        if (!school) return res.status(404).json({ message: 'School not found' });

        const language = school.ESL.language.find(lang => lang.id === langId);
        if (!language) return res.status(404).json({ message: 'Language not found' });

        language.level = language.level.filter((lvl) => lvl.id !== levelId);
        console.log(language.level)
        await school.save();

        res.json(school);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/deleteClassTypeFromLevel', async (req, res) => {
    const { languageId, levelId, classTypeId } = req.body;
    
    try {
        // Find the school using the schoolId from the request parameters
        const school = await SchoolModel.findOne({ id: 'school123' });
        console.log(school)
        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }
        
        let languageFound = false;
        // Iterate through the languages to find the correct level
        school.ESL.language.forEach(lang => {
            const level = lang.level.find(lvl => lvl.id === levelId); // Corrected lang to lvl
            if (level) {
                languageFound = true;
                // Filter out the class type from the lessonTypes array
                level.lessonTypes = level.lessonTypes.filter(ct => ct.id !== classTypeId);
            }
        });

        if (!languageFound) {
            return res.status(404).json({ error: 'Level or Language not found' });
        }

        // Save the school document after making changes
        await school.save();

        return res.status(200).json({ message: 'Class type deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while deleting class type' });
    }
});


app.delete('/deleteTeacherFromSchool/:schoolId/:teacherId', async (req, res) => {
    const { schoolId, teacherId } = req.params;

    try {
        const school = await SchoolModel.findOne({ id: 'school123' });
        if (!school) return res.status(404).send('School not found');

        school.ESL.teacher = school.ESL.teacher.filter(t => t.data.teacherId !== teacherId);
        await school.save();

        res.send('Teacher deleted successfully');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Обновить учителя
app.put('/updateTeacher/:schoolId', async (req, res) => {
    const { schoolId } = req.params;
    const { id, teacherName, langs } = req.body;

    try {
        const school = await SchoolModel.findOne({ id: 'school123' });
        if (!school) return res.status(404).send('School not found');

        const teacher = school.ESL.teacher.find(t => t.data.teacherId === id);
        if (teacher) {
            teacher.data.teacherName = teacherName;
            teacher.data.lang = langs;
        }

        await school.save();

        res.send('Teacher updated successfully');
    } catch (error) {
        res.status(500).send('Server error');
    }
});


app.delete('/deleteLang/:schoolId/:teacherId/:langId', async (req, res) => {
    const { schoolId, teacherId, langId } = req.params;

    try {
        const school = await SchoolModel.findOne({ id: 'school123' });
        if (!school) return res.status(404).send('School not found');

        const teacher = school.ESL.teacher.find(t => t.data.teacherId === teacherId);
        if (!teacher) return res.status(404).send('Teacher not found');

        teacher.lang = teacher.lang.filter(lng => lng.id !== langId);
        await school.save();

        res.status(200).json({ message: 'Language deleted', school });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Delete specific level by level ID
app.delete('/deleteLevel/:schoolId/:teacherId/:langId/:levelId', async (req, res) => {
    const { schoolId, teacherId, langId, levelId } = req.params;

    try {
        const school = await SchoolModel.findOne({ id: 'school123' });
        if (!school) return res.status(404).send('School not found');

        const teacher = school.ESL.teacher.find(t => t.data.teacherId === teacherId);
        if (!teacher) return res.status(404).send('Teacher not found');

        const lang = teacher.lang.find(lng => lng.id === langId);
        if (!lang) return res.status(404).send('Language not found');

        lang.level = lang.level.filter(lvl => lvl.id !== levelId);
        await school.save();

        res.status(200).json({ message: 'Level deleted', school });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
