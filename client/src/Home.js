import React, { useEffect } from 'react';
import anime from 'animejs'; 
import "./Home.css";
import MyIcon from './icons/MyIcon';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
 
  useEffect(() => {
    
    anime({
      targets: '.main-home-container-box p', 
      opacity: [0, 1], 
      translateY: [20, 0],
      duration: 1000,
      easing: 'easeInOutQuad',
    });

    anime({
      targets: '.home-buttons button', 
      opacity: [0, 1], 
      translateY: [20, 0], 
      delay: anime.stagger(200),
      duration: 1000,
      easing: 'easeInOutQuad',
    });

    
    return () => {
     
    };
  }, []); 

  return (
    <div className='main-home-container-box'>
        <div className="second-home-container-box">
            <div className="icon-container">
              <MyIcon />
            </div>
            <div className="vertical-line"></div>
            <div className="third-home-container-box">
                <p style={{ color: 'var(--text-color)' }}> 
                  {t('home-description-app')}
                </p>
                <div className="home-buttons">
                    <button className='first-home-btn' onClick={() => navigate("/user-login")}>{t('login')}</button>
                    <button className='second-home-btn' onClick={() => navigate("/user-register")}>{t('register')}</button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Home;
