import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestController } from './test/test.controller';
import { TestService } from './test/test.service';
import { OrdersModule } from './orders/orders.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { join } from 'path';
import { Order } from './orders/entities/order.entity';
//ES7 Decorators - EcmaScript JavaScript
@Module({
  imports: [
    OrdersModule,
    // SequelizeModule.forRoot({
    //   dialect: 'sqlite',
    //   host: join(__dirname, 'database.sqlite'),
    //   models: [Order],
    //   autoLoadModels: true,
    // }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'db',
      port: 3306,
      database: 'fin',
      username: 'root',
      password: 'root',
      models: [Order],
      autoLoadModels: true,
    }),
  ],
  controllers: [AppController, TestController],
  providers: [AppService, TestService], //container de serviços
})
export class AppModule {}
