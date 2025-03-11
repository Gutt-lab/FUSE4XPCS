export const ErrorCodes = Object.freeze({
    NOT_FOUND: {
        name: 'NotFoundError',
        message: 'The requested resource was not found.',
        statusCode: 404
    },
    UNAUTHORIZED: {
        name: 'UnauthorizedError',
        message: 'You do not have permission to perform this action.',
        statusCode: 401
    },
    VALIDATION_ERROR: {
        name: 'ValidationError',
        message: 'There was a validation error with your request.',
        statusCode: 400
    },
    INTERNAL_SERVER_ERROR: {
        name: 'InternalServerError',
        message: 'An unexpected error occurred. Please try again later.',
        statusCode: 500
    },
});

export function getErrorDetailsByName(errorName) {
   for (const key in ErrorCodes) {
       if (ErrorCodes[key].name === errorName) {
           return {
               message: ErrorCodes[key].message,
               statusCode: ErrorCodes[key].statusCode
           };
       }
   }
   return null; // Return null or throw an error if the error name is not found
}