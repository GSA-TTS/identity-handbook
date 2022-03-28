import { h, ComponentChildren } from "preact";

export function Alert({
  heading,
  children,
}: {
  heading?: string;
  children: ComponentChildren;
}) {
  return (
    <div className="usa-alert usa-alert--error">
      <div className="usa-alert__body">
        {heading && <h5 className="usa-alert__heading">{heading}</h5>}
        <div className="usa-alert__text">{children}</div>
      </div>
    </div>
  );
}
