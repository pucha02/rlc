import { formatDateToUkrainian } from "./convertDate";
import { useLocation } from "react-router-dom";

const RenderSelectedSlots = (language, level, lang_from_general_cal, teacherId, teacherName, lessonTypes, count, schoolId, price) => {

    const selectedSlots = localStorage.getItem('selectedSlots');

    if (selectedSlots) {
        try {
            const parsedSlots = JSON.parse(selectedSlots);
            if (Array.isArray(parsedSlots)) {
                return (
                    <div >
                        <ul style={{ backgroundColor: "#F4F4F4" }} className="resultList">
                            <li>
                                <div className="resultEl"><div className="resultHead">Мова</div></div>
                                <div className="resultEl"><div className="resultHead">Рівень</div></div>
                                <div className="resultEl"><div className="resultHead">Тип уроку</div></div>
                                <div className="resultEl"><div className="resultHead">Вчитель</div></div>
                                <div className="resultEl"><div className="resultHead">Дата</div></div>
                                <div className="resultEl"><div className="resultHead">Вартість</div></div>
                            </li>
                        </ul>
                        <div className="order-ul">

                            {parsedSlots.map((slot, index) => {
                                const [student, teacherId, lang, language, level, lessonType, date] = slot.split(', ');
                                const formattedDate = formatDateToUkrainian(lessonType);
                                console.log(slot)
                                return (
                                    <ul className="resultList" key={index}>
                                        <li>
                                            
                                            <div className="resultEl"><div className="resultHeadMob">Мова</div><div className="resultItem">{lang}</div></div>
                                            <div className="resultEl"><div className="resultHeadMob">Рівень</div><div className="resultItem">{language}</div></div>
                                            <div className="resultEl"><div className="resultHeadMob">Тип уроку</div><div className="resultItem">{level}</div></div>
                                            <div className="resultEl"><div className="resultHeadMob">Вчитель</div><div className="resultItem">{student}</div></div>
                                            <div className="resultEl"><div className="resultHeadMob">Дата</div><div className="resultItem">{formattedDate}</div></div>
                                            <div className="resultEl"><div className="resultHeadMob">Вартість</div><div className="resultItem">{price} грн</div></div>
                                        </li>
                                    </ul>
                                );
                            })}
                        </div>

                        <div className="totalPrice">ДО СПЛАТИ: {parsedSlots.length * price * count} грн</div>
                    </div>
                );
            } else {
                return <p>No valid slots found.</p>;
            }
        } catch (error) {
            console.error("Error parsing selectedSlots", error);
            return <p>Error retrieving slots.</p>;
        }
    } else {
        const selectedTimes = localStorage.getItem('selectedDates');


        if (selectedTimes) {
            try {

                const parsedTimes = JSON.parse(selectedTimes);
                if (Array.isArray(parsedTimes)) {
                    return (
                        <>
                            <ul style={{ backgroundColor: "#F4F4F4" }} className="resultList">
                                <li>
                                    <div className="resultEl"><div className="resultHead">Мова</div></div>
                                    <div className="resultEl"><div className="resultHead">Рівень</div></div>
                                    <div className="resultEl"><div className="resultHead">Тип уроку</div></div>
                                    <div className="resultEl"><div className="resultHead">Вчитель</div></div>
                                    <div className="resultEl"><div className="resultHead">Дата</div></div>
                                    <div className="resultEl"><div className="resultHead">Вартість</div></div>
                                </li>
                            </ul>
                            <div className="order-ul">
                                {
                                    parsedTimes.map((slot, index) => {
                                        return (
                                            <ul className="resultList" key={index}>
                                                <li>
                                                    <div className="resultEl"><div className="resultHeadMob">Мова</div><div className="resultItem">{lang_from_general_cal}</div></div>
                                                    <div className="resultEl"><div className="resultHeadMob">Рівень</div><div className="resultItem">{level}</div></div>
                                                    <div className="resultEl"><div className="resultHeadMob">Тип уроку</div><div className="resultItem">{lessonTypes}</div></div>
                                                    <div className="resultEl"><div className="resultHeadMob">Вчитель</div><div className="resultItem">{teacherName}</div></div>
                                                    <div className="resultEl"><div className="resultHeadMob">Дата</div><div className="resultItem">{slot}</div></div>
                                                    <div className="resultEl"><div className="resultHeadMob">Вартість</div><div className="resultItem">{price} грн</div></div>
                                                </li>
                                            </ul>
                                        )
                                    }
                                    )
                                }
                                
                            </div>
                            <div className="totalPrice">ДО СПЛАТИ: {parsedTimes.length * price * count} грн</div>
                        </>
                    )


                } else {
                    return <p>No valid times found.</p>;
                }
            } catch (error) {
                console.error("Error parsing selectedTimes", error);
                return <p>Error retrieving times.</p>;
            }
        }
    }

    return <p>No selected slots or times found.</p>;
};

export default RenderSelectedSlots;
