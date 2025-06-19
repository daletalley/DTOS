import { TasksComponent } from './tasks/tasks.component.js';
import { LogbookComponent } from './logbook/logbook.component.js';
import { QuickNotesComponent } from './quicknotes/quicknotes.component.js';
import { VaultComponent } from './vault/vault.component.js';
import { SettingsComponent } from './settings/settings.component.js';

export class AppComponent {
  constructor(root) {
    this.root = root;
    this.current = null;
    this.render();
  }

  render() {
    this.root.innerHTML = `
      <nav class="tabs">
        <button id="tasks-tab" class="active">Tasks</button>
        <button id="logbook-tab">Logbook</button>
        <button id="notes-tab">Notes</button>
        <button id="vault-tab">Vault</button>
        <button id="settings-tab">Settings</button>
      </nav>
      <div id="content"></div>
    `;
    this.content = document.getElementById('content');
    this.bindNav();
    this.show('tasks');
  }

  bindNav() {
    this.root.querySelector('#tasks-tab').addEventListener('click', () => this.show('tasks'));
    this.root.querySelector('#logbook-tab').addEventListener('click', () => this.show('logbook'));
    this.root.querySelector('#notes-tab').addEventListener('click', () => this.show('notes'));
    this.root.querySelector('#vault-tab').addEventListener('click', () => this.show('vault'));
    this.root.querySelector('#settings-tab').addEventListener('click', () => this.show('settings'));
  }

  show(tab) {
    this.root.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    this.root.querySelector(`#${tab}-tab`).classList.add('active');
    this.content.innerHTML = '';
    switch(tab) {
      case 'tasks':
        this.current = new TasksComponent(this.content);
        break;
      case 'logbook':
        this.current = new LogbookComponent(this.content);
        break;
      case 'notes':
        this.current = new QuickNotesComponent(this.content);
        break;
      case 'vault':
        this.current = new VaultComponent(this.content);
        break;
      case 'settings':
        this.current = new SettingsComponent(this.content);
        break;
    }
  }
}
