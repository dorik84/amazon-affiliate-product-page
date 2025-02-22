declare global {
  interface Window {
    // The value parameter in gtag can be either a number or string according to Google Analytics documentation
    // See: https://developers.google.com/analytics/devguides/collection/gtagjs/events
    gtag: (
      command: "event",
      action: string,
      params: {
        event_category: string;
        event_label?: string;
        value?: number | string;
        [key: string]: any;
      }
    ) => void;
  }
}

// According to Google Analytics documentation, the event value can be either a number or string
// Updating the value parameter type to reflect this
export const sendGAEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number | string,
  additionalParams: { [key: string]: any } = {}
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...additionalParams,
    });
  }
};
