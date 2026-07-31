import React, { useState } from 'react';

function TaskForm({ addTask }) {
  const [newTaskText, setNewTaskText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(newTaskText);
    setNewTaskText('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input 
        type="text" 
        value={newTaskText} 
        onChange={(e) => setNewTaskText(e.target.value)} 
        placeholder="Add a new task..." 
        className="task-input"
      />
      <button type="submit" className="add-button">Add</button>
    </form>
  );
}

export default TaskForm;
