export function localTimezoneName() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * @param utcTime string of time in UTC such as "5pm", "6am", "6:30am"
 * @return converted to local time such as "8pm", "2:30pm"
 */
export function convertToLocal(utcTime: string) {
  const match = utcTime.match(/(\d+)(:(\d+))?\s*([ap].?m)/i);

  if (!match) {
    return "N/A";
  }

  const [, hourStr, , minuteStr, ampm] = match;

  const ampmOffset = ampm.toLowerCase().startsWith("p") ? 12 : 0;

  const localDate = new Date(Date.now());
  localDate.setUTCHours(parseInt(hourStr, 10) + ampmOffset);
  if (minuteStr) {
    localDate.setUTCMinutes(parseInt(minuteStr, 10));
  } else {
    localDate.setUTCMinutes(0);
  }

  // Comes back like "7:01 PM"
  const formatted = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(localDate);

  return formatted.toLowerCase().replace(" ", "").replace(":00", "");
}

class LocalZoneNameElement extends HTMLElement {
  connectedCallback() {
    this.textContent = localTimezoneName();
  }
}

class LocalTimeElement extends HTMLElement {
  connectedCallback() {
    const utcTime = this.getAttribute("utc");
    if (utcTime) {
      this.textContent = convertToLocal(utcTime);
    }
  }
}

export function installCustomTimeElements() {
  customElements.define("lg-local-zone-name", LocalZoneNameElement);
  customElements.define("lg-local-time", LocalTimeElement);
}

