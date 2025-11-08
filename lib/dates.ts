export function getTodayRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  return { start, end };
}

export function getWeekendRange(): { start: Date; end: Date } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  
  const daysUntilSaturday = dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
  
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + daysUntilSaturday);
  saturday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  sunday.setHours(23, 59, 59, 999);
  
  return { start: saturday, end: sunday };
}

export function getNextWeekRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() + 7);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

export function isEventInRange(
  eventStart: string,
  eventEnd: string,
  rangeStart: Date,
  rangeEnd: Date
): boolean {
  const start = new Date(eventStart);
  const end = new Date(eventEnd);
  
  return start <= rangeEnd && end >= rangeStart;
}
