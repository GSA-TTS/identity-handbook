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

  const localHours = localDate.getHours();
  const localMinutes = localDate.getMinutes();

  return [
    String(localHours === 0 ? 12 : localHours % 12),
    localMinutes > 0 ? `:${String(localMinutes).padStart(2, "0")}` : "",
    localHours > 12 ? "pm" : "am",
  ].join("");
}
