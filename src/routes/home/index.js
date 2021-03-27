import { h } from 'preact';
import Books from '../../components/library';
import Uploader from '../../components/uploader';
import TableOfContents from '../../components/toc';
import Content from '../../components/content';

function Home() {
  return (
    <div className="page">
      <aside className="sidebar">
        <Uploader />
        <Books />
        <TableOfContents />
      </aside>

      <main className="reader">
        <Content />
      </main>
    </div>
  );
}

export default Home;
