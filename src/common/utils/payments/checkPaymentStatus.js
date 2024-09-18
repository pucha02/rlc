import axios from 'axios';
import { formatDateToUkrainian } from '../smallFn/convertDate'; // Предположим, что у тебя есть этот хелпер

export const checkPaymentStatus = async ({
  orderId,
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
  setPaymentStatus,
  setMessage,
  setErrorMessage
}) => {
  try {
    const response = await axios.get('http://localhost:5000/api/checkpaymentstatus', {
      params: { orderId }
    });

    if (response.data === 'success') {
      try {
        setPaymentStatus('Оплачено');
        setMessage('Оплата успешно подтверждена.');

        // Отправляем данные заказа на сервер
        const resp = await axios.post('http://localhost:5000/api/registerorder', {
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
          payment_status: 'Оплачено'
        });

        if (resp.status === 201) {
          // Если время было успешно забронировано
          const bookedTimes = resp.data.unBookedSlots.map(slot => formatDateToUkrainian(slot));
          setMessage(`Час забронирован: ${bookedTimes.join(', ')}`);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const bookedTimes = error.response.data.bookedSlots.map(slot => formatDateToUkrainian(slot));
          const unBookedTimes = error.response.data.unBookedSlots.map(slot => formatDateToUkrainian(slot));

          let errorMessage = `Ви вже маєте запис на час: ${bookedTimes.join(', ')}`;

          if (unBookedTimes.length > 0) {
            errorMessage += `\nУспешно забронированы: ${unBookedTimes.join(', ')}`;
          }

          setErrorMessage(errorMessage);
        } else {
          setErrorMessage(error.response ? error.response.data.error : 'Произошла ошибка');
        }
      }
    } else {
      setPaymentStatus('Не оплачено');
      setErrorMessage('Оплата не завершена.');
    }
  } catch (error) {
    console.error('Ошибка при проверке статуса оплаты', error);
    setErrorMessage('Произошла ошибка при проверке оплаты.');
  }
};

export default checkPaymentStatus;