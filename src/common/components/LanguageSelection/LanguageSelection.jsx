import React from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../../../services/images/Group12.svg'
import Footer from '../Footer/Footer';
import '../../../pages/chooseLanguage/language.css'

const LanguageSelection = ({ title, data, type, language = null, level = null, schoolId = null, lessonTypes = null, count = null, allTeachers = null, price = null, logo = null, name = null }) => {
    const filteredData = data?.filter((item) => {
        if (count >= 3) {
            return item.typeName === 'Групові';
        } else if (count === 2) {
            return item.typeName === 'Парні' || item.typeName === 'Групові';
        } else if (count === 1) {
            return item.typeName === 'Парні' || item.typeName === 'Індивідуальні' || item.typeName === 'Групові';
        }
        return true;
    });

    return (
        <>
            <div className="main">
                <div className="container">
                    <div className='logo'>
                        <div className='logo-items'>
                            <Link to={`/${schoolId}`}><img src={logo} alt="Logo" /></Link>
                            <div className='logo-name'>Мовна школа <span>{name}</span></div>
                        </div>
                    </div>
                    <div className='container-items-block'>
                        <h1 className="languages-title">{title}</h1>
                        {filteredData && filteredData.length > 0 ? (
                            <div className="school-data">
                                {filteredData.map((item, index) => (
                                    <Link
                                        replace
                                        key={index}
                                        className="language-link"
                                        to={type === 'language' ? `/course` : type === 'level' ? `/count` : type === 'type' ? `/priority` : type === 'count' ? `/lessoTypes` : type === 'priority' ? `/teacher` : ''}
                                        state={
                                            type === 'language' ? { level: item.level, language: item.lang, schoolId: schoolId, logo: logo, name: name }
                                                : type === 'level' ? { level: item.levelName, language: language, lessonTypes: item.lessonTypes, schoolId: schoolId, logo: logo, name: name }
                                                    : type === 'type' ? { level: level, language: language, lessonTypes: item.typeName, schoolId: schoolId, count: count, price: item.price, logo: logo, name: name }
                                                        : type === 'count' ? { level: level, language: language, schoolId: schoolId, logo: logo, name: name } : ''
                                        }
                                    >
                                        <div className="language-item">
                                            <p>
                                                {type === 'language' ? item.lang
                                                    : type === 'level' ? item.levelName
                                                        : type === 'type' ? item.typeName : ''}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : count >= 3 ? (
                            <p>Немає доступних групових занять</p>
                        ) : lessonTypes && !count ? (
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "normal" }} className="school-data">
                                <div className='count-elements'>
                                    <Link to={`/lessoTypes`} state={{ level: level, language: language, schoolId: schoolId, count: 1, lessonTypes: lessonTypes, logo: logo, name: name }} className="language-link">
                                        <div className="language-item count">
                                            <p>1</p>
                                        </div>
                                    </Link>
                                    <Link to={`/lessoTypes`} state={{ level: level, language: language, schoolId: schoolId, count: 2, lessonTypes: lessonTypes, logo: logo, name: name }} className="language-link">
                                        <div className="language-item count">
                                            <p>2</p>
                                        </div>
                                    </Link>
                                    <Link to={`/lessoTypes`} state={{ level: level, language: language, schoolId: schoolId, count: 3, lessonTypes: lessonTypes, logo: logo, name: name }} className="language-link">
                                        <div className="language-item count">
                                            <p>3</p>
                                        </div>
                                    </Link>
                                    <Link to={`/lessoTypes`} state={{ level: level, language: language, schoolId: schoolId, count: 4, lessonTypes: lessonTypes, logo: logo, name: name }} className="language-link">
                                        <div className="language-item count">
                                            <p>4</p>
                                        </div>
                                    </Link>
                                    <Link to={`/lessoTypes`} state={{ level: level, language: language, schoolId: schoolId, count: 5, lessonTypes: lessonTypes, logo: logo, name: name }} className="language-link">
                                        <div className="language-item count">
                                            <p>5</p>
                                        </div>
                                    </Link>
                                    <Link to={`/lessoTypes`} state={{ level: level, language: language, schoolId: schoolId, count: 6, lessonTypes: lessonTypes, logo: logo, name: name }} className="language-link">
                                        <div className="language-item count">
                                            <p>6</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ) : lessonTypes && count ? (
                            <div className="school-data">
                                <Link to={`/date`} state={{ level: level, lang: language, schoolId: schoolId, count: count, lessonTypes: lessonTypes, allTeachers: allTeachers, price: price, logo: logo, name: name }} className="language-link">
                                    <div className="language-item">
                                        <p>Обрати час</p>
                                    </div>
                                </Link>
                                <Link to={`/teacher`} state={{ level: level, language: language, schoolId: schoolId, count: count, lessonTypes: lessonTypes, price: price, logo: logo, name: name }} className="language-link">
                                    <div className="language-item">
                                        <p>Обрати вчителя</p>
                                    </div>
                                </Link>
                            </div>
                        ) : ''}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LanguageSelection;
