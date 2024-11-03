const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const authenticate = require('../middleware/auth'); 

router.post('/create/:userId',authenticate, listController.createTodoList); 

router.get('/:userId',authenticate,listController.getTodoListsByUser); 

router.get('/get-one/:id', authenticate ,listController.getOneTodoList); 

router.post('/:id/tasks', authenticate , listController.addTaskToList); 

router.patch('/:id/tasks/:taskId/toggle', listController.toggleTaskCompletion);

router.delete('/:listId/tasks/:taskId', listController.removeTask);


router.patch("/:id/leave/:userId",authenticate , listController.leaveTodoList)
router.post('/:id/members', authenticate , listController.addMember); 
router.delete('/:id/members/:memberId',authenticate ,  listController.removeMember); 
router.patch('/:id/complete' ,  listController.completeTodoList); 
router.delete('/:id', authenticate , listController.deleteTodoList); 
router.get('/:id/getmembers',authenticate , listController.getTodoListMembers); 
router.get('/owner/:userId', authenticate , listController.getTodoListsByOwner); 
router.get('/member/:userId', authenticate , listController.getTodoListsByMember); 

router.patch('/:id/title', authenticate, listController.updateTodoListTitle);




module.exports = router;
