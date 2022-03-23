declare module "anchor-js" {
  interface Anchor {
    add(selector?: string): Anchor;
    urlify(value: string): string;
  }

  interface AnchorStatic {
    new (): Anchor;
  }

  const AnchorJS: AnchorStatic;
  export default AnchorJS;
}
