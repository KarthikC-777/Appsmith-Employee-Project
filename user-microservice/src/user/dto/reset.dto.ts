import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class resetDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john@email.com',
  })
  @IsEmail({
    message: 'Enter a valid email address , Example: <name>@gmail/email.com',
  })
  readonly email: string;
  @ApiProperty({
    description: 'Password of the user',
    example: 'Qzw@170.xz',
  })
  @MinLength(8, {
    message: 'Password must have a minimum of 8 characters',
  })
  readonly password: string;
}
