import React from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../../../services/images/Group12.svg'
import '../../../pages/chooseLanguage/language.css'

const LanguageSelection = ({ title, data, type, language = null, level = null, schoolId = null }) => {
    return (
        <div className="main">
            <div className="container">
                <div className='logo'>
                    <div className='logo-items'>
                        <img src={LogoImg} alt="Logo" />
                        <div className='logo-name'>Мовна школа <span>EAGLES</span></div>
                    </div>
                </div>
                <div className='container-items-block'>
                    <h1 className="languages-title">{title}</h1>
                    {data && (
                        <div className="school-data">
                            {data.map((item, index) => (
                                <Link
                                    key={index}
                                    className="language-link"
                                    to={type === 'language' ? '/course' : type === 'level' ? '/lessoTypes' : '/teacher'}
                                    state={
                                        type === 'language' ? { level: item.level, language: item.lang, schoolId: schoolId } : type === 'level' ? { level: item.levelName, language: language, lessonTypes: item.lessonTypes, schoolId: schoolId } : { level: level, language: language, lessonTypes: item.typeName, schoolId: schoolId }
                                    }
                                >
                                    <div className="language-item">
                                        <p>{type === 'language' ? item.lang : type === 'level' ? item.levelName : item.typeName}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LanguageSelection;
