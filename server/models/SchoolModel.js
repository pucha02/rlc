const mongoose = require('mongoose');
const { Schema } = mongoose;

// Time Schema
const TimeSchema = new Schema({
    id: { type: Number }, // Adjusted to Number
    timeOclock: { type: String },
    count: { type: Number }, // Adjusted to Number
});

// ESLDate Schema
const ESLDateSchema = new Schema({
    id: { type: Number }, // Adjusted to Number
    day: { type: String },
    time: [TimeSchema],
});

const NonWorkTimeSchema = new Schema({
    start: { type: Date },
    end: { type: Date },
});

const WorkTimeSchema = new Schema({
    time: { type: Date },
    slots: { type: Number },
    bookings: { type: Array }
});
// Level Schema

const LevelSchema = new Schema({
    id: { type: String },
    levelName: { type: String },
    lessonTypes: [{
        id: { type: String },
        typeName: { type: String },
        price: { type: String },
        date: [{
            d: { type: Date },
            allSlots: { type: Number },
            workTime: [WorkTimeSchema],
            nonWorkTime: [NonWorkTimeSchema],
        }],
    }],
});

// ESLLanguage Schema
const ESLLanguageSchema = new Schema({
    id: { type: String }, // Adjusted to Number
    lang: { type: String },
    level: [LevelSchema],
});


// TeacherData Schema
const TeacherDataSchema = new Schema({
    lang: [ESLLanguageSchema],
    teacherId: { type: String },
    teacherImg: { type: String },
    teacherName: { type: String },
    description: { type: String },
    reviews: [
        {
            username: { type: String },
            rating: { type: String },
            text: { type: String }
        }
    ]
});

// Teacher Schema
const TeacherSchema = new Schema({
    data: TeacherDataSchema,
});

// ESLSchema
const ESLSchema = new Schema({
    language: [ESLLanguageSchema],
    date: [ESLDateSchema],
    teacher: [TeacherSchema],
    id: { type: String },
    schoolName: { type: String },
});

// School Schema
const SchoolSchema = new Schema({
    ESL: ESLSchema,
    id: { type: String },
});

const SchoolModel = mongoose.model('Schools', SchoolSchema);

module.exports = SchoolModel;
