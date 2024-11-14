const express  = require('express');

const app = express();
const fs = require('fs');
app.use(express.json());

let userId = 0;

app.post("/users", (req, res) => {
  userId += 1;
  let obj = {
    id: userId,
    ...req.body
  }
  fs.readFile('usersData.json', 'utf8', (err, data) => {
    if (err) throw err;

    let jsonData = JSON.parse(data);
    jsonData.push(obj);

    fs.writeFile('usersData.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) throw err;
    });
  });
  res.send({ id: userId })

})

app.get("/users/:id", (req, res) => {
  let users = JSON.parse(fs.readFileSync('./usersData.json','utf-8'));
  const user = users.find(user => user.id === Number(req.params.id));
  if (user) {
    res.send(user);
  } else {
    res.status(404);
    res.send({user: null})
  }
});

app.put("/users/:id", (req, res) => {
  
  let users = JSON.parse(fs.readFileSync('./usersData.json', 'utf-8'));
  
  let user = users.find(user => user.id === Number(req.params.id));
    if (user) {
      user.userName = req.body.userName;
      user.age = req.body.age;
      
      fs.writeFileSync('./usersData.json', JSON.stringify(users, null, 2));
  
      res.send(user);
  } else {
    res.status(404);
    res.send({user: null})
  }
  });
  
app.delete("/users/:id", (req, res) => {
    let users = JSON.parse(fs.readFileSync('./usersData.json','utf-8'));
    const user = users.find(user => user.id === Number(req.params.id));
    if (user) {
      const usersIndex = users.indexOf(user);
      users.splice(usersIndex, 1)
      fs.writeFileSync('./usersData.json', JSON.stringify(users, null, 2));
      res.send({user})
    } else {
      res.status(404);
      res.send({user: null})
    }
  });

app.listen(3000);