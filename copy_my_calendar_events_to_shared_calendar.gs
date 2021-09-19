const SOURCE_CALENDAR_IDS = ['xxx', 'xxx']; // Set your calendar ids
const DESTINATION_CALENDAR_ID = 'xxx' // Set shared calandar id

function getEventsForDays(targetCalendar, startDate, days) {
  if (days === 0) {
    return targetCalendar.getEventsForDay(startDate);
  } else {
    const endDate = new Date(startDate.getTime() + (days * 24 * 60 * 60 * 1000));
    return targetCalendar.getEvents(startDate, endDate);
  }
}

function deleteEventsForDays(targetCalendar, startDate, days) {
  const events = getEventsForDays(targetCalendar, startDate, days);
  events.forEach(function(event) {
    event.deleteEvent();
  });
}

function copyEventsForDays(sourceCalendar, destinationCalendar, startDate, days) {
  const events = getEventsForDays(sourceCalendar, startDate, days);
  events.forEach(function(event) {
    if (event.isAllDayEvent()) {
      destinationCalendar.createAllDayEvent(event.getTitle(), event.getStartTime(), { description: event.getDescription() });
    } else {
      destinationCalendar.createEvent(event.getTitle(), event.getStartTime(), event.getEndTime(), { description: event.getDescription() });
    }
  });
}

function syncEvents(sourceCalendarIds, destinationCalendarId, startDate, days) {
  const destinationCalendar = CalendarApp.getCalendarById(destinationCalendarId);
  deleteEventsForDays(destinationCalendar, startDate, days);

  sourceCalendarIds.forEach(function(sourceCalendarId) {
    const sourceCalendar = CalendarApp.getCalendarById(sourceCalendarId);
    copyEventsForDays(sourceCalendar, destinationCalendar, startDate, days);
  });
}

function syncEventsFromTodayToTommorow() {
  syncEvents(SOURCE_CALENDAR_IDS, DESTINATION_CALENDAR_ID, new Date(), 1)
}
