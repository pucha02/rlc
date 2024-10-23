const mongoose = require('mongoose');
const SchoolModel = require('./SchoolModel'); // Убедитесь, что путь к модели правильный

// Функция для добавления школы
const addSchool = async () => {
    // Подключение к MongoDB
    try {
        await mongoose.connect('mongodb+srv://seksikoleg5:se4HivNRYKdydnzc@cluster0.pdc2rrh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Создание нового документа школы
        const newSchool = new SchoolModel({
            ESL: {
                id: 'school123',
                schoolName: 'Language School',
                language: [
                    {
                        id: 'lang1',
                        lang: 'English',
                        level: [
                            {
                                id: 'level1',
                                levelName: 'Beginner',
                                lessonTypes: [
                                    {
                                        typeName: 'Індивідуальні',
                                        date: [

                                        ]
                                    },
                                    {
                                        typeName: 'Парні',
                                        date: [

                                        ]
                                    },
                                    {
                                        typeName: 'Групові',
                                        date: [

                                        ]
                                    }
                                ]
                            },
                            {
                                id: 'level2',
                                levelName: 'Intermediate',
                                lessonTypes: [
                                    {
                                        typeName: 'Індивідуальні',
                                        date: [

                                        ]
                                    },
                                    {
                                        typeName: 'Парні',
                                        date: [

                                        ]
                                    },
                                    {
                                        typeName: 'Групові',
                                        date: [

                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'lang2',
                        lang: 'Spanish',
                        level: [
                            {
                                id: 'level3',
                                levelName: 'Advanced',
                                lessonTypes: [
                                    {
                                        typeName: 'Індивідуальні',
                                        date: [

                                        ]
                                    },
                                    {
                                        typeName: 'Парні',
                                        date: [

                                        ]
                                    },
                                    {
                                        typeName: 'Групові',
                                        date: [

                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                teacher: [
                    {
                        data: {
                            teacherId: 'teacher1',
                            teacherName: 'John Doe',
                            lang: [
                                {
                                    id: 'lang1',
                                    lang: 'English',
                                    level: [
                                        {
                                            id: 'level1',
                                            levelName: 'Beginner',
                                            lessonTypes: [
                                                {
                                                    typeName: 'Парні',
                                                    date: [
                                                        {
                                                            d: new Date(),
                                                            allSlots: 5,
                                                            workTime: [
                                                                { time: new Date(), slots: 3, bookings: [] }
                                                            ],
                                                            nonWorkTime: [
                                                                { start: new Date(), end: new Date() }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    typeName: 'Групові',
                                                    date: [
                                                        {
                                                            d: new Date(),
                                                            allSlots: 5,
                                                            workTime: [
                                                                { time: new Date(), slots: 3, bookings: [] }
                                                            ],
                                                            nonWorkTime: [
                                                                { start: new Date(), end: new Date() }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        data: {
                            teacherId: 'teacher2',
                            teacherName: 'Jane Smith',
                            lang: [
                                {
                                    id: 'lang2',
                                    lang: 'Spanish',
                                    level: [
                                        {
                                            id: 'level3',
                                            levelName: 'Advanced',
                                            lessonTypes: [
                                                {
                                                    typeName: 'Групові',
                                                    date: [
                                                        {
                                                            d: new Date(),
                                                            allSlots: 8,
                                                            workTime: [
                                                                { time: new Date(), slots: 4, bookings: [] }
                                                            ],
                                                            nonWorkTime: [
                                                                { start: new Date(), end: new Date() }
                                                            ]
                                                        }
                                                    ]
                                                }
                                                ,
                                                {
                                                    typeName: 'Індивідуальні',
                                                    date: [
                                                        {
                                                            d: new Date(),
                                                            allSlots: 5,
                                                            workTime: [
                                                                { time: new Date(), slots: 3, bookings: [] }
                                                            ],
                                                            nonWorkTime: [
                                                                { start: new Date(), end: new Date() }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        });

        // Сохранение нового документа в коллекции
        const savedSchool = await newSchool.save();
        console.log('School added successfully:', savedSchool);
    } catch (error) {
        console.error('Error adding school:', error);
    } finally {
        // Закрыть соединение с базой данных
        await mongoose.connection.close();
    }
};

// Вызов функции добавления школы
addSchool();
