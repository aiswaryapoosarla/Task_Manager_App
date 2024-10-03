import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '@aws-amplify/auth'; // Import getCurrentUser

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [userId, setUserId] = useState(null);

  // Fetch the current authenticated user
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await getCurrentUser();
        const userId = user.attributes.sub;
        setUserId(userId);
      } catch (error) {
        console.error('Error fetching user from Cognito:', error);
      }
    };

    fetchUserId();
  }, []);

  // Add a new task
  const addTask = () => {
    if (newTask.trim() === '') return;

    const updatedTasks = [...tasks, { text: newTask, completed: false }];
    setTasks(updatedTasks);
    setNewTask(''); // Clear the input field after adding the task
  };

  // Toggle task completion
  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Delete a task
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task"
          style={{ marginRight: '10px' }} // Add space between input and button
        />
        <button onClick={addTask}>Add Tasks</button>
      </div>

      <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
        {tasks.map((task, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ flex: 1, textDecoration: task.completed ? 'line-through' : '' }}>
              {task.text}
            </span>
            <button
              onClick={() => toggleTask(index)}
              style={{ marginLeft: '10px' }} // Add space between task text and button
            >
              {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button
              onClick={() => deleteTask(index)}
              style={{ marginLeft: '10px' }} // Add space between the two buttons
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
