import React, { useEffect } from 'react';
import anime from 'animejs'; // Make sure to import anime.js
import "./SuccessPage.css";
import { useNavigate } from 'react-router-dom';
import Animationsvg from './Animationsvg';
import { useTranslation } from 'react-i18next';

const SuccessPage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const pathEls = document.querySelectorAll('path'); 
        pathEls.forEach(pathEl => {
            const offset = anime.setDashoffset(pathEl);
            pathEl.setAttribute('stroke-dashoffset', offset);
            anime({
                targets: pathEl,
                strokeDashoffset: [offset, 0],
                duration: anime.random(1000, 7000),
                delay: anime.random(0, 7000),
                loop: true,
                direction: 'alternate',
                easing: 'easeInOutSine',
                autoplay: true,
            });
        });

        return () => {
            pathEls.forEach(pathEl => {
            });
        };
    }, []); 

    return (
        <div className='main-success-operation-page'>
            <div className="anime-background">
                <Animationsvg />
            </div>
            <div className="content-box">
                <h1 className="success-message">{t('success-page.success-message')}</h1>
                <button onClick={() => {
                    
                    navigate("/todo-list");
                }} className='back-to-orders-btn'>
                   {t('success-page.back-to-home')}
                </button>
            </div>
        </div>
    );
}

export default SuccessPage;
