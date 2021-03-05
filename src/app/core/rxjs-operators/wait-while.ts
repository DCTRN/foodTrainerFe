import { interval, Observable } from 'rxjs';
import { skipWhile, take, timeout } from 'rxjs/operators';

export function waitWhile(
  predicate: () => boolean,
  timeoutValue: number = 5000
): Observable<number> {
  return interval(33).pipe(
    skipWhile(() => predicate()),
    take(1),
    timeout(timeoutValue)
  );
}
