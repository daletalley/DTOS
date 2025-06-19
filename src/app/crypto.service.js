export class CryptoService {
  static async deriveKey(password, salt) {
    const enc = new TextEncoder();
    const passKey = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: enc.encode(salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      passKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(text, password) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(password, 'cc-salt');
    const enc = new TextEncoder();
    const cipher = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(text)
    );
    return `${btoa(String.fromCharCode(...iv))}|${btoa(String.fromCharCode(...new Uint8Array(cipher)))}`;
  }

  static async decrypt(data, password) {
    const [ivStr, cipherStr] = data.split('|');
    const iv = Uint8Array.from(atob(ivStr), c => c.charCodeAt(0));
    const cipher = Uint8Array.from(atob(cipherStr), c => c.charCodeAt(0));
    const key = await this.deriveKey(password, 'cc-salt');
    const plain = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipher
    );
    return new TextDecoder().decode(plain);
  }
}
