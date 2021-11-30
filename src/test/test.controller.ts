import { TestService } from './test.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('test')
export class TestController {
  constructor(private service: TestService) {}

  @Get(':id') //test/:id
  acao(@Param('id') id) {
    console.log(id);
    return this.service.metodo1();
  }
}

//ordem pagamento
//http://localhost:3000/orders

//nest g controller orders -> consultar, criar, editar e excluir