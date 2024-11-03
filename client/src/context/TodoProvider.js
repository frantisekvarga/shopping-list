import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserProvider';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem('userToken');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const createTodoList = async (title) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const userId = user.id;
      const response = await axios.post(`/api/lists/create/${userId}`, { title }, axiosConfig);

      return response;  

    } catch (error) {
      console.error('Error creating todo list:', error);
      throw error;  
    }
  };

  const addTaskToList = async (listId, taskData) => {

    console.log(user)
    const response = await axios.post(`/api/lists/${listId}/tasks`, taskData, axiosConfig);
    const updatedList = await fetchOneTodoList(listId);
    
    return updatedList;

  };

  const updateTaskStatus = async (listId, taskId, newStatus) => {

  
    await axios.patch(`/api/lists/${listId}/tasks/${taskId}`, { completed: newStatus }, axiosConfig);
  };

  const removeTask = async (listId, taskId) => {
    await axios.delete(`/api/lists/${listId}/tasks/${taskId}`, axiosConfig);
  };

  const removeTodoList = async (listId) => {
    await axios.delete(`/api/lists/${listId}`, axiosConfig);
  };

  const fetchTodoLists = async (userId) => {
    try {
        const response = await axios.get(`/api/todolists/user/${user.id}` , axiosConfig);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching todo lists: ' + error.message);
    }
};

const fetchUserTodoLists = async (userId) => {
  
  try {
    const response = await axios.get(`/api/lists/owner/${userId}`, axiosConfig);
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch user todo lists');
  }
};


const fetchAvailableTodoLists = async (userId) => {
  
 
  try {
    const response = await axios.get(`/api/lists/member/${userId}`, axiosConfig);
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch available todo lists');
  }
};

const updateTodoTitle = async (listId, newTitle) => {
  try {
    await axios.patch(`/api/lists/${listId}/title`, { title: newTitle }, axiosConfig);
  } catch (error) {
    console.error('Error updating todo title:', error);
    throw error;
  }
};
const updateTaskNameTitle = async ( taskId, newName , listId) => {
  
  try {
    await axios.patch(`/api/items/update-item/${taskId}`, { name: newName }, axiosConfig);

    const updatedList = await fetchOneTodoList(listId);
    
    return updatedList;

  } catch (error) {
    console.error('Error updating todo title:', error);
    throw error;
  }
}



const toggleTaskCompletion = async (listId, taskId) => {

  
  try {
    
    const response = await axios.patch(`/api/lists/${listId}/tasks/${taskId}/toggle`, {}, axiosConfig);
    return response.data;
  } catch (error) {
    console.error('Error toggling task completion:', error);
    throw error; 
  }}
  
  const fetchOneTodoList = async (listId) => {
    try {
      const response = await axios.get(`/api/lists/get-one/${listId}`, axiosConfig);
      return response.data;  
    } catch (error) {
      console.error('Error fetching todo list:', error);
      throw error;  
    }
  };

  return (
    <TodoContext.Provider value={{
      createTodoList,
      addTaskToList,
      updateTaskStatus,
      removeTask,
      removeTodoList,
      fetchTodoLists,
      fetchAvailableTodoLists,
      fetchUserTodoLists,
      updateTodoTitle,
      toggleTaskCompletion,
      fetchOneTodoList,
      updateTaskNameTitle
    }}>
      {children}
    </TodoContext.Provider>
  );
};
