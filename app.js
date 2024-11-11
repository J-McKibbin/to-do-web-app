//node.js runtime for to do app
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

//serve index.html as root
app.get('/', (req,res) =>{
  res.sendFile(path.join(__dirname, 'public','index.html'))
});

//serving tasks from route
app.get('/tasks-page', (req,res) =>{
  res.sendFile(path.join(__dirname, 'public','tasks.html'))
});


mongoose.connect('mongodb://localhost:27017/To-do')
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

//creating schema - this describes the structure of documents(table entries)
const taskSchema = new mongoose.Schema({
    //each ist item will have a name
    task_title: {type: String, required:true},
    //The list item will either be completed or not
    completed: {type: Boolean, default:false}
});

//assigning the schema to the model, mapping it to the collection in mongodb
const Task = mongoose.model('Task',taskSchema );

//route to read tasks
app.get('/tasks',(req, res) => {
  Task.find()
  .then(tasks => {
    res.status(200).json(tasks)
  })
  .catch(error => {
    console.log("Error getting tasks, error: ", error);
    res.status(500).json({error:"Error fetching tasks", details : error})
  });
});


// Route to create a new task
app.post('/tasks', (req, res) => {
    const newTask = new Task({
        task_title: req.body.task_title,
    });

    newTask.save()
      .then((savedTask) => {
          console.log('Task saved to MongoDB', savedTask);
          res.status(201).json({ savedTask });
      })
      .catch((error) => {
          console.error('Error saving task:', error);
          res.status(400).json({ error: 'Error saving task', details: error });
      });
});

//Delete route definition
//delete parameter takes in task id 
app.delete('/tasks/:id',(req,res) =>{
  const taskID = req.params.id;
  Task.findByIdAndDelete(taskID)
  .then((deletedTask) =>{
    if(!deletedTask){
      return res.status(404).json({message:"Task not found"});
    }
    //if the task is found
    console.log("Task Deleted", deletedTask);
    res.status(200).json({message:"Task deleted successfully"});
  })
  .catch((error) =>{
    res.status(500).json({error:"Error deleting task", details:error});
  })
});

//update task
app.put('/tasks/:id',(req, res) =>{
  const taskID = req.params.id;
  const updatedData = req.body;
  Task.findByIdAndUpdate(taskID, updatedData, {new:true, runValidators:true})
  .then((updatedTask) => {
    if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" }); // Handle case where task is not found
    }
    console.log("Task Updated", updatedTask); // Log the updated task
    res.status(200).json({ message: "Task updated successfully", updatedTask }); // Send the updated task in response
})
.catch((error) => {
    console.error('Error updating task:', error); // Log error for debugging
    res.status(500).json({ error: "Error updating task", details: error });
});

});


// Start the server and listen for requests
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});