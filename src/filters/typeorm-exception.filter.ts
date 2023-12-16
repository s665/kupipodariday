import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  EntityNotFoundError,
  EntityPropertyNotFoundError,
  QueryFailedError,
  TypeORMError,
} from 'typeorm';

@Catch(TypeORMError)
export class TypeormExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    const code = (exception as any).code;
    const message: unknown = exception.message;
    let status;
    console.log(exception.constructor);

    switch (exception.constructor) {
      case QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        break;
      case EntityNotFoundError:
        status = HttpStatus.NOT_FOUND;
        break;
      case EntityPropertyNotFoundError:
        status = HttpStatus.BAD_REQUEST;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(status).json({ message, code, status });
  }
}
