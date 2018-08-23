class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        const list = document.querySelector('#book-list');
        // Create tr element
        const row = document.createElement('tr');
        // Insert columns
        row.innerHTML =
        `<td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">x</a></td>`;
    
        list.appendChild(row);    
    }

    showAlert(message, className) {
        // Create div
        const div = document.createElement('div');
        // Add classes
        div.className = `alert ${className}`;
        // Add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('#content');
        // Get form
        const form = document.querySelector('#book-form');
        // Insert alert
        container.insertBefore(div, form);
        // Timeout after 3 seconds
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000);

    }

    deleteBook(target) {
        if(target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }    
    }

    clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';    
    }
}

// Local Storage Class
class Storage {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks() {
        const books = Storage.getBooks();

        books.forEach(function(book) {
            const ui = new UI;

            // Add book to UI
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = Storage.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Storage.getBooks();

        books.forEach(function(book, index) {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Storage.displayBooks);

// Event Listeners for book added
document.querySelector('#book-form').addEventListener('submit', function(e) {
    // Get form values
    const title = document.querySelector('#title').value,
          author = document.querySelector('#author').value,
          isbn = document.querySelector('#isbn').value

    // Instatiate book
    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();

    // Validate
    if(title === '' || author === '' || isbn === '') {
        // Error alert
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        // Add book to list
        ui.addBookToList(book);

        // Add to local storage
        Storage.addBook(book);

        // Show success
        ui.showAlert('Book Added!', 'success');

        // Clear fields
        ui.clearFields();
    }

    e.preventDefault();
});

// Event Listeners for book deleted
document.querySelector('#book-list').addEventListener('click', function(e) {
    // Instantiate UI
    const ui = new UI();
    
    // Delete book
    ui.deleteBook(e.target);

    // Remove from local storage
    Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show alert
    ui.showAlert('Book Removed!', 'success');
    
    e.preventDefault();
});