const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}
function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    books = JSON.parse(stored);
  }
}

function generateId() {
  return +new Date();
}

function renderBooks(filter = null) {
  const incomplete = document.getElementById("incompleteBookList");
  const complete = document.getElementById("completeBookList");
  incomplete.innerHTML = "";
  complete.innerHTML = "";

  let data = books;
  if (filter) {
    data = books.filter((b) =>
      b.title.toLowerCase().includes(filter.toLowerCase())
    );
  }

  for (const book of data) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    bookItem
      .querySelector("[data-testid=bookItemIsCompleteButton]")
      .addEventListener("click", function () {
        book.isComplete = !book.isComplete;
        saveData();
        renderBooks(filter);
      });

    bookItem
      .querySelector("[data-testid=bookItemDeleteButton]")
      .addEventListener("click", function () {
        books = books.filter((b) => b.id !== book.id);
        saveData();
        renderBooks(filter);
      });

    bookItem
      .querySelector("[data-testid=bookItemEditButton]")
      .addEventListener("click", function () {
        const newTitle = prompt("Judul baru:", book.title);
        const newAuthor = prompt("Penulis baru:", book.author);
        const newYear = prompt("Tahun baru:", book.year);
        if (newTitle && newAuthor && newYear) {
          book.title = newTitle;
          book.author = newAuthor;
          book.year = parseInt(newYear);
          saveData();
          renderBooks(filter);
        }
      });

    if (book.isComplete) {
      complete.appendChild(bookItem);
    } else {
      incomplete.appendChild(bookItem);
    }
  }
}

document.getElementById("bookForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: generateId(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveData();
  renderBooks();
  this.reset();
});

document.getElementById("searchBook").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document
    .getElementById("searchBookTitle")
    .value.trim()
    .toLowerCase();
  renderBooks(query);
});

window.addEventListener("load", function () {
  loadData();
  renderBooks();
});
