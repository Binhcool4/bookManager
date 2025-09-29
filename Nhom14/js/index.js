let currentUser = localStorage.getItem('currentUser');
let books = [];
let avatarActive = false;

if (!currentUser) {
    window.location.href = 'login.html';
} else {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    if (user !== currentUser) {
        window.location.href = 'login.html';
    }
    books = JSON.parse(localStorage.getItem(`books_${currentUser}`)) || [];
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const username = users[currentUser] ? users[currentUser].username : currentUser.split('@')[0];
    document.getElementById('avatarInitial').textContent = username.charAt(0).toUpperCase();
    renderBooks();
}

function toggleLogout() {
    const avatar = document.getElementById('avatarBtn');
    avatarActive = !avatarActive;
    avatar.classList.toggle('active', avatarActive);
}

function updateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(books.map(book => book.category))];
    categoryFilter.innerHTML = '<option value="All">All</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function showModal(type, index = -1) {
    if (!currentUser) return;
    if (type === 'add') {
        document.getElementById('bookTitle').value = '';
        document.getElementById('bookAuthor').value = '';
        document.getElementById('bookYear').value = '';
        document.getElementById('bookCategory').value = '';
        document.getElementById('addModalMessage').textContent = '';
        document.getElementById('addModal').style.display = 'flex';
    } else if (type === 'edit' && index >= 0) {
        const book = books[index];
        document.getElementById('editBookTitle').value = book.title;
        document.getElementById('editBookAuthor').value = book.author;
        document.getElementById('editBookYear').value = book.year;
        document.getElementById('editBookCategory').value = book.category;
        editIndex = index;
        document.getElementById('editModalMessage').textContent = '';
        document.getElementById('editModal').style.display = 'flex';
    } else if (type === 'delete' && index >= 0) {
        deleteIndex = index;
        document.getElementById('deleteModalMessage').textContent = '';
        document.getElementById('deleteModal').style.display = 'flex';
    }
}

function hideModal(type) {
    if (type === 'add') document.getElementById('addModal').style.display = 'none';
    else if (type === 'edit') document.getElementById('editModal').style.display = 'none';
    else if (type === 'delete') document.getElementById('deleteModal').style.display = 'none';
    if (avatarActive) {
        document.getElementById('avatarBtn').classList.remove('active');
        avatarActive = false;
    }
}

function saveBook() {
    if (!currentUser) return;
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const year = document.getElementById('bookYear').value;
    const category = document.getElementById('bookCategory').value;
    const message = document.getElementById('addModalMessage');

    // Reset message
    message.textContent = '';

    // Check for empty fields
    if (!title || !author || !year || !category) {
        message.textContent = 'All fields are required!';
        return;
    }

    // Check for duplicate title
    const titleExists = books.some(book => book.title.toLowerCase() === title.toLowerCase());
    if (titleExists) {
        message.textContent = 'This title already exists!';
        return;
    }

    // If all validations pass
    books.push({ title, author, year, category });
    localStorage.setItem(`books_${currentUser}`, JSON.stringify(books));
    updateCategoryFilter();
    hideModal('add');
    renderBooks();
}

function saveEdit() {
    if (!currentUser || editIndex < 0) return;
    const title = document.getElementById('editBookTitle').value;
    const author = document.getElementById('editBookAuthor').value;
    const year = document.getElementById('editBookYear').value;
    const category = document.getElementById('editBookCategory').value;
    const message = document.getElementById('editModalMessage');

    // Reset message
    message.textContent = '';

    // Check for empty fields
    if (!title || !author || !year || !category) {
        message.textContent = 'All fields are required!';
        return;
    }

    // Check for duplicate title (excluding the current book being edited)
    const titleExists = books.some((book, index) =>
        book.title.toLowerCase() === title.toLowerCase() && index !== editIndex
    );
    if (titleExists) {
        message.textContent = 'This title already exists!';
        return;
    }

    // If all validations pass
    books[editIndex] = { title, author, year, category };
    localStorage.setItem(`books_${currentUser}`, JSON.stringify(books));
    updateCategoryFilter();
    hideModal('edit');
    renderBooks();
}

let editIndex = -1;
let deleteIndex = -1;

function confirmDelete() {
    if (!currentUser || deleteIndex < 0) return;
    books.splice(deleteIndex, 1);
    localStorage.setItem(`books_${currentUser}`, JSON.stringify(books));
    deleteIndex = -1;
    updateCategoryFilter();
    hideModal('delete');
    renderBooks();
}

function renderBooks() {
    if (!currentUser) return;
    const bookList = document.getElementById('bookList');
    let html = '';
    if (books.length === 0) {
        html = '<p id="noBooks">No books yet</p>';
    } else {
        let filteredBooks = books;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const sort = document.getElementById('sortFilter').value;

        filteredBooks = filteredBooks.filter(book =>
            (book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm)) &&
            (category === "All" || book.category === category)
        );

        if (sort === "A-Z") {
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === "Z-A") {
            filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sort === "Year-Asc") {
            filteredBooks.sort((a, b) => a.year - b.year);
        } else if (sort === "Year-Desc") {
            filteredBooks.sort((a, b) => b.year - a.year);
        }

        filteredBooks.forEach((book, index) => {
            html += `
                        <div class="book">
                            <div class="book-details">
                                ${book.title}<br>${book.author} * ${book.year} * ${book.category}
                            </div>
                            <div class="book-actions">
                                <span onclick="showModal('edit', ${index})" style="cursor: pointer;">✏️</span>
                                <span onclick="showModal('delete', ${index})" style="cursor: pointer;">🗑️</span>
                            </div>
                        </div>
                    `;
        });
    }
    bookList.innerHTML = html;
}

function searchBooks() {
    renderBooks();
}

function filterBooks() {
    renderBooks();
}

function sortBooks() {
    renderBooks();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = 'All';
    document.getElementById('sortFilter').value = 'A-Z';
    renderBooks();
}

function logout(event) {
    event.stopPropagation();
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}