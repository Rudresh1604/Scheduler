const { google } = require("googleapis");

const scheduleMeet = async (
  matchingSlot,
  studentEmail,
  mentorEmail,
  access_token
) => {
  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({
    access_token:
      "ya29.a0AcM612w544P6gAcM0SUivVR3frRboxC8_qYAKnUJT8sp5Ark9-S92p5ROx9P17EE0C0kbO79tyrCT3sdQj80tAPES-85s1isINb2-wga-hPdW_yxmg8kh_wE2FKd6O8kK4hxXYQ_Dl6TEdJ-TFymqPSUa0UqjtL0P4UaCgYKAfQSARASFQHGX2MiGnG2ZP29ZAd-dkqk8D9tQg0170",
  });
  let result = null;
  const calender = google.calendar({ version: "v3", auth: oAuth2Client });
  const event = {
    summary: "SIH meeting",
    location:
      "D. Y. Patil Educational Complex, Akurdi, Sector 29, Ravet Village Rd, Gurudwara Colony, Nigdi, Pimpri-Chinchwad, Maharashtra 411035",
    description: "This is a meeting for SIH",
    start: {
      dateTime: matchingSlot.start,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: matchingSlot.end,
      timeZone: "Asia/Kolkata",
    },
    attendees: [{ email: studentEmail }, { email: mentorEmail }],
    conferenceData: {
      createRequest: {
        requestId: "uniqueRequestId123", // A unique identifier for the conference
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
    colorId: 1,
  };
  calender.freebusy.query(
    {
      resource: {
        timeMin: matchingSlot.start,
        timeMax: matchingSlot.end,
        timeZone: "Asia/Kolkata",
        items: [
          {
            id: "primary",
          },
        ],
      },
    },
    (err, res) => {
      if (err) return console.error("FreeBusy Query error : ", err);
      const eventsArray = res.data.calendars.primary.busy;
      console.log(eventsArray);

      if (eventsArray.length === 0)
        return calender.events.insert(
          { calendarId: "primary", resource: event, conferenceDataVersion: 1 },
          (err, event) => {
            if (err) return console.error("Calendar event creation error");
            console.log("Calendar event created:", event.data.htmlLink);
            console.log("Google Meet Link:", event.data.hangoutLink); // The Google Meet link
            result = event.data;
            console.log(event.data);

            console.log("Calendar event created");
            return event.data;
          }
        );
      return console.log("calendar slot busy");
    }
  );
  return result;
};

// meetScheduler();

// calendar.events.insert(
//   {
//     calendarId: "primary",
//     resource: event,
//     conferenceDataVersion: 1, // This enables Google Meet integration
//   },
//   (err, event) => {
//     if (err) {
//       console.error("Calendar event creation error:", err);
//       return;
//     }
//     console.log("Calendar event created:", event.data.htmlLink);
//     console.log("Google Meet Link:", event.data.hangoutLink); // The Google Meet link
//   }
// );
module.exports = { scheduleMeet };
