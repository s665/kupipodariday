import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashService {
  async hash(value: string) {
    return bcrypt.hash(value, 10);
  }

  async verify(value: string, hashValue: string): Promise<boolean> {
    return await bcrypt.compare(value, hashValue);
  }
}
