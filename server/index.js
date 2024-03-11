const { client, createTables, createProduct,
    createUser, createUserFavorite, fetchUsers, fetchProducts, fetchUserFavorite, deleteUserFavorite } = require('./db');
const express = require('express');
const app = express();


app.get('/api/products', async(req, res, next)=> {
    try {
      res.send(await fetchProducts());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/users', async(req, res, next)=> {
    try {
      res.send(await fetchUsers());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/users/:id/userFavorite', async(req, res, next)=> {
    try {
      res.send(await fetchUserFavorite(req.params.id));
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.delete('/api/users/:userId/userFavorite/:id', async(req, res, next)=> {
    try {
      await deleteUserFavorite({ user_id: req.params.userId, id: req.params.id });
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.post('/api/users/:id/userFavorite', async(req, res, next)=> {
    try {
      res.status(201).send(await createUserFavorite({user_id: req.params.id, product_id: req.body.product_id}));
    }
    catch(ex){
      next(ex);
    }
  });






const init = async()=> {
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables created');
  const [gill, frank, hamed, dji_mini, rod_mic, laptop, charger] = await Promise.all([
    createUser({ name: 'gill', username: 'gill25', password: 's3cr3t' }),
    createUser({ name: 'frank', username: 'frank69', password: 's3cr3t!!' }),
    createUser({ name: 'hamed', username: "hamedh", password: 'h&h' }),
    createProduct({ name: 'dji_mini'}),
    createProduct({ name: 'rod_mic'}),
    createProduct({ name: 'laptop'}),
    createProduct({ name: 'charger'}),
  ]);
  console.log(gill.id);
  console.log(frank.id);
  const users = await fetchUsers();
  console.log(users);
  const products = await fetchProducts();
  console.log(products);

  const userFavorite = await Promise.all([
    createUserFavorite({ user_id: gill.id, product_id: dji_mini.id}),
    createUserFavorite({ user_id: gill.id, product_id: charger.id}),
    createUserFavorite({ user_id: frank.id, product_id: laptop.id}),
    createUserFavorite({ user_id: hamed.id, product_id: rod_mic.id}),
  ]);

  console.log(await fetchUserFavorite(gill.id));


  const port = process.env.PORT || 9000;
  app.listen(port, ()=> console.log(`listening on port ${port}`));

};


init();
