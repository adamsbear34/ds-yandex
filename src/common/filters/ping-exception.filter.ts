import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { PingException } from '@/common/exceptions';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch(PingException)
export class PingExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const code = exception.getStatus();

    this.logger.error(
      `[${request.url}]: ${code} `,
      exception.stack,
      request.headers,
    );
    response.status(code).send();
  }
}
