import { Router } from 'preact-router';
import { BookProvider } from '../lib/book';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Error404 from '../routes/error404';

const App = () => (
  <div id="app">
    <BookProvider>
      <Router>
        <Home path="/" />
        <Error404 default />
      </Router>
    </BookProvider>
  </div>
);

export default App;
