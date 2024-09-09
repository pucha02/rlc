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
                language: [
                    {
                        id: 1,
                        lang: "English",
                        level: [
                            {
                                id: 1,
                                levelName: "Beginner",
                               
                            },
                            {
                                id: 2,
                                levelName: "Intermediate"
                            }
                        ]
                    },
                    {
                        id: 2,
                        lang: "Spanish",
                        level: [
                            {
                                id: 1,
                                levelName: "Beginner",
                            },
                            {
                                id: 2,
                                levelName: "Intermediate"
                            }
                        ]
                    }
                ],
                teacher: [
                    {
                        data: {
                            lang: [
                                {
                                    id: 1,
                                    lang: "English",
                                    level: [
                                        {
                                            id: 1,
                                            levelName: "Beginner",
                                            date: [
                                                {
                                                    d: new Date("2024-09-03"),
                                                    allSlots: 10,
                                                    workTime: [
                                                       
                                                    ],
                                                    nonWorkTime: [
                                                       
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id: 1,
                                    lang: "Spanish",
                                    level: [
                                        {
                                            id: 1,
                                            levelName: "Beginner",
                                            date: [
                                                {
                                                    d: new Date("2024-09-03"),
                                                    allSlots: 10,
                                                    workTime: [
                                                        
                                                    ],
                                                    nonWorkTime: [
                                                        
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            id: 2,
                                            levelName: "Intermediate",
                                            date: [
                                                {
                                                    d: new Date("2024-09-03"),
                                                    allSlots: 10,
                                                    workTime: [
                                                        
                                                    ],
                                                    nonWorkTime: [
                                                        
                                                    ]
                                                }
                                            ]
                                        }

                                    ]
                                }
                            ],
                            teacherId: "T001",
                            teacherName: "John Doe"
                        }
                    },
                    {
                        data: {
                            lang: [
                                {
                                    id: 2,
                                    lang: "Spanish",
                                    level: [
                                        {
                                            id: 1,
                                            levelName: "Beginner",
                                            date: [
                                                {
                                                    d: new Date("2024-09-05"),
                                                    allSlots: 7,
                                                    workTime: [
                                                        
                                                    ],
                                                    nonWorkTime: [
                                                       
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            teacherId: "T002",
                            teacherName: "Jane Smith"
                        }
                    }
                ],
                
                schoolName: "Language School"
            },
            id: "bbd935fb-a9bd-4412-810f-8ecd7189d5e7"
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
