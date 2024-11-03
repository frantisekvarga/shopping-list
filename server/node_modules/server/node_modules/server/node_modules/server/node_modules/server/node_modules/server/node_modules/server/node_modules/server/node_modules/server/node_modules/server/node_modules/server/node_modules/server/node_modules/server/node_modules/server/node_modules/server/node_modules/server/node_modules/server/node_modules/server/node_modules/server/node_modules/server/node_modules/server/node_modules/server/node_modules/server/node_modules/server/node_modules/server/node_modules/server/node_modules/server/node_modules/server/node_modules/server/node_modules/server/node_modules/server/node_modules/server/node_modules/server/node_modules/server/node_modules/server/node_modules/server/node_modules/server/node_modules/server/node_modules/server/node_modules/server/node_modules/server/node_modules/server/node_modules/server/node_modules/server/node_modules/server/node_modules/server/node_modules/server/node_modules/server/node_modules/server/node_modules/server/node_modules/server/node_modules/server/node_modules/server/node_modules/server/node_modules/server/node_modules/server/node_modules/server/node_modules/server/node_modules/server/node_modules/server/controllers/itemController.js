
const Item = require('../models/item');


exports.createItem = async (req, res) => {
    try {
        const item = new Item({
            name: req.body.name,
            quantity:req.body.quantity,
            description:req.body.description
            
        });
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Problém s vytvorením úlohy', error });
    }
};

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Problém s načitávaním úloh', error });
    }
};

exports.getItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        console.log(req.params.id)

        if (!item) {
            return res.status(404).json({ message: 'Úloha sa nenašla' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error s načitávaním', error });
    }
};

exports.searchItems = async (req, res) => {
    try {
        const query = req.query.query; 
        const items = await Item.find({ name: new RegExp(query, 'i') }); 
        res.json({ items });
        
    } catch (error) {
        console.error('Problém s hľadaním úloh', error);
        res.status(500).json({ error: 'Problém s hľadaním úloh' });
    }
};
exports.updateItem = async (req, res) => {
    const id = req.params.taskId;  

    
    
    try {
      const lookingItem = await Item.findById(id);  
      
        if (!lookingItem) {
            return res.status(404).json({ error: 'Nenašla sa úloha' });
        }
    
    
      lookingItem.name = req.body.name;  

      
      const updatedItem = await lookingItem.save();
      
  
     
      res.json({ message: 'Úspešne sa aktualizovala úloha', updatedItem });
    } catch (error) {
      console.log("yea")
      res.status(500).json({ error: 'Problém s aktualizovaním úlohy.' });
    }
  };
  