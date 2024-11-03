
const TodoList = require ("../models/toDoList.js")
const Item = require ("../models/item.js")
const mongoose = require('mongoose');
const User = require("../models/users.js")




exports.createTodoList = async (req, res) => {
    const { title } = req.body;
    const { userId } = req.params;

    try {
        const newList = new TodoList({ title, owner: userId, tasks: [] });
        await newList.save();
        res.status(201).json(newList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Problém s vytvorením zoznamu', error });
    }
};
exports.getTodoListMembers = async (req, res) => {
    const { id } = req.params;

    try {
        
        const list = await TodoList.findById(id).populate('members', 'username email'); 

        if (!list) {
            return res.status(404).json({ message: 'List sa nenašiel' });
        }

        
        res.status(200).json(list.members);
    } catch (error) {
        console.error('Problém s načítaním členov:', error);
        res.status(500).json({ message: 'Problém s načítaním členov', error });
    }
};

exports.getTodoListsByUser = async (req, res) => {
    const { userId } = req.params;

    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Nesprávny formát userId' });
    }

    try {
        const todoLists = await TodoList.find({
            $or: [
                { owner: userId },          
                { members: userId }
            ]
        })
        .populate('owner', 'username')  
        .populate('members', 'username')  
        .populate('tasks.task');  

        res.status(200).json(todoLists);
    } catch (error) {
        console.error('Problém s načítaním listov:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};
exports.getOneTodoList = async (req, res) => {
    const { id } = req.params;  
    const userId = req.headers.userid;  
  
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Nesprávny Id formát' });
    }
  
    try {
        const list = await TodoList.findById(id)
            .populate('owner', 'username')  
            .populate('members', 'username') 
            .populate('tasks.task');  
        if (!list) {
            return res.status(404).json({ message: 'List sa nenašiel' });
        }
  
        
  
        res.status(200).json(list);
    } catch (error) {
        console.error('Problém s načítaním listov', error);
        res.status(500).json({ message: 'Problém s načítaním listov', error });
    }
};




  
exports.addTaskToList = async (req, res) => {
    const { id } = req.params; 
    const { name, description } = req.body; 

    try {
        
        const newItem = new Item({ name, description }); 
        await newItem.save();

        const list = await TodoList.findById(id); 
        list.tasks.push({ task: newItem._id }); 
        await list.save(); 

        const io = req.io; 
        io.emit('taskAdded', { listId: id, task: newItem }); 

       
        res.status(201).json(newItem); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Problém s pridaním tasku', error });
    }
};



exports.toggleTaskCompletion = async (req, res) => {
    const { id, taskId } = req.params;
    
    try {
        
        const list = await TodoList.findById(id);
        if (!list) {
            return res.status(404).json({ message: 'List sa nenašiel' });
        }

        
        const task = list.tasks.find(task => task.task.toString() === taskId);
        if (!task) {
            return res.status(404).json({ message: 'List sa nenašiel' });
        }

        
        task.completed = !task.completed;

        
        await list.save();

        
        res.status(200).json(task);
    } catch (error) {
        console.error('Problém s označením úlohy za dokončenú', error);
        res.status(500).json({ message: 'Problém s označením úlohy za dokončenú', error });
    }
};

  
exports.removeTask = async (req, res) => {
    const { listId, taskId } = req.params;
    console.log(listId, taskId);

    try {
        const list = await TodoList.findById(listId);
        if (!list) {
            return res.status(404).json({ message: 'List sa nenašiel' });
        }

        const taskToRemove = list.tasks.find(task => task.task._id.toString() === taskId);
        if (!taskToRemove) {
            return res.status(404).json({ message: 'Úloha sa nenašla v liste' });
        }

        list.tasks = list.tasks.filter(task => task.task._id.toString() !== taskId);
        await list.save();

        await Item.findByIdAndDelete(taskToRemove.task._id);

        const io = req.io; 
        io.emit('taskRemoved', { listId, taskId }); 
        res.status(200).json({ message: 'Úloha sa úspešne odstránila', tasks: list.tasks });
    } catch (error) {
        console.error('Problém s odstránením tasku:', error);
        res.status(500).json({ message: 'Problém s odstránením tasku', error });
    }
};



exports.addMember = async (req, res) => {
    const { id } = req.params; 
    const { email } = req.body; 

    try {
        const list = await TodoList.findById(id);
        if (!list) {
            return res.status(404).json({ message: 'List sa nenašiel' });
        }

        const member = await User.findOne({ email: email });
        if (!member) {
            return res.status(404).json({ message: 'Member sa nenašiel' });
        }

        if (list.members.includes(member._id)) {
            return res.status(400).json({ message: 'User je už aktuálne member' });
        }

        list.members.push(member._id);
        await list.save();

        return res.status(200).json(list);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Problém s pridaním member', error });
    }
};



exports.removeMember = async (req, res) => {
    const { id, email } = req.params; 
    try {
        const list = await TodoList.findById(id);
        if (!list) {
            return res.status(404).json({ message: 'List sa nenašiel' });
        }

        
        list.members = list.members.filter(member => member.email !== email);

        await list.save();
        res.status(200).json({ message: 'Member bol úspešne odstránení' });
    } catch (error) {
        res.status(500).json({ message: 'Server chyba sa stala počas pridaní použivateľa ' });
    }
};



exports.completeTodoList = async (req, res) => {
    const { id } = req.params;

    try {
        const list = await TodoList.findById(id);
        if (!list) {
            return res.status(404).json({ message: 'List sa nenašiel' });
        }

        list.completed = !list.completed; 
        await list.save();

        res.status(200).json({ message: 'List je označený ako dokončený', list });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Problem s označením listu', error });
    }
};


exports.deleteTodoList = async (req, res) => {
    const { id } = req.params;

    try {
        
        await Item.deleteMany({ _id: { $in: (await TodoList.findById(id)).tasks.map(task => task.task) } });

        
        const list = await TodoList.findByIdAndDelete(id);
        if (!list) {
            return res.status(404).json({ message: 'List sa nenašiel' });
        }
        res.status(200).json({ message: 'List sa kompletne vymazal' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Problém s odstránením listu', error });
    }
};



exports.markTodoListAsCompleted = async (req, res) => {
    const { id } = req.params;

    try {
        const list = await TodoList.findById(id);
        if (!list) {
            return res.status(404).json({ message: 'List sa nenašiel' });
        }

        list.completed = true; 
        await list.save();

        res.status(200).json({ message: 'List je označený ako completed', list });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Problém s označením listu', error });
    }
};


exports.leaveTodoList = async (req, res) => {
    const { id, userId } = req.params;

    try {
        const list = await TodoList.findById(id); 
        if (!list) {
            return res.status(404).json({ message: 'List sa nenašiel' }); 
        }

        if (!Array.isArray(list.members) || list.members.length === 0) {
            return res.status(400).json({ message: 'Žiadny members nie su v tomto liste' });
        }

        if (!list.members.includes(userId)) {
            return res.status(400).json({ message: 'User nie je member listu' });
        }

        list.members = list.members.filter(member => {
            if (member) { 
                return member.toString() !== userId; 
            }
            return false; 
        });

        await list.save(); 

        res.status(200).json({ message: 'Úspešne ste odišli z listu', members: list.members });
    } catch (error) {
        console.error('Problem s leave listu:', error);
        res.status(500).json({ message: 'Problem s leave listu', error });
    }
};

exports.getTodoListsByOwner = async (req, res) => {
    const userId = req.params.userId;

    try {
        const todoLists = await TodoList.find({ owner: userId })
            .populate('owner', 'username')
            .populate('members', 'username');

        res.status(200).json(todoLists);
    } catch (error) {
        console.error('Problem s načitanim listov', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getTodoListsByMember = async (req, res) => {
    const userId = req.params.userId;

    try {
        const todoLists = await TodoList.find({ members: userId })
            .populate('owner', 'username')
            .populate('members', 'username');

        res.status(200).json(todoLists);
    } catch (error) {
        console.error('Problem s načitanim member listov:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateTodoListTitle = async (req, res) => {
    const { id } = req.params; 
    const { title } = req.body; 
    const userId = req.user.id; 
    console.log(userId)

    if (!title || title.trim() === "") {
        return res.status(400).json({ message: 'Názov nemôže byť prázdy' });
    }

    try {
        const list = await TodoList.findById(id);

        if (!list) {
            return res.status(404).json({ message: 'List sa nenašiel' });
        }

       
        if (list.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Len owner môže updatnuť nazov' });
        }

    
        list.title = title;
        await list.save();

        res.status(200).json({ message: 'Názov sa úspešne aktualizoval', list });
    } catch (error) {
        console.error('Problem s aktualizovanim nazvu:', error);
        res.status(500).json({ message: 'Problem s aktualizovanim nazvu', error });
    }
};
