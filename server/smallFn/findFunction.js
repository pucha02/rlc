const { v4: uuidv4 } = require('uuid');

async function findSchoolById(schoolId, SchoolModel) {
    const school = await SchoolModel.findOne({ id: schoolId });
    if (!school) throw new Error('School not found');
    return school;
}

// Функция для поиска учителя по его ID
function findTeacherById(school, teacherId) {
    const teacher = school.ESL.teacher.find(t => t.data.teacherId === teacherId);
    if (!teacher) throw new Error('Teacher not found');
    return teacher;
}

// Функция для поиска языка по его ID
function findLanguageById(teacher, langId) {
    const lang = teacher.lang.find(lng => lng.id === langId);
    if (!lang) throw new Error('Language not found');
    return lang;
}

// Функция для удаления элемента из массива по ID
function removeById(arr, id) {
    return arr.filter(item => item.id !== id);
}


// Функция для добавления элемента в массив в модели School
async function addToSchoolArray(SchoolModel, schoolId, arrayPath, newItem) {
    try {
        const school = await SchoolModel.findOneAndUpdate(
            { id: schoolId },
            { $push: { [arrayPath]: newItem } }, // Использование динамического пути для обновления нужного массива
            { new: true }
        );
        if (!school) {
            throw new Error('School not found');
        }
        return school;
    } catch (error) {
        throw new Error(`Error updating school: ${error.message}`);
    }
}


module.exports={findSchoolById, findTeacherById, findLanguageById, removeById, addToSchoolArray}