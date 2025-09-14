// Select DOM elements
const bookNameInput = document.getElementById('book-name');
const bookURLInput = document.getElementById('book-url');
const addBtn = document.getElementById('add-btn');
const listEl = document.getElementById('list');
const deleteAllBtn = document.getElementById('delete-all');

let books;

// Try loading saved bookmarks from localStorage
try {
    books = JSON.parse(localStorage.books) || [];
    updateBooksList();
} catch {
    books = [];
}

// Event listeners
addBtn.addEventListener('click', addBook);
deleteAllBtn.addEventListener('click', deleteAllBooks);

// Add new bookmark
function addBook() {
    if (!checkInputs()) return;

    books.push({
        id: Date.now(),
        bookName: bookNameInput.value,
        bookURL: bookURLInput.value
    });

    updateBooksList(); // re-render list
    storeBooks();      // save to localStorage

    // Clear input fields
    bookNameInput.value = '';
    bookURLInput.value = '';
}

// Render the bookmarks list
function updateBooksList() {
    listEl.innerHTML = '';
    const reversedBooks = [...books].reverse(); // show latest at top
    reversedBooks.forEach(book => {
        const li = createLi(book);
        listEl.append(li);
    });

    checkDeleteAllBtn(); // show/hide "Delete All" button
}

// Create single list item
function createLi(book) {
    const li = document.createElement('li');
    li.innerHTML = `
        <a href="${book.bookURL}" target="_blank">${book.bookName}</a>
        <button class="remove-btn" onclick='deleteBook(this, ${book.id})'>Remove</button>
    `;
    return li;
}

// Delete single bookmark
function deleteBook(delBtn, id) {
    books = books.filter(book => book.id !== id);
    delBtn.parentElement.remove();
    storeBooks();
    checkDeleteAllBtn();
}

// Delete all bookmarks
function deleteAllBooks() {
    books.length = 0;
    listEl.innerHTML = '';
    storeBooks();
    checkDeleteAllBtn();
}

// Validate inputs before saving
function checkInputs() {
    let isValidName = /\w/.test(bookNameInput.value.trim());
    let isValidUrl = /^https?:\/\//.test(bookURLInput.value.trim());

    if (isValidName && isValidUrl) return true;

    alert('Fill both inputs.\nURL must start with http(s)://');
    return false;
}

// Save to localStorage
function storeBooks() {
    localStorage.books = JSON.stringify(books);
}

// Show/hide delete-all button based on list
function checkDeleteAllBtn() {
    deleteAllBtn.style.display = books.length ? 'block' : 'none';
}
