import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserProvider';
import './Login.css';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(UserContext);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const token = Cookies.get('userToken') || localStorage.getItem('userToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            navigate('/todo-list');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/user/login', { username, password });
            if (res.data && res.data.accessToken) { 
                const { accessToken, user } = res.data; 
    
                
                login({ token: accessToken, userId: user.id, username: user.username, email: user.email });
    
               
                Cookies.set('userToken', accessToken, { expires: 7 });
                localStorage.setItem('userToken', accessToken);
                localStorage.setItem('userId', user.id);
    
                
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                
               
                navigate('/todo-list');
            } else {
                setError(t('server.error-message'));
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Nesprávne prihlasovacie údaje.');
            } else {
                setError('Prihlásenie zlyhalo. Skúste to znova.');
            }
        }
    };
    

    return (
        <div className='main-login-page-container'>
            <div className="second-login-page-container">
                <h1>{t('login-title')}</h1>
                <div className="login-form-container">
                    <form onSubmit={handleSubmit} className='login-form'>
                        <input 
                            type="text" 
                            placeholder={t('username')}
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                        <input 
                            type="password" 
                            placeholder={t('password')}
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <button type="submit">{t('login')}</button>
                    </form>
                </div>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
};

export default Login;