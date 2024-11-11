const axios = require('axios');

async function sendTelegramMessage(token, chatId, orderDetails) {
    const message = `
        Новый заказ:
        Клиент: ${orderDetails.username}
        Email: ${orderDetails.email}
        Телефон: ${orderDetails.phone}
        Учитель: ${orderDetails.teacherName}
        Язык: ${orderDetails.lang}
        Уровень: ${orderDetails.levelName}
        Время: ${orderDetails.order.map(date => date.time).join(', ')}
        Количество студентов: ${orderDetails.students.length}
        Статус оплаты: ${orderDetails.payment_status}
    `;

    try {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        });
        console.log('Сообщение отправлено в Telegram');
    } catch (error) {
        console.error('Ошибка при отправке сообщения в Telegram:', error);
    }
}

module.exports = sendTelegramMessage;