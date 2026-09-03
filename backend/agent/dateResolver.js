import { 
  format, 
  parse, 
  addDays, 
  nextDay, 
  isBefore, 
  startOfDay, 
  isPast 
} from 'date-fns';
import { formatInTimeZone, toDate } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

/**
 * Gets the current date in Asia/Kolkata timezone
 * @returns {Date}
 */
const getCurrentDateIST = () => {
  const now = new Date();
  const dateString = formatInTimeZone(now, TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
  return new Date(dateString);
};

/**
 * Resolves a natural language date string into a YYYY-MM-DD format
 * @param {string} input - Natural language date string
 * @returns {string|null} - Formatted date string or null if unparseable
 */
export const resolveDate = (input) => {
  if (!input || typeof input !== 'string') return null;
  
  const lowerInput = input.trim().toLowerCase();
  const today = startOfDay(getCurrentDateIST());

  // Handle exact keywords
  if (lowerInput === 'today') return format(today, 'yyyy-MM-dd');
  if (lowerInput === 'yesterday') return format(addDays(today, -1), 'yyyy-MM-dd');
  if (lowerInput === 'tomorrow') return format(addDays(today, 1), 'yyyy-MM-dd');
  if (lowerInput === 'day after tomorrow') return format(addDays(today, 2), 'yyyy-MM-dd');
  if (lowerInput === 'this weekend') return format(nextDay(today, 6), 'yyyy-MM-dd'); // 6 is Saturday

  // Handle 'this <day>' and 'next <day>'
  const daysOfWeek = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
  for (const [day, dayIndex] of Object.entries(daysOfWeek)) {
    if (lowerInput === `this ${day}` || lowerInput === `next ${day}`) {
      return format(nextDay(today, dayIndex), 'yyyy-MM-dd');
    }
  }

  // Handle standard date formats
  const currentYear = today.getFullYear();
  const formatsToTry = [
    'yyyy-MM-dd',
    'dd/MM/yyyy',
    'dd-MM-yyyy',
    'd MMMM yyyy',
    'd MMM yyyy',
    'MMMM d yyyy',
    'MMM d yyyy'
  ];

  for (const fmt of formatsToTry) {
    let parsedDate = parse(input, fmt, today);
    if (!isNaN(parsedDate)) {
      return format(parsedDate, 'yyyy-MM-dd');
    }
  }

  // Handle missing year (e.g., '15 September', 'Sept 15')
  const noYearFormats = [
    'd MMMM',
    'MMMM d',
    'd MMM',
    'MMM d',
    'do MMMM',
    'do MMM'
  ];
  
  // Basic cleanup for '15th', '1st' etc before date-fns parsing if needed, but date-fns handles some.
  const cleanedInput = lowerInput.replace(/st|nd|rd|th/g, '');

  for (const fmt of noYearFormats) {
    let parsedDate = parse(cleanedInput, fmt, today);
    if (!isNaN(parsedDate)) {
      parsedDate.setFullYear(currentYear);
      // If date has passed this year, assume next year
      if (isBefore(parsedDate, today)) {
        parsedDate.setFullYear(currentYear + 1);
      }
      return format(parsedDate, 'yyyy-MM-dd');
    }
  }

  return null;
};

/**
 * Formats a YYYY-MM-DD date string for display
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string|null} - Display string (e.g. 'Thu, 4 Sep 2026')
 */
export const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return null;
  const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
  if (isNaN(parsedDate)) return null;
  return format(parsedDate, 'EEE, d MMM yyyy');
};
