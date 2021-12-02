import { OrderStatus } from './entities/order.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  KafkaMessage,
  Producer,
} from '@nestjs/microservices/external/kafka.interface';
//POST /orders
//GET /orders
//GET /orders/11111
//PATCH /orders/11111
//DELETE /orders/11111
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject('KAFKA_PRODUCER')
    private kafkaProducer: Producer,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    this.kafkaProducer.send({
      topic: 'pagamentos',
      messages: [{ key: 'pagamentos', value: JSON.stringify(order) }],
    });
    return order;
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @MessagePattern('pagamentos')
  async consumer(@Payload() message: KafkaMessage) {
    await this.kafkaProducer.send({
      topic: 'pagamentos-concluidos',
      messages: [
        {
          key: 'pagamentos-concluidos',
          value: JSON.stringify({
            ...message.value,
            status: OrderStatus.Approved,
          }),
        },
      ],
    });
    console.log(message.value);
  }

  @MessagePattern('pagamentos-concluidos')
  async consumer2(@Payload() message: KafkaMessage) {
    const { id } = message.value as any;

    await this.ordersService.update(id, { status: OrderStatus.Approved });
    console.log(message.value);
  }
}
