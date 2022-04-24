import Todo from './todo.js';
import {
  tabs,
  themeBtn,
  todoInput,
  clearCompleted,
  itemsLeft,
  todoItems,
} from './elements.js';

class App {
  #todos = [];
  constructor() {
    this.#getLocalStorage();
    this.#displayItemsLeft();
    todoInput.addEventListener('keyup', this.#newTodo.bind(this));
    todoItems.addEventListener('click', this.#handleTodo.bind(this));
    tabs.forEach(tab =>
      tab.addEventListener('click', this.#handleTabs.bind(this))
    );
    clearCompleted.addEventListener('click', this.#clearCompleted.bind(this));
    themeBtn.addEventListener('click', this.#toggleTheme.bind(this));
  }

  #newTodo(e) {
    if (e.keyCode === 13 && e.target.value !== '') {
      if (this.#todos.some(todo => todo.text === e.target.value))
        return alert(`"${e.target.value}" is already on your todo list.`);
      // Create new Todo instance
      const todo = new Todo(e.target.value);
      //push instance into #todos array
      this.#todos.push(todo);
      // display todo in list
      this.#displayTodo(todo);
      // clear input field
      e.target.value = '';
      // display num of active items
      this.#displayItemsLeft();
      //save all todos to local storage
      this.#setLocalStorage();
    }
  }

  #displayTodo(todo) {
    const html = `
    <li class="todo__list-item">
      <input ${todo.completed && 'checked'} type="checkbox" id="${todo.id}" />
      <label for="${todo.id}">
        <span></span>
        ${todo.text}
      </label>
      <button id="delete"><span class="sr-only">Delete</span></button>
    </li>
    `;
    todoItems.insertAdjacentHTML('afterbegin', html);
  }

  #handleTodo(e) {
    if (!e.target.className === 'todo__list-item') return;
    if (e.target.type === 'checkbox') this.#crossoutTodo(e);
    if (e.target.id === 'delete') this.#deleteTodo(e);
  }

  #crossoutTodo(e) {
    // find todo by id
    const todo = this.#todos.find(todo => todo.id === e.target.id);
    // set completed status
    todo.completed = e.target.checked;
    this.#displayItemsLeft();
    // save to local storage
    this.#setLocalStorage();
  }

  #deleteTodo(e) {
    const todoItem = e.target.parentElement;
    const id = todoItem.querySelector('input').id;
    // remove item from #todos array
    this.#todos = this.#todos.filter(todo => todo.id !== id);
    // remove from html
    todoItem.remove();
    this.#displayItemsLeft();
    // save to local storage
    this.#setLocalStorage();
  }

  #handleTabs(e) {
    // set aria-selected
    tabs.forEach(tab => {
      tab.setAttribute('aria-selected', false);
    });
    e.target.setAttribute('aria-selected', true);
    // filter by all/active/completed
    if (e.target.textContent === 'All') this.#displayAllTodos();
    if (e.target.textContent === 'Active') this.#filterTodos('active');
    if (e.target.textContent === 'Completed') this.#filterTodos('completed');
  }

  #filterTodos(status) {
    // find active/completed todos
    const todos = this.#todos.filter(
      todo => todo.completed === (status === 'active' ? false : true)
    );
    // clear list
    todoItems.innerHTML = '';
    // display todos
    todos.forEach(todo => this.#displayTodo(todo));
  }

  #clearCompleted(e) {
    // remove completed todos
    this.#todos = this.#todos.filter(todo => todo.completed !== true);
    this.#displayAllTodos();
    //save changes to lacal storage
    this.#setLocalStorage();
  }

  #displayAllTodos() {
    todoItems.innerHTML = '';
    this.#todos.forEach(todo => this.#displayTodo(todo));
  }

  #displayItemsLeft() {
    const activeItemsLeft = this.#todos.reduce(
      (acc, todo) => (todo.completed === false ? acc + 1 : acc),
      0
    );
    itemsLeft.textContent = activeItemsLeft;
  }

  #toggleTheme() {
    //toggle dark/light mode
    document.querySelector('body').classList.toggle('light');
  }

  #setLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(this.#todos));
  }

  #getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('todos'));
    if (!data) return;
    this.#todos = data;
    this.#displayAllTodos();
  }
}

const app = new App();
