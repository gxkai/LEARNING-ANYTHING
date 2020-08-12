import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { MailerService } from '@nestjs-modules/mailer'

import { ISendMailInput, ISendMailPayload } from './mailer.interface'
import { ConfigService } from '@nestjs/config'

@Controller()
export class MailerController {
  constructor(private readonly service: MailerService, private readonly configService: ConfigService) {}

  @GrpcMethod('MailerService', 'send')
  async send(input: ISendMailInput): Promise<ISendMailPayload> {
    const mailInput = {
      ...input,
      data: input.newComment ?? input.signup ?? input.updateEmail ?? input.updatePassword
    }
    let subject = ''

    switch (mailInput.template) {
      case 'new-comment':
        subject = 'Notice: New Comment on your Post'
        break
      case 'signup':
        subject = 'Welcome to GraphQL Blog'
        break
      case 'update-email':
        subject = 'Notice: Email Update'
        break
      case 'update-password':
        subject = 'Notice: Password Update'
        break
      default:
        break
    }

    await this.service.sendMail({
      to: mailInput.to,
      from: this.configService.get<string>('SMTP_USER'),
      subject,
      template: mailInput.template,
      context: mailInput.data
    })
    return { isSent: true }
  }
}
