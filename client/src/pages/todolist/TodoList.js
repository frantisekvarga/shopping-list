import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserProvider';
import OrderSquare from '../../components/OrderSquare';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../icons/Loading';
import './TodoList.css';
import { TodoContext } from '../../context/TodoProvider';

import { useTranslation } from 'react-i18next';

const TodoList = () => {
  const { user, isLoading } = useContext(UserContext);
  const { removeTodoList  , fetchTodoLists} = useContext(TodoContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');
  const { t, i18n } = useTranslation();

  const [todoLists, setTodoLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      if (!user || !user.id) {
        navigate('/user-login');
      }
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const loadTodoLists = async () => {
      if (!user || !user.id) {
        return;
      }

      try {
        const fetchedTodoLists = await fetchTodoLists(user.id); 
        setTodoLists(fetchedTodoLists);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching todo lists:', err);
        setError('Failed to load todo lists.');
        setLoading(false);
      }
    };

    if (token) {
      loadTodoLists();
    }
  }, [user, token, fetchTodoLists]);

  if (isLoading || loading) {
    return <div><Loading /></div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  const ownerPending = todoLists.filter(list => list.owner._id === user.id && !list.completed);
  const memberPending = todoLists.filter(list => list.members.some(member => member._id === user.id) && !list.completed);
  const completedLists = todoLists.filter(list => list.completed);

  return (
    <div className='main-todo-list-container'>
      <h1 className="custom-heading">
        <span>{t('todo-list.title')}</span>
        
      </h1>
      <div className="second-todo-list-container">

        {ownerPending.length > 0 && (
          <>
            {ownerPending.map((list) => (
              <OrderSquare
                key={list._id}
                title={list.title}
                owner={list.owner}
                members={list.members.map(member => member.username)}
                items={list.tasks}
                completed={list.completed}
                id={list._id}
                currentUserId={user.id}
                onDelete={() => removeTodoList(list._id)} 
              />
            ))}
          </>
        )}

        {memberPending.length > 0 && (
          <>
            {memberPending.map((list) => (
              <OrderSquare
                key={list._id}
                title={list.title}
                owner={list.owner}
                members={list.members.map(member => member.username)}
                items={list.tasks}
                completed={list.completed}
                id={list._id}
                currentUserId={user.id}
                onDelete={() => removeTodoList(list._id)} 
              />
            ))}
          </>
        )}

        {completedLists.length > 0 && (
          <>
            {completedLists.map((list) => (
              <OrderSquare
                key={list._id}
                title={list.title}
                owner={list.owner}
                members={list.members.map(member => member.username)}
                items={list.tasks}
                completed={list.completed}
                id={list._id}
                currentUserId={user.id}
                onDelete={() => removeTodoList(list._id)} 
              />
            ))}
          </>
        )}

        {ownerPending.length === 0 && memberPending.length === 0 && completedLists.length === 0 && (
          <div>{t('todo-list.no-todos')}</div>
        )}
      </div>
      <Link to="/add-todo" className="add-new-list">{t('todo-list.add-new-todo-header')}</Link>
    </div>
  );
};

export default TodoList;
