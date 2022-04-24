export default class Todo {
  id = (Date.now() + '').slice(-10);
  completed = false;
  constructor(text) {
    this.text = text;
  }
}
