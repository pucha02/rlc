import axios from 'axios';
import { formatDateToUkrainian } from '../smallFn/convertDate'; // Предположим, что у тебя есть этот хелпер

export const orderRequest = async ({
    username,
    email,
    phone,
    order,
    time,
    lang,
    levelName,
    teacherId,
    teacherName,
    lessonTypes,
    selectedSlots,
    count,
    students,
    setMessage,
    setErrorMessage
}) => {
    try {
        // Отправляем данные заказа на сервер
        const resp = await axios.post('http://13.60.221.226/api/registerorder', {
            username,
            email,
            phone,
            order,
            time,
            lang,
            levelName,
            teacherId,
            teacherName,
            lessonTypes,
            selectedSlots,
            count,
            students,
            payment_status: 'Не оплачено'
        });

        if (resp.status === 201) {
            // Если время было успешно забронировано
            const bookedTimes = resp.data.unBookedSlots.map(slot => formatDateToUkrainian(slot));
            setMessage(`Час заброньовано: ${bookedTimes.join(', ')}`);
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            const bookedTimes = error.response.data.bookedSlots.map(slot => formatDateToUkrainian(slot));
            const unBookedTimes = error.response.data.unBookedSlots.map(slot => formatDateToUkrainian(slot));

            let errorMessage = `Ви вже маєте запис на час: ${bookedTimes.join(', ')}`;

            if (unBookedTimes.length > 0) {
                errorMessage += `\nУспішно заброньовані: ${unBookedTimes.join(', ')}`;
            }

            setErrorMessage(errorMessage);
        } else {
            setErrorMessage(error.response ? error.response.data.error : 'Произошла ошибка');
        }
    }


};

export default orderRequest;