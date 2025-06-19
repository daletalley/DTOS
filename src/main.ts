import { AppComponent } from './app/app.component.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('app-root');
  if (root) {
    new AppComponent(root as HTMLElement);
  }
});
