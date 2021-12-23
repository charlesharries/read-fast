import { Route, Router } from 'preact-router';
import { JSX } from 'preact/jsx-runtime';
import { BookProvider } from '../lib/book';
import { LibraryProvider } from '../lib/library';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Error404 from '../routes/error404';

const App = (): JSX.Element => (
  <div id="app">
    <BookProvider>
      <LibraryProvider>
        <Router>
          <Route path="/" component={Home} />
          <Route default component={Error404} />
        </Router>
      </LibraryProvider>
    </BookProvider>
  </div>
);

export default App;
