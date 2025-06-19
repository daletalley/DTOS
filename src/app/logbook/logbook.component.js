export class LogbookComponent {
  constructor(root) {
    this.root = root;
    this.entries = [];
    this.render();
  }

  addEntry(text) {
    this.entries.push({ text, date: new Date() });
    this.render();
  }

  render() {
    this.root.innerHTML = `
      <h2>Logbook</h2>
      <ul>
        ${this.entries.map(e => `<li>${e.date.toLocaleString()}: ${e.text}</li>`).join('')}
      </ul>
    `;
  }
}
