const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let todos = [
  { id: 1, task: "learn node.js", completed: false, priority: "medium" },
  { id: 2, task: "build a rest api", completed: false, priority: "high" }
];

// Complete all todos
app.put('/todos/complete-all', (req, res) => {
  if (todos.length === 0) {
    return res.status(204).send({ message: "No todos to complete" });
  }

  // Mark all todos as completed
  todos = todos.map(todo => ({ ...todo, completed: true }));

  res.json({ message: "All todos marked as completed", todos });
});

// Get all todos (with optional filtering by completion status)
app.get('/todos', (req, res) => {
  const { completed } = req.query;

  // If `completed` query parameter is provided, filter todos
  if (completed !== undefined) {
    const filteredTodos = todos.filter(
      todo => todo.completed === (completed === 'true')
    );
    return res.json(filteredTodos);
  }

  res.json(todos);
});

// Add a new todo
app.post('/todos', (req, res) => {
  const { task, priority } = req.body;

  // Validate that 'task' is provided
  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).send({ error: 'Task is required and must be a non-empty string' });
  }

  const newTodo = {
    id: todos.length + 1,
    task: task.trim(),
    completed: false,
    priority: priority?.trim() || "medium"
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update a specific todo by id
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).send({ error: "Todo item not found" });
  }

  const { task, completed, priority } = req.body;

  todo.task = task !== undefined ? task.trim() : todo.task;
  todo.completed = completed !== undefined ? completed : todo.completed;
  todo.priority = priority?.trim() || todo.priority;

  res.json(todo);
});

// Delete a specific todo by id
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).send({ error: "Todo item not found" });
  }

  todos.splice(todoIndex, 1);
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
