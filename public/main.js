function loadTasks(){
    fetch('/tasks')
    .then((response) => {
        if(!response.ok){
            throw new Error('Network response failure');
        }
        return response.json();
    })
    .then((tasks) => {
        console.log("Tasks fetched:", tasks); // Log the fetched tasks
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = "";

        tasks.forEach((task) =>{
            const li = document.createElement('li');
            taskList.appendChild(li);
            li.setAttribute('data-id', task._id)

            const checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            li.appendChild(checkBox);
            
            // li.textContent = task.task_title + "   ";
            const taskTitle = document.createElement('span'); 
            taskTitle.textContent = task.task_title; 
            li.appendChild(taskTitle);
            li.className = "task-item"
            const button = document.createElement('button');
            button.className = 'btn btn-danger btn-sm';
            button.innerHTML = "Delete";
            button.addEventListener('click', () => deleteTask(task._id));
            li.appendChild(button);

            
        })
    })
    .catch((error) => {
        console.error("Error loading tasks", error);
        console.log("Not working")
    });
};


function deleteTask(taskId){
    //send http request to delete task
    fetch(`/tasks/${taskId}`,{
        method:"DELETE"
    })
    .then((response) => {
        if(response.ok){
            const taskItem = document.querySelector(`li[data-id='${taskId}']`);
            if(taskItem){
                taskItem.remove();
            }else{
                console.error("Error occurred when deleting task", error)
            }
        }
    })
    .catch(error => {
        console.error("network error occurred", error)
    });
    }//deleteTask function


    //this function needs to be updated to async/await instead of utilising promises
function createTask(){
    const taskInput = document.getElementById('task-input').value;
    const jsontask = JSON.stringify({task_title:taskInput});
    fetch('/tasks',{
        method:"POST",
        body:jsontask,
        headers:{
            'Content-type':'application/json'
        }
    })
    .then((response) =>{
        if(response.ok){
            console.log("response is ok!")
            document.getElementById('task-input').value = "";
            return response.json();
        }else{
            throw new Error("Error creating task:", response.statusText)
        }
    })
    .then((data) => {
        //task is being passed through the callback function
        const task = data.savedTask;
        console.log("data:", JSON.stringify(data, null, 2));
        console.log("Task created successfully:", data); // Handle successful creation
        
        //accessing the task list and creating elements for the creation of new tasks
        const taskList = document.getElementById('task-list');
        const li = document.createElement('li');
        taskList.appendChild(li);
        li.setAttribute('data-id', task._id)
        li.className = "task-item"

        //creating checkbox for completing tasks and appending to start of li
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        li.appendChild(checkBox);

        //creating span so the task title can be placed after the checkbox
        const taskTitle = document.createElement('span'); 
        taskTitle.textContent = task.task_title; 
        li.appendChild(taskTitle);
        li.className = "task-item"

        //adding a delete button
        const button = document.createElement('button');
        button.className = 'btn btn-danger btn-sm';
        button.innerHTML = "Delete";
        button.addEventListener('click', () => deleteTask(task._id));
        li.appendChild(button);
    })
    .catch((error) => {
        console.error("Error creating task:", error); // Log any errors
    });
}


const createTaskBtn = document.getElementById('submit-input');
createTaskBtn.addEventListener('click', createTask);
document.addEventListener('DOMContentLoaded', loadTasks);
