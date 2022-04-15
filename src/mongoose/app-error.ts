import { HttpStatus } from "../common/enums/http-status.enum";

class AppError extends Error {
    private statusCode: HttpStatus | number;
    private status: 'fail' | 'error';
    private isOperational: boolean;
    private errors: any;
    constructor(message: string, statusCode: HttpStatus, errors = undefined) {
        // console.log({ message });
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        this.message = message;
        this.errors = errors

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
// module.exports = AppError;