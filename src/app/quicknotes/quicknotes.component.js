import { DataService } from '../data.service.js';

export class QuickNotesComponent {
  constructor(root) {
    this.root = root;
    this.notes = DataService.load('notes', []);
    this.render();
  }

  save() {
    DataService.save('notes', this.notes);
  }

  addNote(title, content) {
    this.notes.push({ title, content });
    this.save();
    this.render();
  }

  render() {
    this.root.innerHTML = `
      <h2>QuickNotes</h2>
      <form id="note-form">
        <input type="text" id="note-title" placeholder="Title" required />
        <textarea id="note-content" placeholder="Note" required></textarea>
        <button type="submit">Add</button>
      </form>
      <input type="text" id="search" placeholder="Search" />
      <ul id="note-list"></ul>
    `;
    const form = this.root.querySelector('#note-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const title = form.querySelector('#note-title').value;
      const content = form.querySelector('#note-content').value;
      this.addNote(title, content);
      form.reset();
    });
    const list = this.root.querySelector('#note-list');
    const renderList = (filter = '') => {
      list.innerHTML = this.notes
        .filter(n =>
          n.title.toLowerCase().includes(filter.toLowerCase()) ||
          n.content.toLowerCase().includes(filter.toLowerCase())
        )
        .map(
          (n, i) =>
            `<li><strong>${n.title}</strong><p>${n.content}</p><button data-i="${i}" data-send>To Task</button></li>`
        )
        .join('');
      list.querySelectorAll('button[data-send]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.i, 10);
          const event = new CustomEvent('sendToTask', { detail: this.notes[idx] });
          this.root.dispatchEvent(event);
        });
      });
    };
    renderList();
    this.root.querySelector('#search').addEventListener('input', e => {
      renderList(e.target.value);
    });
  }
}
