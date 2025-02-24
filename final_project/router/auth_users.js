const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

const newUser = {
  username: 'ejemploUsuario',
  password: 'ejemploContraseña'
};

users.push(newUser);

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
  return user.username === username
});
if(userswithsamename.length > 0){
  return true;
} else {
  return false;
}

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
  return (user.username === username && user.password === password)
});
if(validusers.length > 0){
  return true;
} else {
  return false;
}

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (!isValid(username)) {
    return res.status(400).json({ message: "Error al iniciar sesión. Nombre de usuario no válido." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 });

    req.session.authorization = {
      accessToken,
      username
    };

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book  = books[isbn];
  if (!book) {
    return res.status(404).send(`No se encontró un libro con el ISBN ${isbn}.`);
  }
  const { review } = req.body;
  book.reviews.push(review);
  users.push(book);
  res.send(`El libro con el ISBN ${isbn} fue actualizado con la nueva reseña: ${review}.`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book  = books[isbn];
  if (!book) {
    return res.status(404).send(`No se encontró un libro con el ISBN ${isbn}.`);
  }
  const { review } = req.body;
  book.reviews.delete(review);
  users.push(book);
  res.send(`Eliminada la reseña: ${review}.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
