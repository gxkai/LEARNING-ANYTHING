import { isEmpty } from 'lodash'
import { Injectable } from '@nestjs/common'
import { FindOptions } from 'sequelize/types'
import { InjectModel } from '@nestjs/sequelize'

import { IPostsService } from './posts.interface'
import { IFindAndPaginateOptions, IFindAndPaginateResult } from '../commons/find-and-paginate.interface'

import { Post } from './post.model'
import { PostDto } from './post.dto'

@Injectable()
export class PostsService implements IPostsService {
  constructor(@InjectModel(Post) private readonly repo: typeof Post) {}

  async find(query?: IFindAndPaginateOptions): Promise<IFindAndPaginateResult<Post>> {
    // @ts-ignore
    const result: IFindAndPaginateResult<Post> = await this.repo.findAndPaginate({
      ...query,
      raw: true,
      paranoid: false
    })
    return result
  }

  async findById(id: string): Promise<Post> {
    const result: Post = await this.repo.findByPk(id, {
      raw: true
    })
    return result
  }

  async findOne(query: FindOptions): Promise<Post> {
    const result: Post = await this.repo.findOne({
      ...query,
      raw: true
    })
    return result
  }

  async count(query?: FindOptions): Promise<number> {
    const result: number = await this.repo.count(query)
    return result
  }

  async create(commentDto: PostDto): Promise<Post> {
    const result: Post = await this.repo.create(commentDto)
    return result
  }

  async update(id: string, comment: PostDto): Promise<Post> {
    const record: Post = await this.repo.findByPk(id)

    if (isEmpty(record)) throw new Error('Record not found.')

    const result: Post = await record.update(comment)
    return result
  }

  async destroy(query?: FindOptions): Promise<number> {
    const result: number = await this.repo.destroy(query)
    return result
  }
}
