import _apiFeatures from './api/api-features';
import _appError from './mongoose/app-error';
import _catchAsync from './mongoose/catch-async';
import _connect from './mongoose/db-connect';
import _filterObj from './mongoose/filterObject';
import _globalErrorHandler from './mongoose/global-error-handler';
import _middleware from './api/middleware';
import _mongoFactory from './mongoose/factory';
import _response from './mongoose/response-handler';

export const AppError = _appError;
export const catchAsync = _catchAsync;
export const dbConnect = _connect;
export const mongoFactory = _mongoFactory;
export const FilterObj = _filterObj;
export const globalErrorHandler = _globalErrorHandler;
export const responseHandler = _response;
export const APIFeatures = _apiFeatures;
export const middleware = _middleware;

// export const AppError = _appError
// export const AppError = _appError
// export const AppError = _appError
// export const AppError = _appError
// export const AppError = _appError
// export const AppError = _appError
// export const AppError = _appError
// export const AppError = _appError
// export const AppError = _appError
// export const AppError = _appError
// export const AppError = _appError
// export const AppError = _appError
// export const AppError = _appError
