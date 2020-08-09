import { Module } from '@nestjs/common'
import { MailerModule as MailModule } from '@nestjs-modules/mailer'

import { MailerController } from './mailer.controller'

@Module({
  imports: [MailModule],
  controllers: [MailerController]
})
export class MailerModule {}
