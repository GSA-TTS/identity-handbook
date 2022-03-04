import { h, Component, render } from '../../preact.module.js';
import htm from '../../htm.module.js';

// Copied from https://github.com/bryanbraun/anchorjs
const urlify = new function() {
  // hax to make the below copy-paste more easily
  this.options = { truncate: 64 };

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

  // hax to make the above copy-paste more easily
  this.urlify = this.urlify.bind(this);
}().urlify;

window.urlify = urlify;

const html = htm.bind(h);

function Anchor({ slug, icon = '\u00a7' }) {
  const setRef = (dom) => {
    if (dom && document.location.hash.slice(1) === slug) {
      setTimeout(() => dom.scrollIntoView(), 0);
    }
  }

  return html`
    <a ref=${setRef}
       class="anchorjs-link"
       aria-label="Anchor"
       data-anchorjs-icon=${icon}
       id=${slug}
       href=${`#${slug}`}
       style="font: 1em / 1 anchorjs-icons; padding-left: 0.375em;"></a>`;
}

function Example({ event_name, attributes }) {
  function typeExample(type) {
    switch(type) {
      case 'Boolean':
        return ['true', 'false'];
      case 'Integer':
        return 0;
      case 'Hash':
        return '{}';
      default:
        return type;
    }
  }

  const attributeExamples = attributes.flatMap(({ name, types, description }) => {
    const value = types.flatMap((type) => typeExample(type)).join(' | ');

    let example = [`${name}: ${value},`];

    if (description) {
      example.unshift(`// ${description}`);
    }

    return example;
  });

  if (attributeExamples.length) {
    attributeExamples.unshift('');
    attributeExamples.push('');
  }

  const eventProperties = attributeExamples.
    join("\n      ").
    replace(/(  $)/, ''); // fix last line indentation

  const example = `{
  name: ${JSON.stringify(event_name)},
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
      ${ types?.length ? html`${' '}<span>(${types.join(', ')})</span>` : undefined }
      <p>${description}</p>
    </li>
  `;
}

function Event({ event_name, description, attributes = [] }) {
  return html`
    <div>
      <h3>
        ${event_name}
        <${Anchor} slug=${urlify(event_name)} />
      </h3>
      <p>${description}</p>

      ${
        attributes?.length ? html`
          <h4>
            Attributes
            <${Anchor} slug=${urlify(event_name + ' Attributes')} />
          </h4>
          <ul>
            ${attributes.map((attribute) => html`<${Attribute} ...${attribute} />` )}
          </ul>
        ` : undefined
      }

      <h4>
        Example
        <${Anchor} slug=${urlify(event_name + ' Example')} />
      </h4>
      <${Example} event_name=${event_name} attributes=${attributes} />
    </div>
  `;
}

function Events({ events }) {
  return html`${events.map((event) =>
    html`<${Event} ...${event} />`
  )}`;
}

function SidebarNavItem({ name }) {
  return html`
    <li class="usa-sidenav__item">
      <a href=${`#${urlify(name)}`}>${name}</a>
    </li>
   `;
}

function Sidenav({ events }) {
  return html`${events.map(({ event_name: name }) =>
    html`<${SidebarNavItem} name=${name} />`
  )}`;
}

const container = document.querySelector('#events-container');
const { idpBaseUrl } = container.dataset;

const sidenav = document.querySelector('#sidenav');

window.fetch(`${idpBaseUrl}/api/analytics-events`)
  .then((response) => response.json())
  .then(({ events }) => {
    render(html`<${Events} events=${events} />`, container);
    render(html`<${Sidenav} events=${events} />`, sidenav);
  });
