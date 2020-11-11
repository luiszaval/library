const addBookBtn = document.querySelector("#addBook"); 
const addBookModal = document.querySelector('#addBookModal');
const submitFormBtn = document.querySelector('#submitBtn');
const cancelFormBtn = document.querySelector('#cancelBtn');

// TODO confirmation modal
const confirmModal = document.querySelector('.confirmModal');
const confirmBtn = document.querySelector('#confirm');
const cancelConfirmBtn = document.querySelector('#cancelConfirm')

const bookContainer = document.querySelector('#bookDisplay');
const bgWrapper = document.querySelector('.wrapper');
const form = document.querySelector('form')
const colors = [ '#325453', '#517174', '#EF5D58', '#DCBE87', '#AD6A34', '#4E1D04'] 

let myLibrary = [];
let key = 1;
let keyToBeDeleted = '';

//Book Model
function Book(title, author, pages, read, key, bgColor, createHTML) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.key = key;
    this.bgColor = bgColor;
    this.info = function () {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? `read` : `not read yet`}.`
    };
    this.HTML = createHTML(this.title, this.author, this.pages, this.read, this.bgColor, this.key);
};


function createHTML(bkTitle, bkAuthor, totalPages, read, bgColor, key) {
    //create new HTML elements
    const bookDiv = document.createElement('div');
    const bookInfo = document.createElement('div');
    const bookFooter = document.createElement('div');
    const divider = document.createElement('div')
    const title = document.createElement('span');
    const author = document.createElement('span');
    const pages = document.createElement('span')
    const deleteBtn = document.createElement('span');

    //handle HTML content
    deleteBtn.textContent = `X`;
    title.textContent = bkTitle;
    author.textContent = bkAuthor;
    pages.textContent = totalPages
    deleteBtn.setAttribute('data-set', `${key}`);
    bookDiv.setAttribute('key', `${key}`)

    //add CSS classes
    if(!read) bookDiv.classList.add('not-read')
    bookDiv.classList.add('center');
    deleteBtn.classList.add('delete')
    title.classList.add('title');
    author.classList.add('author')
    pages.classList.add('pages')
    bookInfo.classList.add('card');
    bookInfo.style.backgroundColor = bgColor;
    console.log(bgColor)
    divider.classList.add('line');
    bookFooter.classList.add('footer')

    //handle HTML appearance
    bookDiv.appendChild(bookInfo);
    bookInfo.appendChild(deleteBtn);
    bookInfo.appendChild(title);
    bookInfo.appendChild(divider);
    bookInfo.appendChild(author);
    bookInfo.appendChild(pages);
    bookDiv.appendChild(bookFooter);

    // handle JS
    deleteBtn.addEventListener('click', handleDelete)

    return bookDiv
};

function triggerAddBkModal(){
    bgWrapper.classList.toggle('show');
    addBookModal.classList.toggle('show');
    addBookBtn.classList.toggle('hide');
};

function handleSubmit(e) {
    e.preventDefault();
    const newBook = {}
    for (let input of form.elements) {
        if (input.name === "read") {
            newBook[input.name] = input.checked;
        } else {
            newBook[input.name] = input.value
        }
    }
    addNewBookToLibrary(newBook)
    resetModal(form.elements)
};

function addNewBookToLibrary(newBook) {
    const { title, author, pages, read } = newBook
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    const newBookModel = new Book(title, author, pages, read, key, bgColor, createHTML);
    myLibrary.push(newBookModel);
    bookDisplay(myLibrary);
    localStorage.setItem(newBookModel.key, JSON.stringify(newBookModel))
    key++
};

function handleStorageBooks(){
    let max = -Infinity
    for (const [bookKey] of Object.entries(localStorage)){
        max = Math.max(max, +bookKey)
    }
    key = max + 1;
    addStorageBooksToLibrary()
}

function addStorageBooksToLibrary(){
    for (let i = 0; i < localStorage.length; i++) {
        let bookInfo = (JSON.parse((localStorage.getItem(localStorage.key(i)))));
        let { title, author, pages, read, bgColor, key } = bookInfo
        let bookModel = new Book(title, author, pages, read, key, bgColor, createHTML);
        myLibrary.push(bookModel);
    }
    bookDisplay(myLibrary);
}

function triggerConfirmModal(){
    bgWrapper.classList.toggle('show');
    confirmModal.classList.toggle('showConfirm');
    addBookBtn.classList.toggle('hide');
};



function bookDisplay(myLibrary) {
    bookContainer.textContent = '';
    return myLibrary.map(book => {
        const bookDiv = book.HTML
        bookContainer.appendChild(bookDiv);
    })
};

function resetModal(formElements){
    for (let input of formElements) {
        if (input.name === "read") {
            input.checked = true;
        } else {
            input.value = ''
        }
    };
    triggerAddBkModal();
};

function handleDelete(e) {
    keyToBeDeleted = e.target.dataset.set;
    triggerConfirmModal();
};

function removeBook(){
    debugger;
    myLibrary = myLibrary.filter(book => book.key != keyToBeDeleted)
    localStorage.removeItem(keyToBeDeleted);
    bookDisplay(myLibrary);
    triggerConfirmModal();
    keyToBeDeleted = '';
};



//EVENT LISTENERS
window.addEventListener('load', () => localStorage.length ? handleStorageBooks() : triggerAddBkModal())

addBookBtn.addEventListener('click',triggerAddBkModal)

submitFormBtn.addEventListener('click', handleSubmit)

cancelFormBtn.addEventListener('click', triggerAddBkModal)

bgWrapper.addEventListener('click', () => addBookModal.classList.contains('show') ? triggerAddBkModal() : triggerConfirmModal())

confirmBtn.addEventListener('click', removeBook)

cancelConfirmBtn.addEventListener('click', triggerConfirmModal)






/*Examples:
createHTML() =>
<div id="bookContainer">
    <div id="bookDiv">
        <div id="bookInfo">
            <span id="title" />
            <div id="divider"></div>
            <span id="author" />
        </div>
        <div id="footer"></div>
        <button id="deleteBtn" />
    </div>
</div>

*/

/* TODO
    1. Firebase
        save user input to a server in the cloud
    
*/
/*2ND ROUND TODO
    1. Figure out how best to maximize our book objects
        - Why use OOP intead of a regulat function that will spit out an object with my info
        - See about adding other methods to the Book object
        - How to utilize the info method we passed it
    2. Refactor code
        - Eliminate unneccesary code especially in creating the book cards
        - Set up the bookDisplay function to be more readable
    3. How best to store book model, as an object into the array, as an object of obect?? 
        - Look at Konrad's comment on mapping
    4. Add form validation
*/

