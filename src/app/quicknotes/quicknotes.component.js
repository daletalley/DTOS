export class QuickNotesComponent {
  constructor(root) {
    this.root = root;
    this.notes = [];
    this.render();
  }

  addNote(title, content) {
    this.notes.push({ title, content });
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
    list.innerHTML = this.notes
      .map(n => `<li><strong>${n.title}</strong><p>${n.content}</p></li>`)
      .join('');
  }
}
