import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  db_cluster,
  db_host,
  db_host_name,
  db_name,
  db_password,
  db_user,
} from './config';

import { LeaveModule } from './leave/leave.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `${db_host_name}://${db_user}:${db_password}@${db_cluster}/${db_name}`,
    ),
    LeaveModule,
  ],
})
export class AppModule {}
