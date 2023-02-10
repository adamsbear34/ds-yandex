import {
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IHttpException } from '../interfaces';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message;
    let code;
    let status;
    let res;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message = exception.getResponse().message || exception.message;
      res = this.getExceptionResponse(status, message, request);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = exception.name;
      message = 'Internal Server Error';
      res = this.getExceptionResponse(status, message, request);
    }

    this.logger.error(
      `[${request.url}]: ${code}:${message}  Body: ${JSON.stringify(
        request.body,
      )}`,
      exception.stack,
      request.headers,
    );
    response.status(status).send(res);
  }

  private getExceptionResponse = (
    status: HttpStatus,
    message: string,
    request: Request,
  ): IHttpException => {
    return {
      timestamp: new Date(),
      status,
      message,
      path: request.url,
    };
  };
}
