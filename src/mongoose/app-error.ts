import { HttpStatus } from '../common/enums/http-status.enum';

class AppError extends Error {
  readonly statusCode: HttpStatus | number;
  readonly status: 'fail' | 'error';
  readonly isOperational: boolean;
  readonly errors: any;
  constructor(
    message: string,
    statusCode: HttpStatus | number,
    errors = undefined
  ) {
    // console.log({ message });
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.message = message;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
// module.exports = AppError;
