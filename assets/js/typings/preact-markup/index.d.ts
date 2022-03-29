import { ComponentType, AnyComponent } from "preact";

type Props = {
  markup: string;
  components?: Record<string, AnyComponent<any>>;
  trim?: boolean;
};

declare const Markup: ComponentType<Props>;
export default Markup;
