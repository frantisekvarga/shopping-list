
import React from 'react';
import "./NotFound.css"
import cannotFound from '../icons/cannotFound';
import { useTranslation } from 'react-i18next';
const NotFound = () => {
    const { t, i18n } = useTranslation();
    return (
        <div style={{ textAlign: 'center', margin: '50px' }} className='not-found'>
          
            <h2>{t('not-found.heading')}</h2>
            <cannotFound></cannotFound>
            
            <p>{t('not-found.message')}</p>
        </div>
    );
};

export default NotFound;
