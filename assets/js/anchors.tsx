import Anchor from "anchor-js";

export const loadAnchors = () => {
  new Anchor().add('#main-content h2, #main-content h3, #main-content [data-anchor]');
}