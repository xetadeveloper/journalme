import { errorTypes } from '../config.js';

export function serverErrorFound(res, err, errMessage) {
  console.log('Error occured in server operation: ', err);
  res.status(500).json({
    app: {
      error: {
        type: errorTypes.servererror,
        message: errMessage,
        httpServerError: true,
      },
    },
    flags: { isError: true },
  });
}

export function dbOperationError(res, err, errMessage) {
  console.log('Error occured in executing DB operation: ', err);
  res.status(500).json({
    app: {
      error: {
        type: errorTypes.databaseerror,
        message: errMessage,
        httpServerError: true,
      },
    },
    flags: { isError: true },
  });
}

export function executionError(res, status, errType, errMessage) {
  console.log('Error occured in an operation: ', err);
  res.status(status).json({
    app: {
      error: {
        type: errType,
        message: errMessage,
        httpServerError: true,
      },
    },
    flags: { isError: true },
  });
}

export function badInputError(res, errorFields, errorType, status) {
  console.log('Client supplied bad input...');
  res.status(status || 400).json({
    app: {
      error: {
        type: errorType || errorTypes.inputerror,
        errorFields,
        httpServerError: true,
      },
    },
    flags: { isError: true },
  });
}

export function emptyRequestBodyError(res) {
  console.log('No data found in request body');
  const errMessage = 'Required data not found';
  res.status(400).json({
    app: {
      error: {
        type: errorTypes.emptybodyerror,
        message: errMessage,
        httpServerError: true,
      },
    },
    flags: { isError: true },
  });
}

export function emptyRequestQueryError(res) {
  console.log('No data passed in request query');
  const errMessage = 'Required data not found';
  res.status(400).json({
    app: {
      error: {
        type: errorTypes.emptyqueryerror,
        message: errMessage,
        httpServerError: true,
      },
    },
    flags: { isError: true },
  });
}
