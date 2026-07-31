import React from 'react';

function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input 
        type="checkbox" 
        checked={task.completed} 
        onChange={() => toggleTask(task.id)} 
        className="task-checkbox"
      />
      <span className="task-text">{task.text}</span>
      <button onClick={() => deleteTask(task.id)} className="delete-button">Delete</button>
    </div>
  );
}

export default TaskItem;
