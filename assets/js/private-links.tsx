import PrivateEye from "@18f/private-eye";

export const loadPrivateEye = () => {
  // eslint-disable-next-line no-new
  new PrivateEye({
    defaultMessage: "This link is private to TTS.",
    ignoreUrls: [
      "18f.slack.com",
      "anywhere.gsa.gov",
      "bookit.gsa.gov",
      "calendar.gsa.gov",
      "cm-jira.usa.gov",
      "connect.gsa.gov",
      "docs.google.com",
      "drive.google.com",
      "ea.gsa.gov",
      "email.gsa.gov",
      "gcims.gsa.gov",
      "github.com/18f/identity-devops",
      "github.com/18f/identity-devops-private",
      "github.com/18f/identity-handbook-private",
      "github.com/18f/identity-idp-config",
      "gkey.gsa.gov",
      "gsa-tts.slack.com",
      "gsa.my.salesforce.com",
      "gsaolu.gsa.gov",
      "hrprod.hr.gsa.gov",
      "insite.gsa.gov",
      "login-gov.app.opsgenie.com",
      "login-handbook.app.cloud.gov",
      "mail.gsa.gov",
      "meet.gsa.gov",
      "pages-internal.18f.gov",
      "one.newrelic.com",
      "rpm.newrelic.com",
      "tock.18f.gov",
      "figma.com",
      "dashboard.fr.cloud.gov",
      "trello.com/b",
    ],
  });
};
