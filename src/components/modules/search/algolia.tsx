import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

import algoliasearch from 'algoliasearch/lite';

import { getEnv } from '@/lib/env';

const searchClient = algoliasearch(
  getEnv('ALGOLIA_APP_ID') || '',
  getEnv('ALGOLIA_SECRET') || ''
);

const AlgoliaSearch = () => (
  <InstantSearch searchClient={searchClient} indexName="coanime.net">
    <SearchBox />
    <Hits />
  </InstantSearch>
);

export default AlgoliaSearch;
