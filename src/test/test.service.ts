import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  metodo1() {
    return 'deu certo!!';
  }
}
