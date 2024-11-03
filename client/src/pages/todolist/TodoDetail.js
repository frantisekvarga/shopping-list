import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './TodoDetail.css';
import { TodoContext } from '../../context/TodoProvider';
import { UserContext } from '../../context/UserProvider';
import { useTranslation } from 'react-i18next';




import { PieChart } from '@mui/x-charts/PieChart';




const TodoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { removeTask, addTaskToList, toggleTaskCompletion, removeTodoList , updateTodoTitle , updateTaskNameTitle } = useContext(TodoContext);
  const { user } = useContext(UserContext);
  const token = localStorage.getItem('userToken');

  const [list, setList] = useState(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const { t, i18n } = useTranslation();

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskName, setEditingTaskName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);


  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await axios.get(`/api/lists/get-one/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: user.id,
          },
        });
        setList(response.data);
        setNewTitle(response.data.title);
      } catch (error) {
        console.error('Error fetching list:', error);
        if (error.response && error.response.status === 403) {
          alert('You are not authorized to view this list.');
          navigate('/');
        }
      }
    };

    if (!token) {
      alert('You must be logged in to view this page.');
      navigate('/user-login');
    } else {
      fetchList();
    }
  }, [id, navigate, token, user]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const newTask = { name: newTaskName, description: newTaskDescription, completed: false };

    try {
        const response = await addTaskToList(id, newTask);
        
        if (response) {
          
            
          try {
            const response = await axios.get(`/api/lists/get-one/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                userId: user.id,
              },
            });
            setList(response.data);
            setNewTitle(response.data.title);
          } catch (error) {
            console.error('Error fetching list:', error);
            if (error.response && error.response.status === 403) {
              alert('You are not authorized to view this list.');
              navigate('/');
            }}
        }
        setNewTaskName('');
        setNewTaskDescription('');
    } catch (error) {
        console.error('Error adding task:', error);
    }
};


const handleToggleTask = async (taskId) => {
  try {
    
    const updatedTask = await toggleTaskCompletion(id, taskId);

    
    setList(prevList => ({
      ...prevList,
      tasks: prevList.tasks.map(task =>
        task.task._id === taskId ? { ...task, completed: updatedTask.completed } : task
      ),
    }));
  } catch (error) {
    console.error('Error toggling task status:', error);
  }
};



  const handleDeleteTask = async (taskId) => {
    try {
      await removeTask(id, taskId);
      setList(prevList => ({
        ...prevList,
        tasks: prevList.tasks.filter(task => task.task._id !== taskId),
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteList = async () => {
    try {
      await removeTodoList(id);
      navigate("/success-operation");
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const handleTitleEdit = async () => {
    try {
      await updateTodoTitle(id, newTitle);
      setIsEditingTitle(false);
      setList(prevList => ({
        ...prevList,
        title: newTitle,
      }));
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };
  const handleTaskNameEdit = async (itemId) => {
    try {
      const response = await updateTaskNameTitle(itemId, editingTaskName, id);
  
      if (response) {
        setList(response);
      }
      setEditingTaskId(null); 
    } catch (error) {
      console.error('Error updating name of item:', error);
    }
  };
  

  const handleToggleCompletion = async () => {
    try {
      const newCompletionStatus = !list.completed; 
      await axios.patch(`/api/lists/${id}/complete`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setList(prevList => ({
        ...prevList,
        completed: newCompletionStatus,
      }));
    } catch (error) {
      console.error('Error toggling list completion status:', error);
    }
  };

  const handleLeaveList = async () => {
    try {
      await axios.patch(`/api/lists/${id}/leave/${user.id}`, {}, {
        headers: {
          Authorization:`Bearer ${token}`,
        }
      });
      navigate("/success-operation");
    } catch (error) {
      console.error('Error leaving list:', error);
    }

    
  };

  const handleConfirmDelete = () => {
    setConfirmDelete(true);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  const completedTasks = list?.tasks.filter(task => task.completed).length || 0;
  const notCompletedTasks = list?.tasks.filter(task => !task.completed).length || 0;

  

  const pieData = [
    { id: 'completed', value: completedTasks, label: 'Vyriešené Úlohy' },
    { id: 'notCompleted', value: notCompletedTasks, label: 'Nevyriešené Úlohy' },
  ];



  if (!list) return <div>Loading...</div>;

  return (
    <div className='todo-detail-container'>
      <div className="second-detail-container">
        {list.owner._id === user.id ? (
          isEditingTitle ? (
            <div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className='todo-input'
              />
              <button onClick={handleTitleEdit} className='complete-list-button'>{t('save-title-name')}</button>
            </div>
          ) : (
            <h1 className='todo-title' onClick={() => setIsEditingTitle(true)}>{list.title}</h1>
          )
        ) : (
          <h1 className='todo-title'>{list.title}</h1>
        )}

        <form onSubmit={handleAddTask} className='todo-form'>
          <input
            type="text"
            className="todo-input"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder={t('todo-detail-page.new-task-name')}
            required
          />
          <input
            type="text"
            className="todo-input"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder={t('todo-detail-page.new-task-description')}
            required
          />
          <button type="submit" className='add-task-button'>{t('todo-list.add-new-todo')}</button>
        </form>

        <h2 className='tasks-heading'>Tasks_</h2>
              {list.tasks && list.tasks.length > 0 ? (
        <ul className='task-list'>
        {list.tasks.map(item => (
          <div className='each-task-custom-css' key={item.task._id}>
            <li className={`task-item ${item.completed ? 'completed' : ''}`}>
              {editingTaskId === item.task._id ? (
                <>
                  <input
                    type="text"
                    value={editingTaskName}
                    onChange={(e) => setEditingTaskName(e.target.value)}
                    className='todo-input'
                  />
                  <button 
                    onClick={() => handleTaskNameEdit(item.task._id)} 
                    className='complete-list-button'
                  >
                    Save Name
                  </button>
                </>
              ) : (
                <h4 onClick={() => {
                  setEditingTaskId(item.task._id);
                  setEditingTaskName(item.task.name); 
                }}>
                  {item.task.name}
                </h4>
              )}
              <p>{item.task.description}</p>
              <div className="task-item-buttons">
                <button 
                  onClick={() => handleToggleTask(item.task._id)} 
                  className={`toggle-complete-button ${item.completed ? 'completed-btn' : 'no-completed-btn'}`}
                >
                  {item.completed ? t('todo-detail-page.mark-as-not-completed') : t('todo-detail-page.mark-as-completed')}
                </button>
                <button 
                  onClick={() => handleDeleteTask(item.task._id)} 
                  className='delete-task-button'
                >
                  {t('todo-detail-page.delete-todo')}
                </button>
              </div>
            </li>
          </div>
        ))}
      </ul>
      
      ) : (
        <p>{t('todo-detail-page.no-tasks')}</p>
      )}

      {notCompletedTasks+completedTasks>0 ? (
      <div className='pie-chart'><PieChart
      series={[
        {
          data: pieData,
          
        },
        
      ]}
      width={"700"} 
      height={"400"} 
      margin={{
        left: 100,
        right: 100,
        top: 100,
        bottom: 100,
      }
    
    }
      
    /></div>):<></>}


      
    
        
      

{list.owner._id === user.id && (
          <>
            {confirmDelete ? (
              <div className="confirm-delete-container">
                <p>{t('todo-detail-page.confirm-delete-list')}</p>
                <button onClick={handleDeleteList} className='delete-list-button'>{t('todo-detail-page.yes-delete')}</button>
                <button onClick={cancelDelete} className='delete-list-button'>{t('todo-detail-page.cancel')}</button>
              </div>
            ) : (
              <button className="delete-list-button" onClick={handleConfirmDelete}>
                {t('todo-detail-page.delete-list')}
              </button>
            )}

            <button className="complete-list-button" onClick={handleToggleCompletion}>
              {list.completed ? t('todo-detail-page.mark-as-not-archieved') : t('todo-detail-page.mark-as-archieved')}
            </button>
            <button className="members-button">
              <Link to={`/lists/${id}/members`} style={{ textDecoration: 'none', color: 'inherit' }}>{t('todo-detail-page.add-members')}</Link>
            </button>
          </>
        )}
        {list.owner._id !== user.id && (
          <button onClick={handleLeaveList} className='leave-list-button'>{t('todo-detail-page.leave-list')}</button>
        )}
      </div>
    </div>
  );
};

export default TodoDetail;
