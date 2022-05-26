//Book Class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI Class
class UI {
  static displayBooks() {
    // const storedBooks = [
    //   {
    //     title: "The Hitchhiker's Guide to the Galaxy",
    //     author: 'Douglas Adams',
    //     isbn: '12345',
    //   },
    //   {
    //     title: 'The Colour of Magic',
    //     author: 'Terry Pratchett',
    //     isbn: '765432',
    //   },
    // ];
    const storedBooks = Store.getBooks();
    const books = storedBooks;

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    setTimeout(() => {
      div.remove();
    }, 3000);
  }

  static clearFileds() {
    const inputElements = document.querySelectorAll('.form-control');
    inputElements.forEach((el) => (el.value = ''));
  }

  static deleteBook(item) {
    if (item.classList.contains('delete')) {
      //remove the parent/parent of whatever we clicked
      item.parentElement.parentElement.remove();
      // const isbn = item.parentElement.previousElementSibling.textContent;
      // Store.removeBook(isbn);
    }
  }
}

//Store Class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    const newBooks = books.filter((book) => book.isbn !== isbn);
    localStorage.setItem('books', JSON.stringify(newBooks));
  }
}

////////////////////////

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  //prevent actual submit
  e.preventDefault();

  //Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  //Validation
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    //Instatiate book
    const book = new Book(title, author, isbn);

    //Add book to LocalStorage
    Store.addBook(book);

    //Add book to UI
    UI.addBookToList(book);

    //Clear fields
    UI.clearFileds();

    //Add success message when the book is added to the list
    UI.showAlert('You successfully added a new book to the list', 'success');
  }
});

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  //delete from the UI
  UI.deleteBook(e.target);

  //delete from LocalStorage
  const isbn = e.target.parentElement.previousElementSibling.textContent;
  Store.removeBook(isbn);

  UI.showAlert('Book Removed', 'success');
});
