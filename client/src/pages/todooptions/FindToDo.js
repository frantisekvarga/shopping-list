import React from 'react'
import "./FindToDo.css"
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserProvider'
import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next';

const FindToDo = () => {
  const { user , isLoading} = useContext(UserContext);
  const { t, i18n } = useTranslation();


    const navigate = useNavigate()

    const redirectToMyLists=()=>{
        navigate("/my-lists")
    }
    const redirectToAvaibleLists=()=>{
      navigate("/avaible-lists")
      
  }
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/user-login');
      }
    }
  }, [user, isLoading, navigate]);



  return (
    <div className='main-orders-container'>
        <h1>{t('find-todo-page.find-todo-header')}</h1>
        <div className="options-buttons">
            <button onClick={redirectToMyLists}>{t('find-todo-page.your-created-todos')}</button>
            <button onClick={redirectToAvaibleLists}>{t('find-todo-page.member-of-todos')}</button>
        </div>
    </div>
  )
}

export default FindToDo