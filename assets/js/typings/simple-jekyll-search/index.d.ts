declare module "simple-jekyll-search-types" {
  function SimpleJekyllSearch(params: SimpleJekyllSearchParams): any;

  export interface SimpleJekyllSearchParams {
    searchInput: HTMLElement;
    resultsContainer: HTMLElement;
    json: string;
    noResultsText: string;
  }

  export type SimpleJekyllSearchGlobals = typeof window & {
    SimpleJekyllSearch: typeof SimpleJekyllSearch;
  };
}
