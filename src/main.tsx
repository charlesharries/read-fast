import { render } from 'preact';
import './style/index.scss';
import App from './components/app';

const root = document.getElementById('root');
if (root) {
  render(<App />, root);
}
