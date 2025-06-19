export class TasksComponent {
  constructor(root) {
    this.root = root;
    this.tasks = [];
    this.render();
  }

  addTask(title) {
    this.tasks.push({ title, completed: false });
    this.render();
  }

  toggleTask(index) {
    this.tasks[index].completed = !this.tasks[index].completed;
    this.render();
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    this.render();
  }

  render() {
    this.root.innerHTML = `
      <h2>Command Tasks</h2>
      <form id="task-form">
        <input type="text" id="task-title" placeholder="New task" required />
        <button type="submit">Add</button>
      </form>
      <ul id="task-list"></ul>
    `;
    const form = this.root.querySelector('#task-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('#task-title');
      this.addTask(input.value);
      input.value = '';
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
