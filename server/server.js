const { parseUkrainianDate, formatDateToUkrainian } = require('./smallFn/convertDate')
const processBooking = require('./smallFn/processBookingForRegisterOrder')
const putOrAddTeacherDates = require('./smallFn/putOrAddTeacherDates')
const { findSchoolById, findTeacherById, findLanguageById, removeById, addToSchoolArray } = require('./smallFn/findFunction')
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


app.get('/api/schools/:schoolId', async (req, res) => {
    try {
        const { schoolId } = req.params

        const school = await SchoolModel.find({ id: schoolId });
        if (!school) {

            return res.status(404).json({ message: 'School not found' });
        }

        res.json(school);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/bookings/:schoolId', async (req, res) => {
    try {
        const { schoolId } = req.params
        console.log(schoolId)
        const schools = await SchoolModel.find({ id: schoolId });

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

app.get('/api/teacherOrders', async (req, res) => {
    const { teacherId, lessonTypes } = req.query
    try {
        console.log(teacherId, lessonTypes)
        const order = await Order.find({ "time.teacherId": teacherId, "time.lessonTypes": lessonTypes })

        if (!order) return res.status(404).json({ message: 'order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/schools/:schoolId/teachers/:teacherId/dateses', async (req, res) => {
    try {
        const { schoolId, teacherId } = req.params;

        await putOrAddTeacherDates(SchoolModel, schoolId, teacherId, req, res)

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.put('/api/schools/:schoolId/teachers/:teacherId/dates', async (req, res) => {
    try {
        const { schoolId, teacherId } = req.params;
        await putOrAddTeacherDates(SchoolModel, schoolId, teacherId, req, res)

    } catch (error) {
        res.status(400).json({ message: error.message });
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
    let { username, email, phone, teacherName, lang, levelName, teacherId, lessonTypes, time, count, students } = req.body;
    let selectedSlots = req.body.selectedSlots ? JSON.parse(req.body.selectedSlots) : [];
    try {
        const bookedSlots = [];
        const unBookedSlots = []
        const order = [];
        if (selectedSlots.length > 0) {
            console.log(selectedSlots)
            // Обрабатываем каждый слот из selectedSlots
            for (let slot of selectedSlots) {
                [teacherName, teacherId, lang, levelName, lessonTypes, time] = slot.split(', ');
                const parsedDate = new Date(time);
                await processBooking(username, teacherId, lang, levelName, lessonTypes, parsedDate, SchoolModel, bookedSlots, unBookedSlots, order, teacherName, count, students);

            }
        } else if (selectedSlots.length <= 0) {
            let parsedTimes = JSON.parse(time);
            for (let t of parsedTimes) {
                let parsedDate = parseUkrainianDate(t);
                await processBooking(username, teacherId, lang, levelName, lessonTypes, parsedDate, SchoolModel, bookedSlots, unBookedSlots, order, teacherName, count, students);

            }

        }
        if (bookedSlots.length > 0 || unBookedSlots.length > 0) {
            console.log('Забронированные слоты:', bookedSlots);
            console.log('Незабронированные слоты:', unBookedSlots);

            // Устанавливаем статус: 400 если есть забронированные слоты, 201 если все слоты успешно забронированы
            const status = bookedSlots.length > 0 ? 400 : 201;

            // Если есть хотя бы один незабронированный слот, создаем новый заказ
            if (unBookedSlots.length > 0) {
                const newOrder = new Order({ username, email, phone, teacherName, lang, levelName, time: order, students });
                console.log('ЗДЕЕСЬ', teacherName)
                await newOrder.save();
            }

            // Возвращаем ответ с правильным статусом и информацией о слотах
            return res.status(status).json({
                message: bookedSlots.length > 0
                    ? 'Некоторые слоты уже забронированы пользователем.'
                    : 'Бронирование подтверждено',
                bookedSlots,
                unBookedSlots
            });
        }

    } catch (error) {
        console.error('Ошибка при регистрации заказа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
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
        const school = await findSchoolById(req.params.id, SchoolModel);
        school.ESL.language.push(req.body);
        await school.save();
        res.send(school);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Добавление языка для школы
app.put('/addLanguageForSchool', async (req, res) => {
    const { id, lang, levels } = req.body;

    const newLanguage = { id: uuidv4(), lang: lang, level: levels };

    try {
        const school = await addToSchoolArray(SchoolModel, id, 'ESL.language', newLanguage);
        res.send(`Language updated for school with id ${id}`);
    } catch (error) {
        console.error('Ошибка обновления:', error);
        res.status(500).send('Error updating language');
    }
});

// Добавление учителя для школы
app.put('/addTeacherForSchool', async (req, res) => {
    const { id, teacherName, langs } = req.body;

    const newTeacher = { data: { teacherName: teacherName, teacherId: uuidv4(), lang: langs } };

    try {
        const school = await addToSchoolArray(SchoolModel, id, 'ESL.teacher', newTeacher);
        res.send(`Teacher added to school with id ${id}`);
    } catch (error) {
        console.error('Ошибка обновления:', error);
        res.status(500).send('Error adding teacher');
    }
});


app.put('/editLanguageForSchool/:schoolId/:langId', async (req, res) => {
    const { schoolId, langId } = req.params;
    const { lang, levels } = req.body;

    try {
        const school = await findSchoolById(schoolId, SchoolModel);
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
        const school = await findSchoolById(schoolId, SchoolModel);
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
        const school = await findSchoolById(schoolId, SchoolModel);
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

app.delete('/deleteClassTypeFromLevel/:schoolId', async (req, res) => {
    const { languageId, levelId, classTypeId } = req.body;
    const { schoolId } = req.params
    try {
        // Find the school using the schoolId from the request parameters
        const school = await SchoolModel.findOne({ id: schoolId });
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
        const school = await findSchoolById(schoolId, SchoolModel);
        school.ESL.teacher = school.ESL.teacher.filter(t => t.data.teacherId !== teacherId);
        await school.save();

        res.status(200).send('Teacher deleted successfully');
    } catch (err) {
        console.error(err.message);
        res.status(404).send(err.message);
    }
});

// Обновить учителя
app.put('/updateTeacher/:schoolId', async (req, res) => {
    const { schoolId } = req.params;
    const { id, teacherName, langs, teacherId } = req.body;

    try {
        const school = await SchoolModel.findOne({ id: 'school123' });
        if (!school) return res.status(404).send('School not found');

        const teacher = school.ESL.teacher.find(t => t.data.teacherId === teacherId);
        console.log(teacher)
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
        const school = await findSchoolById(schoolId, SchoolModel);
        const teacher = findTeacherById(school, teacherId);

        // Удаление языка
        teacher.lang = removeById(teacher.lang, langId);
        await school.save();

        res.status(200).json({ message: 'Language deleted', school });
    } catch (err) {
        console.error(err.message);
        res.status(404).send(err.message);
    }
});

// Удаление уровня
app.delete('/deleteLevel/:schoolId/:teacherId/:langId/:levelId', async (req, res) => {
    const { schoolId, teacherId, langId, levelId } = req.params;

    try {
        const school = await findSchoolById(schoolId, SchoolModel);
        const teacher = findTeacherById(school, teacherId);
        const lang = findLanguageById(teacher, langId);

        // Удаление уровня
        lang.level = removeById(lang.level, levelId);
        await school.save();

        res.status(200).json({ message: 'Level deleted', school });
    } catch (err) {
        console.error(err.message);
        res.status(404).send(err.message);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
