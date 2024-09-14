function findMatchingSlot(slot1, slot2) {
  const start = new Date(
    Math.max(new Date(slot1.start).getTime(), new Date(slot2.start).getTime())
  );
  const end = new Date(
    Math.min(new Date(slot1.end).getTime(), new Date(slot2.end).getTime())
  );
  // console.log(start.toISOString() + "  <=>   " + end.toISOString());

  if (start < end) {
    return { start: start.toISOString(), end: end.toISOString() };
  } else {
    return null;
  }
}

module.exports = { findMatchingSlot };
