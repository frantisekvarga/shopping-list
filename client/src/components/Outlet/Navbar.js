import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserProvider';
import { ThemeContext } from '../../context/ThemeProvider'; 
import './Navbar.css';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useContext(UserContext); 
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };
    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
        setSelectedLanguage(language);
      };

    const handleLogout = () => {
        logout(); 
        axios.defaults.headers.common['Authorization'] = ''; 
        navigate('/');
        closeMobileMenu();
    };

    const handleAddList = () => {
        setIsMobileMenuOpen(false);
        navigate('/add-todo');
    };

    const isLoggedIn = user !== null; 

    return (
        <div>
            <nav className="navbar">
                <RouterLink to="/" onClick={closeMobileMenu} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                    <h1 className='logo'>Shopping List - Unicorn Project</h1>
                </RouterLink>
                
                <button className="mobile-menu-icon" onClick={toggleMobileMenu}>
                    ☰
                </button>
                
                <div className={`cover ${isMobileMenuOpen ? 'active' : ''}`}>
                    <ul className={`main-navbar-container-ul-links ${isMobileMenuOpen ? 'active' : ''}`}>
                        <button className="theme-switch" onClick={toggleTheme} style={{ cursor: 'pointer' }}>
                            <div className={`switch ${isDarkMode ? 'dark' : 'light'}`}>
                                <span className="switch-ball"></span>
                            </div>
                            <span className="theme-label">{isDarkMode ? t('theme-modes.dark') : t('theme-modes.light')}</span>
                        </button>
                        <div className="language-list">
                            <div className="language-selector">
                                <button
                                className={`language-button ${selectedLanguage === 'en' ? 'active' : ''}`}
                                onClick={() => handleLanguageChange('en')}
                                >
                                EN
                                </button>
                                <button
                                className={`language-button ${selectedLanguage === 'sk' ? 'active' : ''}`}
                                onClick={() => handleLanguageChange('sk')}
                                >
                                SK
                                </button>
                                <button
                                className={`language-button ${selectedLanguage === 'cs' ? 'active' : ''}`}
                                onClick={() => handleLanguageChange('cs')}
                                >
                                CS
                                </button>
                            </div>
                            </div>
                        

                        {isLoggedIn ? (
                            <>
                                <li className="li-special logout" onClick={handleLogout}>
                                    <div style={{ cursor: 'pointer', color: 'red' }}>{t('logout')}</div>
                                </li>
                                <li className="li-special logout">
                                    <div onClick={handleAddList} style={{ cursor: 'pointer' }}>{t('add_new_list')}</div>
                                </li>
                                <li className="li-special logout">
                                    <div style={{ cursor: 'pointer' }}>{user.username}</div>
                                </li>
                                <RouterLink to="/todo-list" onClick={closeMobileMenu} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                                    <li><div>{t('all_todos')}</div></li>
                                </RouterLink>
                                <RouterLink to="/todolists" onClick={closeMobileMenu} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                                    <li><div>{t('find_your_todo')}</div></li>
                                </RouterLink>
                            </>
                        ) : (
                            <>
                                <RouterLink to="/user-login" onClick={closeMobileMenu} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                                    <li><div>{t('login')}</div></li>
                                </RouterLink>
                                <RouterLink to="/user-register" onClick={closeMobileMenu} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                                    <li><div>{t('register')}</div></li>
                                </RouterLink>
                            </>
                        )}
                    </ul>
                    
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
