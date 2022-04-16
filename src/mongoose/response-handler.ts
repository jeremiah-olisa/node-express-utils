import { Response } from 'express';
import { HttpStatus } from '../common/enums/http-status.enum';
import { HttpAction } from '../common/enums/http-action.enum';
import CustomHttpResponse from '../common/types/custom-http-response';

const response = {
  success: function<TData, TMeta>(
    data: any,
    meta: {} = {}
  ): CustomHttpResponse<TData, TMeta> {
    return {
      data,
      success: true,
      ...meta,
    } as CustomHttpResponse<TData, TMeta>;
  },

  error: function<TData, TMeta>(
    data: any,
    meta: {} = {}
  ): CustomHttpResponse<TData, TMeta> {
    return {
      data,
      success: false,
      ...meta,
    } as CustomHttpResponse<TData, TMeta>;
  },

  send: function<TData, TMeta>(
    response: CustomHttpResponse<TData, TMeta>,
    res: Response,
    action: HttpAction,
    statusCode?: HttpStatus
  ) {
    let status: number = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    if (!statusCode) {
      if (!response.success && Array.isArray(response?.message))
        status = HttpStatus.BAD_REQUEST;
      if (response.success == false) status = HttpStatus.BAD_REQUEST;
      if (response.success == false && response.data == null)
        status = HttpStatus.NOT_FOUND;
      if (
        response.success == true &&
        response.data != null &&
        action === 'create'
      )
        status = HttpStatus.CREATED;
      if (
        response.success == true &&
        response.data != null &&
        (action === 'read' || action === 'update')
      )
        status = HttpStatus.OK;
      if (
        response.success == true &&
        response.data != null &&
        action === 'delete'
      )
        status = HttpStatus.NO_CONTENT;
    }

    return res.status(status).send(response);
  },

  emit: function<TData, TMeta>(
    data: any,
    meta: {} = {},
    res: Response,
    action: HttpAction,
    success?: boolean,
    statusCode?: HttpStatus
  ) {
    let response = {
      data,
      success: success || false,
      ...meta,
    } as CustomHttpResponse<TData, TMeta>;

    let status: number = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    if (!statusCode) {
      if (!response.success && Array.isArray(response?.message))
        status = HttpStatus.BAD_REQUEST;
      if (response.success == false) status = HttpStatus.BAD_REQUEST;
      if (response.success == false && response.data == null)
        status = HttpStatus.NOT_FOUND;
      if (
        response.success == true &&
        response.data != null &&
        action === 'create'
      )
        status = HttpStatus.CREATED;
      if (
        response.success == true &&
        response.data != null &&
        (action === 'read' || action === 'update')
      )
        status = HttpStatus.OK;
      if (
        response.success == true &&
        response.data != null &&
        action === 'delete'
      )
        status = HttpStatus.NO_CONTENT;
    }

    return res.status(status).send(response);
  },
};

export default response;
