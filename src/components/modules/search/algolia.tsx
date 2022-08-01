import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SECRET
);

const AlgoliaSearch = () => (
  <InstantSearch searchClient={searchClient} indexName="coanime.net">
    <SearchBox />
    <Hits />
  </InstantSearch>
);

export default AlgoliaSearch;
