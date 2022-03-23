import { h, render, Fragment, VNode } from "preact";
import Anchor from "anchor-js";
import { loggedInUser } from "./private";

interface AnalyticsEventAttribute {
  name: string;
  types: string[];
  description: string;
}

interface AnalyticsEvent {
  event_name: string;
  previous_event_names?: string[];
  description: string;
  attributes: AnalyticsEventAttribute[];
}

const anchor = new Anchor();
const urlify = anchor.urlify.bind(anchor);

function AnchorLink({
  slug,
  icon = String.fromCharCode(59851),
}: {
  slug: string;
  icon?: string;
}) {
  const setRef = (node: HTMLElement | null) => {
    if (node && document.location.hash.slice(1) === slug) {
      setTimeout(() => node.scrollIntoView(), 0);
    }
  };

  return (
    // See: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/423
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      ref={setRef}
      className="anchorjs-link"
      aria-label="Anchor"
      data-anchorjs-icon={icon}
      id={slug}
      href={`#${slug}`}
      style={{ font: "1em / 1 anchorjs-icons", paddingLeft: "0.375em" }}
    />
  );
}

function Example({
  event_name: eventName,
  previous_event_names: previousEventNames,
  attributes,
}: Pick<AnalyticsEvent, "event_name" | "previous_event_names" | "attributes">) {
  function typeExample(type: string) {
    switch (type) {
      case "Boolean":
        return ["true", "false"];
      case "Integer":
        return 0;
      case "Hash":
        return "{}";
      default:
        return type;
    }
  }

  const attributeExamples = attributes.flatMap(
    ({ name, types, description }) => {
      const value = types.flatMap((type) => typeExample(type)).join(" | ");

      const example = [`${name}: ${value},`];

      if (description) {
        example.unshift(`// ${description}`);
      }

      return example;
    }
  );

  if (attributeExamples.length) {
    attributeExamples.unshift("");
    attributeExamples.push("");
  }

  const eventProperties = attributeExamples
    .join("\n      ")
    .replace(/ {2}$/, ""); // fix last line indentation

  const names = [eventName, ...(previousEventNames || [])]
    .map((s) => JSON.stringify(s))
    .join(" | ");

  const example = `{
  name: ${names},
  properties: {
    event_properties: {${eventProperties}}
  }
}`;

  return (
    <code>
      <pre className="overflow-x-scroll">{example}</pre>
    </code>
  );
}

function Attribute({ name, types, description }: AnalyticsEventAttribute) {
  return (
    <li>
      <kbd>{name}</kbd>
      {types?.length > 0 && (
        <>
          {" "}
          <span>({types.join(", ")})</span>
        </>
      )}
      <p>{description}</p>
    </li>
  );
}

function Event({
  event_name: eventName,
  previous_event_names: previousEventNames,
  description,
  attributes = [],
}: AnalyticsEvent) {
  return (
    <div>
      <h3>
        {eventName}
        <AnchorLink slug={urlify(eventName)} />
      </h3>
      <p>{description}</p>
      {previousEventNames?.length ? (
        <>
          <h4>
            Previous Event Names
            <AnchorLink slug={urlify(`${eventName} Previous`)} />
          </h4>
          <ul>
            {previousEventNames.map((name) => (
              <li>{name}</li>
            ))}
          </ul>
        </>
      ) : undefined}
      {attributes?.length ? (
        <>
          <h4>
            Attributes
            <AnchorLink slug={urlify(`${eventName} Attributes`)} />
          </h4>
          <details>
            <summary>Show attribute details</summary>
            <ul>
              {attributes.map((attribute) => (
                <Attribute {...attribute} />
              ))}
            </ul>
          </details>
        </>
      ) : undefined}
      <h4>
        Example
        <AnchorLink slug={urlify(`${eventName} Example`)} />
      </h4>
      <Example
        event_name={eventName}
        previous_event_names={previousEventNames}
        attributes={attributes}
      />
    </div>
  );
}

function Events({ events }: { events: AnalyticsEvent[] }) {
  return (
    <>
      {events.map((event) => (
        <Event {...event} />
      ))}
    </>
  );
}

function SidebarNavItem({ name }: { name: string }) {
  return (
    <li className="usa-sidenav__item">
      <a href={`#${urlify(name)}`}>{name}</a>
    </li>
  );
}

function AlertComponent({
  heading,
  content,
}: {
  heading?: string;
  content?: VNode | string;
}) {
  return (
    <div className="usa-alert usa-alert--error">
      <div className="usa-alert__body">
        <h5 className="usa-alert__heading">{heading}</h5>
        <div className="usa-alert__text">{content}</div>
      </div>
    </div>
  );
}

function ErrorPage({ error, url }: { error: Error, url: string }) {
  return AlertComponent({
    heading: "Error loading event definitions",
    content: (
      <>
        <p>
          There was an error loading event definitions from{" "}
          <a href={url}>{url}</a>:
        </p>
        <p>{error.message}</p>
      </>
    ),
  });
}

function Sidenav({ events }: { events: AnalyticsEvent[] }) {
  return (
    <>
      {events.map(({ event_name: name }) => (
        <SidebarNavItem name={name} />
      ))}
    </>
  );
}

export function loadAnalyticsEvents() {
  const container = document.querySelector("#events-container") as HTMLElement;

  if (loggedInUser()) {
    const { idpBaseUrl } = container.dataset;
    const eventsUrl = `${idpBaseUrl}/api/analytics-events`;

    const sidenav = document.querySelector(
      "#sidenav .usa-sidenav__sublist:last-child"
    ) as HTMLElement;

    window
      .fetch(eventsUrl)
      .then((response) => response.json())
      .then(({ events }) => {
        render(<Events events={events} />, container);
        render(<Sidenav events={events} />, sidenav);

        const headerToReplace = document.querySelector(
          "#event-list"
        ) as HTMLElement;
        if (headerToReplace) {
          headerToReplace.hidden = true;
        }
      })
      .catch((error) =>
        render(<ErrorPage url={eventsUrl} error={error} />, container)
      );
  } else {
    render(
      <AlertComponent
        heading="Error loading event definitions"
        content="Please log in"
      />,
      container
    );
  }
}
