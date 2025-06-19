import { DataService } from '../data.service.js';

export class SettingsComponent {
  constructor(root) {
    this.root = root;
    this.dark = DataService.load('theme', 'light') === 'dark';
    this.applyTheme();
    this.render();
  }

  applyTheme() {
    document.body.style.background = this.dark ? '#333' : '#f5f5f5';
    document.body.style.color = this.dark ? '#fff' : '#333';
    DataService.save('theme', this.dark ? 'dark' : 'light');
  }

  render() {
    this.root.innerHTML = `
      <h2>Settings</h2>
      <button id="theme-toggle">Toggle Theme</button>
      <button id="export">Export Data</button>
      <input type="file" id="import" style="display:none" />
      <button id="import-btn">Import Data</button>
      <button id="reset">Reset</button>
    `;
    this.root.querySelector('#theme-toggle').addEventListener('click', () => {
      this.dark = !this.dark;
      this.applyTheme();
    });
    this.root.querySelector('#export').addEventListener('click', () => {
      const data = {
        tasks: DataService.load('tasks', []),
        logbook: DataService.load('logbook', []),
        notes: DataService.load('notes', []),
        vault: DataService.load('vault', []),
        theme: DataService.load('theme', 'light'),
        masterHash: DataService.load('masterHash', null)
      };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'command-central-backup.json';
      a.click();
      URL.revokeObjectURL(url);
    });
    const fileInput = this.root.querySelector('#import');
    this.root.querySelector('#import-btn').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          Object.keys(data).forEach(k => DataService.save(k, data[k]));
          location.reload();
        } catch {
          alert('Invalid file');
        }
      };
      reader.readAsText(file);
    });
    this.root.querySelector('#reset').addEventListener('click', () => {
      if (confirm('Clear all data?')) {
        localStorage.clear();
        location.reload();
      }
    });
  }
}
