// eslint-disable-next-line import/no-unresolved
import { h, render } from "../../preact.module.js";
// eslint-disable-next-line import/no-unresolved
import htm from "../../htm.module.js";

// Copied from https://github.com/bryanbraun/anchorjs
const { urlify } = new (function () {
  // hax to make the below copy-paste more easily
  this.options = { truncate: 64 };
  /* eslint-disable */

  /**
   * Urlify - Refine text so it makes a good ID.
   *
   * To do this, we remove apostrophes, replace non-safe characters with hyphens,
   * remove extra hyphens, truncate, trim hyphens, and make lowercase.
   *
   * @param  {String} text - Any text. Usually pulled from the webpage element we are linking to.
   * @return {String}      - hyphen-delimited text for use in IDs and URLs.
   */
  this.urlify = function(text) {
    // Decode HTML characters such as '&nbsp;' first.
    var textareaElement = document.createElement('textarea');
    textareaElement.innerHTML = text;
    text = textareaElement.value;

    // Regex for finding the non-safe URL characters (many need escaping):
    //   & +$,:;=?@"#{}|^~[`%!'<>]./()*\ (newlines, tabs, backspace, vertical tabs, and non-breaking space)
    var nonsafeChars = /[& +$,:;=?@"#{}|^~[`%!'<>\]./()*\\\n\t\b\v\u00A0]/g;

    // The reason we include this _applyRemainingDefaultOptions is so urlify can be called independently,
    // even after setting options. This can be useful for tests or other applications.
    if (!this.options.truncate) {
      _applyRemainingDefaultOptions(this.options);
    }

    // Note: we trim hyphens after truncating because truncating can cause dangling hyphens.
    // Example string:                      // " ⚡⚡ Don't forget: URL fragments should be i18n-friendly, hyphenated, short, and clean."
    return text.trim()                      // "⚡⚡ Don't forget: URL fragments should be i18n-friendly, hyphenated, short, and clean."
      .replace(/'/gi, '')                   // "⚡⚡ Dont forget: URL fragments should be i18n-friendly, hyphenated, short, and clean."
      .replace(nonsafeChars, '-')           // "⚡⚡-Dont-forget--URL-fragments-should-be-i18n-friendly--hyphenated--short--and-clean-"
      .replace(/-{2,}/g, '-')               // "⚡⚡-Dont-forget-URL-fragments-should-be-i18n-friendly-hyphenated-short-and-clean-"
      .substring(0, this.options.truncate)  // "⚡⚡-Dont-forget-URL-fragments-should-be-i18n-friendly-hyphenated-"
      .replace(/^-+|-+$/gm, '')             // "⚡⚡-Dont-forget-URL-fragments-should-be-i18n-friendly-hyphenated"
      .toLowerCase();                       // "⚡⚡-dont-forget-url-fragments-should-be-i18n-friendly-hyphenated"
  };

  /* eslint-enable */
  // hax to make the above copy-paste more easily
  this.urlify = this.urlify.bind(this);
})();

const html = htm.bind(h);

function Anchor({ slug, icon = String.fromCharCode(59851) }) {
  const setRef = (node) => {
    if (node && document.location.hash.slice(1) === slug) {
      setTimeout(() => node.scrollIntoView(), 0);
    }
  };

  return html`<a
    ref=${setRef}
    class="anchorjs-link"
    aria-label="Anchor"
    data-anchorjs-icon=${icon}
    id=${slug}
    href=${`#${slug}`}
    style="font: 1em / 1 anchorjs-icons; padding-left: 0.375em;"
  ></a>`;
}

function Example({
  event_name: eventName,
  previous_event_names: previousEventNames,
  attributes,
}) {
  function typeExample(type) {
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

  return html`<code><pre>${example}</pre></code>`;
}

function Attribute({ name, types, description }) {
  return html`
    <li>
      <kbd>${name}</kbd>
      ${types?.length
        ? html`${" "}<span>(${types.join(", ")})</span>`
        : undefined}
      <p>${description}</p>
    </li>
  `;
}

function Event({
  event_name: eventName,
  previous_event_names: previousEventNames,
  description,
  attributes = [],
}) {
  return html`
    <div>
      <h3>
        ${eventName}
        <${Anchor} slug=${urlify(eventName)} />
      </h3>
      <p>${description}</p>
      ${previousEventNames?.length
        ? html`<h4>
              Previous Event Names
              <${Anchor} slug=${urlify(`${eventName} Previous`)} />
            </h4>
            <ul>
              ${previousEventNames.map((name) => html`<li>${name}</li>`)}
            </ul>`
        : undefined}
      ${attributes?.length
        ? html`<h4>
              Attributes
              <${Anchor} slug=${urlify(`${eventName} Attributes`)} />
            </h4>
            <details>
              <summary>Show attribute details</summary>
              <ul>
                ${attributes.map(
                  (attribute) => html`<${Attribute} ...${attribute} />`
                )}
              </ul>
            </details>`
        : undefined}

      <h4>
        Example
        <${Anchor} slug=${urlify(`${eventName} Example`)} />
      </h4>
      <${Example}
        event_name=${eventName}
        previous_event_names=${previousEventNames}
        attributes=${attributes}
      />
    </div>
  `;
}

function Events({ events }) {
  return events.map((event) => html`<${Event} ...${event} />`);
}

function SidebarNavItem({ name }) {
  return html`
    <li class="usa-sidenav__item">
      <a href=${`#${urlify(name)}`}>${name}</a>
    </li>
  `;
}

function ErrorPage({ error, url }) {
  return html`
    <div class="usa-alert usa-alert--error">
      <div class="usa-alert__body">
        <h5 class="usa-alert__heading">Error loading event definitions</h5>
        <div class="usa-alert__text">
          <p>
            There was an error loading event definitions from
            <a href=${url}>${url}</a>:
          </p>
          <p>${error.message}</p>
        </div>
      </div>
    </div>
  `;
}

function Sidenav({ events }) {
  return events.map(
    ({ event_name: name }) => html`<${SidebarNavItem} name=${name} />`
  );
}

export function loadAnalyticsEvents() {
  const container = document.querySelector("#events-container");
  const { idpBaseUrl } = container.dataset;
  const eventsUrl = `${idpBaseUrl}/api/analytics-events`;

  const sidenav = document.querySelector(
    "#sidenav .usa-sidenav__sublist:last-child"
  );

  window
    .fetch(eventsUrl)
    .then((response) => response.json())
    .then(({ events }) => {
      render(html`<${Events} events=${events} />`, container);
      render(html`<${Sidenav} events=${events} />`, sidenav);

      const headerToReplace = document.querySelector("#event-list");
      if (headerToReplace) {
        headerToReplace.hidden = true;
      }
    })
    .catch((error) =>
      render(html`<${ErrorPage} url=${eventsUrl} error=${error} />`, container)
    );
}
