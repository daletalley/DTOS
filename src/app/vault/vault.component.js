export class VaultComponent {
  constructor(root) {
    this.root = root;
    this.unlocked = false;
    this.passwords = [];
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
      this.root.querySelector('#unlock-form').addEventListener('submit', e => {
        e.preventDefault();
        this.unlocked = true; // placeholder
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
        this.render();
      });
      this.root.querySelector('#pw-form').addEventListener('submit', e => {
        e.preventDefault();
        const site = this.root.querySelector('#site').value;
        const pw = this.root.querySelector('#pw').value;
        this.passwords.push({ site, pw });
        this.render();
      });
      const list = this.root.querySelector('#pw-list');
      list.innerHTML = this.passwords
        .map(p => `<li>${p.site}: ${p.pw}</li>`)
        .join('');
    }
  }
}
