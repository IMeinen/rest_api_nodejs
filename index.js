const express = require('express');

const server  = express();

server.use(express.json());

const listaProjetos = []; /* lista com todos os projetos */
let contadorRequest = 0;  /* contador de request pro midlleware*/

/* middleware para checar se o projeto existe */
function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const projeto = listaProjetos.find(p => p.id == id);
  
    if (!projeto) {
      return res.status(400).json({ error: 'Projeto não encontrado' });
    }

    return next();
}
/* middleware para não deixar criar duas vezes com o mesmo id */
function notCreateTwice(req, res, next) {
    const { id } = req.body;
    const projeto = listaProjetos.find(p => p.id === id);
    
    if (projeto) {
      return res.status(400).json({ error: 'Já existe um projeto com esse id!' });
    }

    return next();
}
/* middleware para fazer o log dos métodos */
function logRequest(req,res,next) {
    contadorRequest++;

    console.log(`Total de requisições ${contadorRequest}`);

    return next();
}

server.use(logRequest);
/* GET de todos os projetos*/
server.get('/projects', (req,res) => {
    
    return res.json(listaProjetos)
});
/* POST de um novo projeto */
server.post('/projects', notCreateTwice , (req,res) => {
    const { id , title } = req.body ;
    const novo_projeto   = { "id": id , "title" : title , "tasks" : []};
    
    listaProjetos.push(novo_projeto)
    return res.json(listaProjetos);
});
/* POST de uma nova task para um projeto */
server.post('/projects/:id/tasks',checkProjectExists, (req,res) => {
    const { id } = req.params;
    const { tasks }  = req.body ;
    const projeto = listaProjetos.find(p => p.id == id);

    projeto.tasks.push(tasks);

    return res.json(listaProjetos);

});
/* DELETE de um projeto */
server.delete('/projects/:id',checkProjectExists, (req,res) => {
    const id    = req.params;
    const index = listaProjetos.findIndex(x => x.id ===  id);
    console.log(id);
    listaProjetos.splice(index - 1,1);

    return res.json(listaProjetos);

});
/* PUT para atualizar o titulo de um projeto */
server.put('/projects/:id',checkProjectExists, (req,res) => {
    const { id }    = req.params;
    const { title } = req.body;

    const index = listaProjetos.findIndex(x => x.id ===  id);

    listaProjetos[index].title = title ;

    return res.json(listaProjetos);

});

server.listen(3000);

