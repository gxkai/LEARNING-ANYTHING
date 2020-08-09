import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Post } from './post.model'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'

@Module({
  imports: [SequelizeModule.forFeature([Post])],
  providers: [{ provide: 'PostsService', useClass: PostsService }],
  controllers: [PostsController]
})
export class PostsModule {}
