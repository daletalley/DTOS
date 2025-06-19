export class SettingsComponent {
  constructor(root) {
    this.root = root;
    this.dark = false;
    this.render();
  }

  render() {
    this.root.innerHTML = `
      <h2>Settings</h2>
      <button id="theme-toggle">Toggle Theme</button>
    `;
    this.root.querySelector('#theme-toggle').addEventListener('click', () => {
      this.dark = !this.dark;
      document.body.style.background = this.dark ? '#333' : '#f5f5f5';
      document.body.style.color = this.dark ? '#fff' : '#333';
    });
  }
}
