import { Module } from '@nestjs/common'
import { MailerModule as MailModule } from '@nestjs-modules/mailer'

import { MailerController } from './mailer.controller'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [MailModule, ConfigModule],
  controllers: [MailerController]
})
export class MailerModule {}
