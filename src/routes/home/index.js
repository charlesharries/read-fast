import { h } from 'preact';
import Uploader from '../../components/uploader';
import TableOfContents from '../../components/toc';
import Content from '../../components/content';

function Home() {
	return (
		<div>
			<Uploader />
			<TableOfContents />
			<Content />
		</div>
	)
}

export default Home;
