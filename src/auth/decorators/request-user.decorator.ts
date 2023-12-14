import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUser = createParamDecorator(
  (data: string = 'id', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user[data];
  },
);
