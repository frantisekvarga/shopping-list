import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './AddMembers.css';
import { useTranslation } from 'react-i18next';

const AddMembers = () => {
    const { id } = useParams();
    const [newMemberEmails, setNewMemberEmails] = useState(['']);
    const [currentMembers, setCurrentMembers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();


    const token = localStorage.getItem('userToken'); 

    
    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`/api/lists/${id}/getmembers`, axiosConfig); 
                const membersData = response.data || [];
                setCurrentMembers(membersData);
            } catch (error) {
                setError('Chyba pri načítaní členov: ' + (error.response?.data?.message || 'Server error'));
            }
        };
        fetchMembers();
    }, [id]);

    const handleEmailChange = (index, value) => {
        const updatedEmails = [...newMemberEmails];
        updatedEmails[index] = value;
        setNewMemberEmails(updatedEmails);
    };

    const handleAddEmailField = () => {
        setNewMemberEmails([...newMemberEmails, '']);
    };

    const handleRemoveEmailField = (index) => {
        const updatedEmails = newMemberEmails.filter((_, i) => i !== index);
        setNewMemberEmails(updatedEmails);
    };

    const hasDuplicateEmails = (emails) => {
        const uniqueEmails = new Set(emails);
        return uniqueEmails.size !== emails.length;
    };

    const handleAddMembers = async (e) => {
        e.preventDefault();
        setError(null);

        if (hasDuplicateEmails(newMemberEmails)) {
            setError(t('add-members-page.emails-error'));
            return;
        }

        try {
            await Promise.all(newMemberEmails.map(email => {
                return axios.post(`/api/lists/${id}/members`, { email }, axiosConfig); 
            }));
            navigate("/success-operation");
        } catch (error) {
            setError('Chyba pri pridávaní člena: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    const handleRemoveMember = async (email) => {
        try {
            await axios.delete(`/api/lists/${id}/members/${email}`, axiosConfig);
            setCurrentMembers(currentMembers.filter(member => member.email !== email));
        } catch (error) {
            setError('Chyba pri odstraňovaní člena: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    return (
        <div className='main-add-member-container'>
            <div className="second-add-member-container">
                <h2>{t('add-members-page.add-members-header') }</h2>

                <form onSubmit={handleAddMembers}>
                    {newMemberEmails.map((email, index) => (
                        <div key={index} className="email-field">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => handleEmailChange(index, e.target.value)}
                                placeholder={t('add-members-page.member-email')}
                                required
                            />
                            <button type="button" onClick={() => handleRemoveEmailField(index)} className='quantity-button'>-</button>
                        </div>
                    ))}
                    <div className="add-div">
                        <button type="button" onClick={handleAddEmailField} className='confirm-button'>{t('add-members-page.add-member-trough-email')}</button>
                        <button type="submit" className="confirm-button">{t('add-members-page.add-members')}</button>
                    </div>
                </form>

                <h3>{t('add-members-page.current-members')}</h3>
                <ul className="current-members-list">
                    {currentMembers && currentMembers.length > 0 ? (
                        currentMembers.map(member => (
                            
                            <li key={member.email}>
                                {member.email}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveMember(member.email)}
                                    className="remove-member-button"
                                >{t('add-members-page.delete-member')}</button>
                            </li>
                        ))
                    ) : (
                        <p>{t('add-members-page.no-members-yet')}</p>
                    )}
                </ul>

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default AddMembers;
