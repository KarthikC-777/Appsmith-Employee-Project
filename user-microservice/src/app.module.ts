import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { db_host, db_name } from './config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:root@cluster0.rj2jb5r.mongodb.net/Appsmith',
    ),
    UserModule,
  ],
})
export class AppModule {}
