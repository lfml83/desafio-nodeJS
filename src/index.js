const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  
  const {username} = request.headers;

  const user = users.find(user => user.username === username);
  //verificando se o usuario existe
  if(!user){
    return response.status(404).json({error : "User not found!"});
  }

  request.user = user;

  return next();

}

app.post('/users', (request, response) => {
  // Complete aqui
  
  const {name,username}= request.body;

  const usernameExists = users.some(user => user.username === username);

  if(usernameExists){
    return response.status(400).json({error : "Username already exists!"});
  }

  const user = { 
    
      id: uuidv4(),
      name, 
      username, 
      todos: []  
  
    }

    users.push(user);

    return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title, deadline} = request.body;

  const todo ={ 
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title , deadline } = request.body;
  const {user} = request;
  const {idParams} = request.params;

  const todoId = user.todos.find(todoId => todoId.id === idParams)

  if(!todoId){
    return response.status(404).json({error: 'Todo not found'})
  }

  todoId.title=title;
  todoId.deadline=new Date(deadline);

  return response.json(todoId);




});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {idParams} = request.params;


  const todId = user.todos.find(todoId => todoId.id ===idParams);

  if(!todId){
    return response.status(404).json({error : "not found"})
  }

  todoId.done=true;

  return response.json(todoId);


});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;