import { h } from 'preact';
import Uploader from '../../components/uploader';
import TableOfContents from '../../components/toc';

function Home() {
	return (
		<div>
			<Uploader />
			<TableOfContents />
		</div>
	)
}

export default Home;
