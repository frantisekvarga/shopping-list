import React from 'react';
import './Footer.css';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const Footer = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <div className="footer-section about">
          <h3>{t('footer.about_us_header')}</h3>
          <p>{t('footer.about_us')}</p>
        </div>

        
        <div className="footer-section links">
          <h3>{t('footer.quick_links.header')}</h3>
          <ul>
          
          <RouterLink to="/" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}><li><a>{t('home')}</a></li></RouterLink>
          <RouterLink to="/user-login" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}><li><a>{t('login')}</a></li></RouterLink>
          <RouterLink to="/user-register" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}><li><a>{t('register')}</a></li></RouterLink>
         
            <li><a href="#">{t('footer.quick_links.contact')}</a></li>
            <li><a href="#">{t('footer.quick_links.faq')}</a></li>
          </ul>
        </div>

        
        <div className="footer-section contact">
          <h3>{t('footer.contact.header')}</h3>
          <p>{t('footer.contact.email')}: support@unicornproject.com</p>
          <p>{t('footer.contact.phone')}: +123 456 7890</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Unicorn Project. {t('footer.all-rights-reserved')}.</p>
      </div>
    </footer>
  );
}

export default Footer;
