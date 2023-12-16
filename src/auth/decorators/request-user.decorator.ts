import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUser = createParamDecorator<string, ExecutionContext>(
  (data = 'id', ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user[data];
  },
);
