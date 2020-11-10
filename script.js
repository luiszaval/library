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

function triggerConfirmModal(){
    bgWrapper.classList.toggle('show');
    confirmModal.classList.toggle('showConfirm');
    addBookBtn.classList.toggle('hide');
};

function handleSubmit(e) {
    e.preventDefault();
    const newBook = {}
    console.log(form.elements)
    for (let input of form.elements) {
        if(input.name === "read"){
            newBook[input.name] = input.checked;
        }else{
            newBook[input.name] = input.value
        }
    }
    console.log({newBook})
    addBookToLibrary(newBook)
    resetModal(form.elements)
};

function addBookToLibrary(newBook) {
    const { title, author, pages, read } = newBook
    const bgColor = newBook.bgColor || colors[Math.floor(Math.random() * colors.length)];
    const newBookModel = new Book(title, author, pages, read, key, bgColor, createHTML);
    myLibrary.push(newBookModel);
    console.log({myLibrary, newBookModel, newBook})
    bookDisplay(myLibrary);
    for (book of myLibrary){
        localStorage.setItem(book.key, JSON.stringify(book))
    }
    
    key++
};

function bookDisplay(library) {
    bookContainer.textContent = '';
    return library.map(book => {
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
    myLibrary = myLibrary.filter(book => book.key != keyToBeDeleted)
    localStorage.removeItem(keyToBeDeleted);
    bookDisplay(myLibrary);
    triggerConfirmModal();
    keyToBeDeleted = '';
};

function handlePageLoad(){
    if(!localStorage.length){
        triggerAddBkModal()
    }else{
        for (let i = 0; i < localStorage.length; i++) {
            addBookToLibrary(JSON.parse((localStorage.getItem(localStorage.key(i)))));
        }
        // let storageLibrary = Array.from(JSON.parse(localStorage.getItem('myLibrary')));
        // for(book of storageLibrary){
        //     addBookToLibrary(book)
    }
}

//EVENT LISTENERS
addBookBtn.addEventListener('click',triggerAddBkModal)

submitFormBtn.addEventListener('click', handleSubmit)

cancelFormBtn.addEventListener('click', triggerAddBkModal)

bgWrapper.addEventListener('click', () => addBookModal.classList.contains('show') ? triggerAddBkModal() : triggerConfirmModal())

confirmBtn.addEventListener('click', removeBook)

cancelConfirmBtn.addEventListener('click', triggerConfirmModal)

window.addEventListener('load', handlePageLoad)

/* For Modal
1. Body needs a class for blackout
2. Button needs a class for popup trigger
3. Modal needs a popup Modal class
4. popup Modal close class
5. CSS class for is_visible
6. CSS class for is-black-out

*/

/*Examples:
newBook => {title: "Hobbit", author: "Lowry", pages: "101", read: "on", "": ""}
newBookModel => Book:{title: "Hobbit", author: "Lowry", pages: "101", read: "on", info()}
myLibrary => [
    Book:{title: "Hobbit", author: "Lowry", pages: "101", read: "on", info()},
    Book:{title: "Hobbit", author: "Lowry", pages: "101", read: "on", info()}
]
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

/*FLOW
1. User click on create new book button
2. Modal pops up
3. User enters book information
4. On input changes we should be storing user input temporarily
    maybe add on on keydown event listener in the form inputs
5. On enter we need to capture infomation entered
    may not need to do step 4 as we are able to capture all info in this step
6. Send info over to create a new bookModal
7. add bgColor to book modal
8. call on html function to create html for each book
    Figure out best way to do this
7. Add bookModal to myLibrary storage (array or object???)
8. loop through each entry of the array and append each book.html to the bookContainer
*/





/* TODO
    1. FUNCTION Book()
        Make a Book object wherein you pass book details in order to initialize a new book
    2. FUNCTION addBookToLibrary()
        take users input and store book into an array
    3. myLibrary = []
        array to store all books
    4. FUNCTION bookDisplay()
        loops through the array and display each book
    5. Add a new book BTN
        brings up form and allows user to insert new book into library
    6. Remove book BTN
        allows user to remove selected book on click
    7. Read status BTN
        allows user to trigger on click
    8. localStorage
        save user input in localStorage
    9. Firebase
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
    4. Add styling to Form
    5.Adjust styling for buttons
    6. Add book themes
        - google library color schemes like earlier
    7. Add form validation
    8. Figure out how to display total number of pages
    9. Figure out how to check off that a book has been read
    10. Find a better way to delete a book
        - ask for user confirmation
    11. Adjust book display, should be a grid that wraps around
    12. Form should be displayed before book display
    13. EXTRA EXTRA add brown shelving css
*/

