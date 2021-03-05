import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function propagateError<T>() {
  return function (source: Observable<T>) {
    return source.pipe(
      catchError((error) => {
        return throwError(
          error?.error?.error || {
            error: 'unknown',
            errorDescription: 'Unknown error',
          }
        );
      })
    );
  };
}
