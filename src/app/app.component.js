import { TasksComponent } from './tasks/tasks.component.js';
import { LogbookComponent } from './logbook/logbook.component.js';
import { QuickNotesComponent } from './quicknotes/quicknotes.component.js';
import { VaultComponent } from './vault/vault.component.js';
import { SettingsComponent } from './settings/settings.component.js';
import { DataService } from './data.service.js';

export class AppComponent {
  constructor(root) {
    this.root = root;
    this.current = null;
    this.tasksComponent = null;
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
        if (!this.tasksComponent) {
          this.tasksComponent = new TasksComponent(this.content);
        } else {
          this.tasksComponent.root = this.content;
          this.tasksComponent.render();
        }
        this.current = this.tasksComponent;
        this.currentType = 'tasks';
        break;
      case 'logbook':
        this.current = new LogbookComponent(this.content);
        this.currentType = 'logbook';
        break;
      case 'notes':
        this.current = new QuickNotesComponent(this.content);
        this.currentType = 'notes';
        this.content.addEventListener('sendToTask', e => {
          if (!this.tasksComponent) {
            this.tasksComponent = new TasksComponent(document.createElement('div'));
          }
          this.tasksComponent.addTask(e.detail.title, '', '');
          DataService.save('tasks', this.tasksComponent.tasks);
        });
        break;
      case 'vault':
        this.current = new VaultComponent(this.content);
        this.currentType = 'vault';
        break;
      case 'settings':
        this.current = new SettingsComponent(this.content);
        this.currentType = 'settings';
        break;
    }
  }
}
