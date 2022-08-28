import { RxError } from 'rxdb';
import { RxReplicationError } from 'rxdb/plugins/replication';
import { createErrorWarning } from '../helpers';

enum ERROR_CODES {
  'DUPLICATE_KEY' = 'COL19',
}

enum ERROR_MESSAGES {
  'COL19' = 'Record already exists',
  'UNKNOWN' = 'Unknown error',
}

export function handleDbError(e: RxError): void {
  if (e.code) {
    console.error(e.code);
    switch (e.code) {
      case ERROR_CODES.DUPLICATE_KEY:
        createErrorWarning(ERROR_MESSAGES[ERROR_CODES.DUPLICATE_KEY]);
        break;
      default:
        console.error(e);
        createErrorWarning(ERROR_MESSAGES.UNKNOWN);
        break;
    }
    return;
  }
  console.error(e);
  createErrorWarning(ERROR_MESSAGES.UNKNOWN);
}

export function generateIsoDate(): string {
  return new Date(Date.now()).toISOString();
}

export function handleReplicationError<T>(error: RxReplicationError<T>): void {
  if (error.type === 'pull') {
    console.error('error pulling from GraphQL server', error.innerErrors);
  } else if (error.type === 'push') {
    if (error.innerErrors && error.innerErrors.length > 0) {
      error.innerErrors.forEach((e) => {
        console.error('error pushing to GraphQL server', e);
      });
    } else {
      console.error('error pushing document to GraphQL server', error);
    }
  } else {
    // General error occurred. E.g., issue communicating with local database.
    console.error('replication error occurred', error);
  }
}
