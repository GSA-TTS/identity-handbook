import { render, Fragment } from "preact";
import { useEffect } from "preact/hooks";
import { createPortal } from "preact/compat";
import { useQuery } from "preact-fetching";
import { useCurrentUser, PrivateLoginLink } from "./private";
import { Alert } from "./components/alert";
import { urlify } from "./components/anchor-link";
import { Sidenav } from "./components/sidenav";
import { Heading } from "./components/heading";

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

function Event({ event }: { event: AnalyticsEvent }) {
  const {
    event_name: eventName,
    previous_event_names: previousEventNames,
    description,
    attributes = [],
  } = event;

  return (
    <div>
      <Heading level="h3">{eventName}</Heading>
      <p>{description}</p>
      {previousEventNames?.length ? (
        <>
          <Heading level="h4" id={urlify(`${eventName} Previous`)}>
            Previous Event Names
          </Heading>
          <ul>
            {previousEventNames.map((name) => (
              <li>{name}</li>
            ))}
          </ul>
        </>
      ) : undefined}
      {attributes?.length ? (
        <>
          <Heading level="h4" id={urlify(`${eventName} Attributes`)}>
            Attributes
          </Heading>
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
      <Heading level="h4" id={urlify(`${eventName} Example`)}>
        Example
      </Heading>
      <Example
        event_name={eventName}
        previous_event_names={previousEventNames}
        attributes={attributes}
      />
    </div>
  );
}

function Events({
  events,
  sidenav,
}: {
  events: AnalyticsEvent[];
  sidenav: HTMLElement;
}) {
  const navigation = events.map(({ event_name: name }) => name);

  return (
    <>
      {events.map((event) => (
        <Event event={event} />
      ))}
      {createPortal(<Sidenav navigation={navigation} />, sidenav)}
    </>
  );
}

function ErrorPage({ error, url }: { error: Error; url: string }) {
  return (
    <Alert heading="Error loading event definitions">
      <p>
        There was an error loading event definitions from{" "}
        <a href={url}>{url}</a>:
      </p>
      <p>{error.message}</p>
    </Alert>
  );
}

function AnalyticsEvents({
  eventsUrl,
  sidenav,
  headerToReplace,
}: {
  eventsUrl: string;
  sidenav: HTMLElement;
  headerToReplace: HTMLElement;
}) {
  const [currentUser] = useCurrentUser();

  const { data, isError, error } = useQuery(
    `analyticsEvents:${eventsUrl}`,
    () =>
      currentUser &&
      window
        .fetch(eventsUrl)
        .then((response) => response.json())
        .then(({ events }: { events: AnalyticsEvent[] }) => events)
  );

  useEffect(() => {
    headerToReplace.hidden = true;
  });

  if (currentUser) {
    if (isError) {
      return <ErrorPage url={eventsUrl} error={error} />;
    }
    return <Events events={data || []} sidenav={sidenav} />;
  }
  return (
    <Alert heading="Error loading event definitions">
      Event definitions require <PrivateLoginLink />
    </Alert>
  );
}

export function loadAnalyticsEvents() {
  const container = document.querySelector("#events-container") as HTMLElement;
  const sidenav = document.querySelector(
    "#sidenav .usa-sidenav__sublist:last-child"
  ) as HTMLElement;

  const headerToReplace = document.querySelector("#event-list") as HTMLElement;
  const { idpBaseUrl } = container.dataset;
  const eventsUrl = `${idpBaseUrl}/api/analytics-events`;

  render(
    <AnalyticsEvents
      eventsUrl={eventsUrl}
      headerToReplace={headerToReplace}
      sidenav={sidenav}
    />,
    container
  );
}
