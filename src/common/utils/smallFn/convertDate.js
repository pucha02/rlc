import { format } from 'date-fns';
import { toZonedTime  } from 'date-fns-tz';
import { uk } from 'date-fns/locale';

function translateUkrainianMonthToEnglish(month) {
    const months = {
        "січня": "January",
        "лютого": "February",
        "березня": "March",
        "квітня": "April",
        "травня": "May",
        "червня": "June",
        "липня": "July",
        "серпня": "August",
        "вересня": "September",
        "жовтня": "October",
        "листопада": "November",
        "грудня": "December"
    };

    return months[month];
}

function parseUkrainianDate(dateStr) {
    const cleanedDateStr = dateStr.replace('р.', '').replace('о', '').trim();
    
    const [day, monthUkr, year, time, time2, time3] = cleanedDateStr.split(' ');
   
    const monthEng = translateUkrainianMonthToEnglish(monthUkr);

    // const formattedDateStr = `${monthEng} ${day}, ${year} ${time3}.000+00:00`;
    const formattedDateStr = `${monthEng} ${day}, ${year} ${time3}`;

    return new Date(formattedDateStr).toUTCString();
}



const formatDateToUkrainian = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getUTCDate();
    const monthNames = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  
    return `${day} ${month} ${year} р. о ${hours}:${minutes}`;
  };

export {parseUkrainianDate, formatDateToUkrainian};