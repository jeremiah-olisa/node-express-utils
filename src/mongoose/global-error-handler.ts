import { HttpStatus } from './../common/enums/http-status.enum';
import AppError from './app-error';
import { Response, Request, NextFunction } from 'express';

export const handleNotFoundError = (req: Request, next: NextFunction) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      HttpStatus.NOT_FOUND
    )
  );
};

const handleCastErrorDB = (err: any) => {
  let error: any = {};
  const message = `Invalid ${err.path}: ${err.value}.`;
  error[err.path] = message;
  return new AppError(message, HttpStatus.BAD_REQUEST, error);
};

const handleDuplicateFieldsDB = (err: any) => {
  let key = Object.keys(err?.keyValue)[0];
  let value = err?.keyValue[key];
  let valError: any = {};
  valError[key] = `Duplicate value: ${value}. Please use another value!`;

  const message = `Duplicate field ${key} value: ${value}. Please use another value!`;
  return new AppError(message, HttpStatus.BAD_REQUEST, valError);
};

const handleValidationErrorDB = (err: any) => {
  let valErrors: any = {};

  // el.path is the field the error occurs in while `el.message.replace('Path `', 'Field `')` is the error message
  // `valErrors[el.path] = el.message.replace('Path `', 'Field `')` adds a key to valErrors and the value of the new key is the error message

  Object.values(err.errors).forEach((el: any) => {
    valErrors[el.path] = el.message.replace('Path `', 'Field `');
  });

  const message = `Invalid input fields. ${Object.keys(err?.errors).join(
    ', '
  )}`;

  return new AppError(message, HttpStatus.BAD_REQUEST, valErrors);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', HttpStatus.UNAUTHORIZED);

const handleJWTExpiredError = () =>
  new AppError(
    'Your token has expired! Please log in again.',
    HttpStatus.UNAUTHORIZED
  );

const sendErrorDev = (err: any, res: Response) => {
  // console.log(err)
  res.status(err?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
    status: err?.status,
    errors: err?.errors,
    message: err?.message,
    err,
    // stack: err.stack
  });
};

const sendErrorProd = (err: any, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: err?.status,
      message: err?.message,
      errors: err?.errors,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const globalErrorHandler = (
  err: any,
  res: Response,
  env: string = 'development'
) => {
  err.statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;
  error.code = err.code;
  error.name = err.name;

  // console.log(error)

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (env === 'development') {
    sendErrorDev(error, res);
  } else if (env === 'production') {
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
