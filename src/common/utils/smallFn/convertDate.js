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

    const formattedDateStr = `${monthEng} ${day}, ${year} ${time3}.000+00:00`;

    return new Date(formattedDateStr).toUTCString();
}

module.exports = parseUkrainianDate