import React from 'react';
import './OrderSquare.css'; 
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OrderSquare = ({ title, owner, members, items, completed, id, currentUserId }) => { 
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/todo/${id}/details`); 
    };
    const isCompleted = completed;
    const { t, i18n } = useTranslation();
     
    const isOwner = owner._id=== currentUserId;
   

 

    return (
        <div className={`order-square ${isOwner ? 'owner' : 'non-owner'} ${isCompleted ? 'completed' : 'no-completed'}`}>
            <h3 className= {`order-name ${isCompleted ? 'completed' : 'no-completed'}`}>{title}</h3>
            <p className="order-items">{t('list-sqare-component.list-owner')}: {owner.username}</p> 
            {members.length > 0 ? (
                <p className="order-items">{t('list-sqare-component.list-members')}: {members.join(', ')}</p> 

            ):<p className="order-items">{t("list-sqare-component.no-members")}</p>}
            
            <p className="order-status"> {completed ? t("todo-list.todo-statuses.completed") : t("todo-list.todo-statuses.not-completed")}</p>
            <p className="order-items">{t("todo-list.todo-items")}: {items.length}</p> 
            <div className="details-overlay-orders" onClick={handleClick}>
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 5140 4830" preserveAspectRatio="xMidYMid meet">
                    <g id="layer1" className="arrow" stroke="none">
                        <path d="M235 4540 c-7 -12 -156 277 1152 -2237 619 -1190 1131 -2163 1138 -2163 13 0 2286 4358 2289 4388 1 16 -124 17 -2286 20 -1474 1 -2289 -1 -2293 -8z"/>
                    </g>
                </svg>
                <p className='showing'>{t("list-sqare-component.show-todos")}</p>
            </div>
        </div>
    );
};

export default OrderSquare;
