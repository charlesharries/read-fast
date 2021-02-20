import { h } from 'preact';
import Books from '../../components/books';
import Uploader from '../../components/uploader';
import TableOfContents from '../../components/toc';
import Content from '../../components/content';

function Home() {
  return (
    <div>
      <Books />
      <Uploader />
      <TableOfContents />
      <Content />
    </div>
  );
}

export default Home;
