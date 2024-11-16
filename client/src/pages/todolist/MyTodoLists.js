import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../context/UserProvider'; 
import OrderSquare from '../../components/OrderSquare'; 
import "./MyTodoLists.css"; 
import Loading from '../../icons/Loading';
import { Link, useNavigate } from 'react-router-dom';
import { TodoContext } from '../../context/TodoProvider';
import { useTranslation } from 'react-i18next';

const MyTodoLists = () => {
  const { user, isLoading } = useContext(UserContext);
  const [todoLists, setTodoLists] = useState([]); 
  const { fetchUserTodoLists  , fetchTodoLists} = useContext(TodoContext);
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [showCompleted, setShowCompleted] = useState(null); 
  const navigate = useNavigate();
  const { t } = useTranslation();


  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/user-login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchTodoLists = async () => {
      setLoading(true); 
      if (!user) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetchUserTodoLists(user.id); 
        setTodoLists(response); 
      } catch (error) {
        console.error('Error fetching todo lists:', error);
        setError('Failed to load todo lists'); 
      } finally {
        setLoading(false); 
      }
    };
    
    
    if (user) {
      fetchTodoLists()
    }
  }, [user, fetchUserTodoLists]);

  const filteredTodoLists = todoLists.filter(list => {
    if (showCompleted === null) {
      return true; 
    }
    return list.completed === showCompleted; 
  });

  if (loading) {
    return <div><Loading /></div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <div className='main-todo-list-container'>
      <h1 className="custom-heading">
        <span>{t('my-todos-page.my-todos-header')}</span>
      </h1>
      <div className="filter-buttons">
        <button onClick={() => setShowCompleted(null)}>{t('my-todos-page.show-all')}</button>
        <button onClick={() => setShowCompleted(true)}>{t('my-todos-page.show-completed')}</button>
        <button onClick={() => setShowCompleted(false)}>{t('my-todos-page.show-not-completed')}</button>
      </div>
      <div className="second-todo-list-container">
        {filteredTodoLists.length > 0 ? (
          filteredTodoLists.map((list) => (
            <OrderSquare
              key={list._id}
              title={list.title}
              owner={list.owner} 
              members={list.members.map(member => member.username)} 
              items={list.tasks} 
              completed={list.completed} 
              id={list._id}
              currentUserId={user.id} 
            />
          ))
        ) : (
          <div>{t('my-todos-page.no-available-todos')}</div> 
        )}
      </div>
      
      <Link to="/add-todo" className="add-new-list">{t('todo-list.add-new-todo-header')}</Link>
    </div>
  );
};

export default MyTodoLists;
