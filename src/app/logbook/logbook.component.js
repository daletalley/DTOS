import { DataService } from '../data.service.js';

export class LogbookComponent {
  constructor(root) {
    this.root = root;
    this.entries = DataService.load('logbook', []);
    this.render();
  }

  save() {
    DataService.save('logbook', this.entries);
  }

  addEntry(text) {
    this.entries.push({ text, date: new Date() });
    this.save();
    this.render();
  }

  render() {
    this.root.innerHTML = `
      <h2>Logbook</h2>
      <input type="text" id="search" placeholder="Search" />
      <ul id="entries"></ul>
    `;
    const list = this.root.querySelector('#entries');
    const renderList = (filter = '') => {
      list.innerHTML = this.entries
        .filter(e => e.text.toLowerCase().includes(filter.toLowerCase()))
        .map(e => `<li>${e.date ? new Date(e.date).toLocaleString() : ''}: ${e.text}</li>`)
        .join('');
    };
    renderList();
    this.root.querySelector('#search').addEventListener('input', e => {
      renderList(e.target.value);
    });
  }
}
