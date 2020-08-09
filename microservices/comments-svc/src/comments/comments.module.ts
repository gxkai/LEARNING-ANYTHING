import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Comment } from './comment.model'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'

@Module({
  imports: [SequelizeModule.forFeature([Comment])],
  providers: [{ provide: 'CommentsService', useClass: CommentsService }],
  controllers: [CommentsController]
})
export class CommentsModule {}
