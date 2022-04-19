import { DateTime } from './libs/luxon.js';

// get browser's current UNFORMATTED date & time
export const now = () => DateTime.now()

// formatting for general purposes
export const datetimeInputFormat = "yyyy-LL-dd'T'HH:mm";            // 2022-04-14T3:05
export const standardizedFormat = "yyyy-LL-dd'T'HH:mm z";           // 2022-04-14T3:05 America/Chicago

// formatting for displaying user friendly dates
export const dateDisplayFormat = (date, date_pm) => { return {
    dateDisplay: date.toFormat('D'),               // 4/14/2022
    dateShortDisplay: date.toFormat('M/d'),        // 4/14
    dayNameDisplay: date.toFormat('EEE'),          // Thu
    timeDisplay: date.toFormat('h:mm a ZZZZ'),     // 3:05 PM CDT
    timeDisplay_pm: date_pm?.toFormat('h:mm a ZZZZ') || null
}};

// formatting for transferring dates to server
export const dateTransferFormat = (date) => { return {
    yesterday_tz: date.toFormat('z'),                   // America/Chicago
    yesterday_datetz: date.toFormat('yyyy-LL-dd z')     // 2022-04-14 America/Chicago
}};

// parsing dates
export const standardizedParse = (date) => DateTime.fromFormat(date, standardizedFormat);
export const isoParse = (date) => DateTime.fromISO(date);
export const monthYearParse = (date) => DateTime.fromFormat(date, 'yyyy-L');