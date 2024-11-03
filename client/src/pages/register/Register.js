import React, { useState, useEffect, useContext } from 'react';
import "./Register.css";
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserProvider'; 
import { useTranslation } from 'react-i18next';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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
        setLoading(true); 
        try {
            const res = await axios.post('/api/user/create-user', { username, password, email });
            if (res.data && res.data.token) {
                const { token, userId: id } = res.data;

               
                
                login({ token, userId: id, username, email });

                
                Cookies.set('userToken', token, { expires: 7 }); 
                localStorage.setItem('userToken', token);
                localStorage.setItem('userId', id);

                
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                
                navigate('/todo-list');
            } else {
                setError('Neplatná odpoveď servera.');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Pri registrácii došlo k chybe.');
            } else {
                setError('Pri registrácii došlo k chybe. Skúste to znova.');
            }
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className='main-register-page-container'>
            <div className="second-register-page-container">
                <h1>{t('register-title')}</h1>
                <div className="register-form-container">
                    <form onSubmit={handleSubmit} className='login-form'>
                        <input 
                            type="text" 
                            placeholder={t('username')}
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                        <input 
                            type="email" 
                            placeholder={t('user-email')} 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
                        <input 
                            type="password" 
                            placeholder={t('password')}
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Prebieha registrácia...' : t('register')}
                        </button>
                    </form>
                </div>
                {error && <p className="error-message">{error}</p>} 
            </div>
        </div>
    );
};

export default Register;
