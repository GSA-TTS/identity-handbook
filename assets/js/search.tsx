import "simple-jekyll-search";
import {
  SimpleJekyllSearchParams,
  SimpleJekyllSearchGlobals,
} from "simple-jekyll-search-types";

export const loadSimpleJekyllSearch = ({
  searchInput,
  resultsContainer,
  json,
  noResultsText,
}: SimpleJekyllSearchParams) =>
  (window as SimpleJekyllSearchGlobals).SimpleJekyllSearch({
    searchInput,
    resultsContainer,
    json,
    noResultsText,
  });
