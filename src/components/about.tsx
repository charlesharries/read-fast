import { JSX } from 'preact/compat';

export default function About(): JSX.Element {
  return (
    <div className="p-md stack stack--md" style={{ maxWidth: '600px' }}>
      <h1>How to use read-fast</h1>
      <p>
        Load a new EPUB by clicking the 'Add Book' button at left. This will store your EPUB in
        localstorage for you to come back to later. Unfortunately, localstorage has a limit on how
        much data you can store in it--about 5MB on most browsers. Some EPUBs, especially those with
        pictures, can be a bit bigger than that, so you might run into errors trying load em.
      </p>

      <h2>Drawbacks</h2>

      <p>
        This app is more of a proof of concept, so it's not super robust, and wonky e-books can
        knock it over, especially if the internal chapter links aren't set up properly.
      </p>

      <p>
        Really long chapters can also cause the speed to take a serious hit, which sorta defeats the
        purpose here.
      </p>

      <h2>Credit</h2>
      <p>
        <a className="link" href="https://charlesharri.es">
          Charles Harries // 2021
        </a>
      </p>
    </div>
  );
}
