const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const Todo = require('./Todo');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

// Load Todos from JSON file
const loadTodos = () => {
  try {
    const data = fs.readFileSync('todos.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Save Todos to JSON file
const saveTodos = (todos) => {
  fs.writeFileSync('todos.json', JSON.stringify(todos), 'utf8');
};

// Routes
app.get('/todos', (req, res) => {
  const todos = loadTodos();
  res.render('todos', { todos });
});

app.post('/todos', (req, res) => {
  const { task } = req.body;
  const todos = loadTodos();
  const newTodo = new Todo(Date.now(), task, false);
  todos.push(newTodo);
  saveTodos(todos);
  res.redirect('/todos');
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todos = loadTodos();
  const todoToUpdate = todos.find(todo => todo.id === parseInt(id));
  if (todoToUpdate) {
    todoToUpdate.completed = !todoToUpdate.completed;
    saveTodos(todos);
    res.json(todoToUpdate);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todos = loadTodos();
  const updatedTodos = todos.filter(todo => todo.id !== parseInt(id));
  saveTodos(updatedTodos);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/todos`);
});
