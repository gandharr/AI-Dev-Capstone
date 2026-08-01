import { useState } from 'react'
import TaskItem from './components/TaskItem'
import TaskForm from './components/TaskForm'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a Task Manager', completed: false }
  ]);

  const addTask = (text) => {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="app-container">
      <h1>Task Manager</h1>
      
      <TaskForm addTask={addTask} />

      <div className="task-list">
        {tasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            toggleTask={toggleTask} 
            deleteTask={deleteTask} 
          />
        ))}
      </div>
      
      {tasks.length === 0 && <p className="empty-message">No tasks yet. Add one above!</p>}
    </div>
  )
}

export default App
