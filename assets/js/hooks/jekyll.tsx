export function useJekyllBaseUrl() {
  const jekyllBaseUrl = document.body.dataset.baseUrl as string;
  return jekyllBaseUrl;
}
