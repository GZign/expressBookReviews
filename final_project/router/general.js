const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bodyParser = require('body-parser');
public_users.use(bodyParser.urlencoded({ extended: false }));
public_users.use(bodyParser.json());
public_users.use(express.json());

public_users.post("/register", (req,res) => {
  //Write your code here
    const { username, password } = req.body;
  
    // Verificar si el nombre de usuario ya existe
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ error: 'El nombre de usuario ya existe.' });
    }
  
    // Verificar si se proporcionó el nombre de usuario y la contraseña
    if (!username || !password) {
      return res.status(400).json({ error: 'Debe proporcionar el nombre de usuario y la contraseña.' });
    }
  
    // Registrar el nuevo usuario
    users.push({ username, password });
  
    res.status(200).json({ message: 'Usuario registrado exitosamente.' });

});

/*
Para probar voy a postman, elijo POST y Body en raw->JSON y pongo:
{
  "username": "ejemploUsuario",
  "password": "ejemploContraseña"
}
*/

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let getBookList = new Promise((resolve, reject) =>{
    if (books){
      resolve()
    } else {
      reject("No hay libros")
    }
  })
  getBookList.then(
    ()=>{return res.json(books)},
    (msj) =>{return res.json({message:msg})}

  )
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let getBookList = new Promise((resolve, reject) =>{
    if (books[isbn]){
      resolve(books[isbn])
    } else {
      reject("No existe libro")
    }
  })
  getBookList.then(
    (details)=>{return res.json(details)},
    (msj) =>{res.status(404).json({message:msj})}

  )
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const aut = req.params.author;
  let getBookList = new Promise((resolve, reject) =>{
    if (aut){
      resolve(aut)
    } else {
      reject("No existe autor")
    }
  })
  getBookDetailsAuthor.then(
(aut) => {let existedBooks = Object.entries(books).filter(([isbn, details])=> details.author === aut)

if (existedBooks.length > 0) {
  existedBooks = Object.fromEntries(existedBooks);
  return res.json(existedBooks);
}
return res.status(404).json({message: "Libro con autor no encontrado"});
},
(msg) => {res.status(404).json({message: msg})

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const tit = req.params.title;
  let getBookList = new Promise((resolve, reject) =>{
    if (tit){
      resolve(tit)
    } else {
      reject("No existe autor")
    }
  })

  getBookDetailsAuthor.then(
    (tit) => {let existedBooks = Object.entries(books).filter(([isbn, details])=> details.title === tit)
    
    if (existedBooks.length > 0) {
      existedBooks = Object.fromEntries(existedBooks);
      return res.json(existedBooks);
    }
    return res.status(404).json({message: "Libro con titulo no encontrado"});
    },
    (msg) => {res.status(404).json({message: msg})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];
  //let reviewArray = Object.values(book.reviews);
  res.send(book.reviews);
});

// Add a book review
public_users.put("/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book  = books[isbn];
  if (!book) {
    return res.status(404).send(`No se encontró un libro con el ISBN ${isbn}.`);
  }
  const { review } = req.body;
  book.reviews.push(review);
  users.push(filtered_user);
  res.send(`El libro con el ISBN ${isbn} fue actualizado con la nueva reseña: ${review}.`);
});

module.exports.general = public_users;
