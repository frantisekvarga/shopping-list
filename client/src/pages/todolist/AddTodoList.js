import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserProvider'; 
import { TodoContext } from '../../context/TodoProvider'; 
import './AddTodoList.css'; 
import { useTranslation } from 'react-i18next';

const AddTodoList = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext); 
  const { createTodoList } = useContext(TodoContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to create a todo list.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      
      const response = await createTodoList(title);
      if (response.status === 201) {
        setTitle('');
        navigate("/success-operation");
      }
    } catch (error) {
      console.error('Error adding todo list:', error);
      setError('Failed to create the todo list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-todo-container">
      <h1>{t('todo-list.add-new-todo-header')}</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder={t('todo-list.add-new-todo-list-create-name')}
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? t('todo-list.add-new-todo-create-loading') : t('todo-list.add-new-todo-create')}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddTodoList;
