import { DataService } from '../data.service.js';

export class TasksComponent {
  constructor(root) {
    this.root = root;
    this.tasks = DataService.load('tasks', []);
    this.logbook = DataService.load('logbook', []);
    this.render();
  }

  save() {
    DataService.save('tasks', this.tasks);
    DataService.save('logbook', this.logbook);
  }

  addTask(title, tags = '', due = '') {
    this.tasks.push({ title, tags, due, completed: false, created: new Date() });
    this.save();
    this.render();
  }

  toggleTask(index) {
    this.tasks[index].completed = !this.tasks[index].completed;
    if (this.tasks[index].completed) {
      this.logbook.push({
        text: this.tasks[index].title,
        date: new Date(),
        tags: this.tasks[index].tags,
        priority: this.tasks[index].priority || ''
      });
    }
    this.save();
    this.render();
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    this.save();
    this.render();
  }

  render() {
    this.root.innerHTML = `
      <h2>Command Tasks</h2>
      <form id="task-form">
        <input type="text" id="task-title" placeholder="New task" required />
        <input type="text" id="task-tags" placeholder="Tags" />
        <input type="date" id="task-due" />
        <select id="task-priority">
          <option value="">Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Add</button>
      </form>
      <ul id="task-list"></ul>
    `;
    const form = this.root.querySelector('#task-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const title = form.querySelector('#task-title').value;
      const tags = form.querySelector('#task-tags').value;
      const due = form.querySelector('#task-due').value;
      const priority = form.querySelector('#task-priority').value;
      this.addTask(title, tags, due);
      this.tasks[this.tasks.length - 1].priority = priority;
      form.reset();
    });
    const list = this.root.querySelector('#task-list');
    list.innerHTML = this.tasks
      .map((t, i) => `<li>${t.completed ? '✅' : ''} ${t.title}
        <button data-t="toggle" data-i="${i}">Toggle</button>
        <button data-t="delete" data-i="${i}">Delete</button></li>`)
      .join('');
    list.querySelectorAll('button').forEach(btn => {
      const i = parseInt(btn.dataset.i, 10);
      if (btn.dataset.t === 'toggle') {
        btn.addEventListener('click', () => this.toggleTask(i));
      } else {
        btn.addEventListener('click', () => this.deleteTask(i));
      }
    });
  }
}
