import Anchor from "anchor-js";

const anchor = new Anchor();

export const urlify = anchor.urlify.bind(anchor);
