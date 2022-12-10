import { CacheModule, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  leave_host,
  password,
  queue_name,
  rmq_host,
  user_name,
  virtual_host,
} from 'src/config';
import { JwtAuthGuard } from './guards/jwt-guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: userSchema,
      },
    ]),
    JwtModule.register({
      secret: 'User-secret',
    }),
    // ClientsModule.register([
    //   {
    //     name: 'LEAVE',
    //     transport: Transport.TCP,
    //     options: { host: leave_host, port: 3001 },
    //   },
    // ]),
    ClientsModule.register([
      {
        name: 'LEAVE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${user_name}:${password}@${rmq_host}/${virtual_host}`],
          queue: queue_name,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'ymlbeginners@gmail.com',
          pass: 'pelwhovrqaokyojr',
        },
      },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5,
      max: 100,
    }),
  ],
  providers: [
    UserService,
    JwtAuthGuard,
    JwtStrategy,
    RolesGuard,

    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
  controllers: [UserController],
})
export class UserModule {}
