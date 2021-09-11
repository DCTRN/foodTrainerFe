import {
  setBeginningOfTheDay,
  setEndOfTheDay,
} from '@core/util-functions/util-functions';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';
import { DateRange } from '@stores/user-products/user-products.selectors';
import { startOfWeek } from 'date-fns';
import endOfMonth from 'date-fns/endOfMonth';
import endOfWeek from 'date-fns/endOfWeek';
import startOfMonth from 'date-fns/startOfMonth';

export const dateRanges: Record<TimeStamp, DateRange> = {
  [TimeStamp.DAILY]: {
    start: setBeginningOfTheDay(new Date()),
    end: setEndOfTheDay(new Date()),
  },
  [TimeStamp.WEEKLY]: {
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  },
  [TimeStamp.MONTHLY]: {
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  },
};
