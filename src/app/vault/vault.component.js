import { DataService } from '../data.service.js';
import { CryptoService } from '../crypto.service.js';

export class VaultComponent {
  constructor(root) {
    this.root = root;
    this.unlocked = false;
    this.passwords = DataService.load('vault', []);
    this.masterHash = DataService.load('masterHash', null);
    this.render();
  }

  render() {
    if (!this.unlocked) {
      this.root.innerHTML = `
        <h2>Vault</h2>
        <form id="unlock-form">
          <input type="password" id="master" placeholder="Master password" required />
          <button type="submit">Unlock</button>
        </form>
      `;
      this.root.querySelector('#unlock-form').addEventListener('submit', async e => {
        e.preventDefault();
        const pass = this.root.querySelector('#master').value;
        if (!this.masterHash) {
          this.masterHash = await CryptoService.encrypt('verify', pass);
          DataService.save('masterHash', this.masterHash);
        } else {
          try {
            await CryptoService.decrypt(this.masterHash, pass);
          } catch {
            alert('Wrong password');
            return;
          }
        }
        this.master = pass;
        this.unlocked = true;
        this.render();
      });
    } else {
      this.root.innerHTML = `
        <h2>Vault</h2>
        <button id="lock">Lock</button>
        <ul id="pw-list"></ul>
        <form id="pw-form">
          <input type="text" id="site" placeholder="Site" required />
          <input type="text" id="pw" placeholder="Password" required />
          <button type="submit">Add</button>
        </form>
      `;
      this.root.querySelector('#lock').addEventListener('click', () => {
        this.unlocked = false;
        this.master = '';
        this.render();
      });
      this.root.querySelector('#pw-form').addEventListener('submit', e => {
        e.preventDefault();
        const site = this.root.querySelector('#site').value;
        const pw = this.root.querySelector('#pw').value;
        CryptoService.encrypt(pw, this.master).then(enc => {
          this.passwords.push({ site, pw: enc });
          DataService.save('vault', this.passwords);
          this.render();
        });
      });
      const list = this.root.querySelector('#pw-list');
      Promise.all(
        this.passwords.map(async p => {
          const pw = await CryptoService.decrypt(p.pw, this.master);
          return `<li>${p.site}: ${pw}</li>`;
        })
      ).then(items => {
        list.innerHTML = items.join('');
      });
    }
  }
}
