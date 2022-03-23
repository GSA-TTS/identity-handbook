declare module "@18f/private-eye" {
  export default function PrivateEye(params: {
    defaultMessage: string;
    ignoreUrls: string[];
  }): void;
}
