import { isEmpty } from 'lodash'
import { Injectable } from '@nestjs/common'
import { FindOptions } from 'sequelize/types'
import { InjectModel } from '@nestjs/sequelize'

import { IUsersService } from './users.interface'
import { IFindAndPaginateOptions, IFindAndPaginateResult } from '../commons/find-and-paginate.interface'

import { User } from './user.model'
import { UserDto } from './user.dto'

@Injectable()
export class UsersService implements IUsersService {
  constructor(@InjectModel(User) private readonly repo: typeof User) {}

  async find(query?: IFindAndPaginateOptions): Promise<IFindAndPaginateResult<User>> {
    // @ts-ignore
    const result: IFindAndPaginateResult<User> = await this.repo.findAndPaginate({
      ...query,
      raw: true,
      paranoid: false
    })
    return result
  }

  async findById(id: string): Promise<User> {
    const result: User = await this.repo.findByPk(id, {
      raw: true
    })
    return result
  }

  async findOne(query: FindOptions): Promise<User> {
    const result: User = await this.repo.findOne({
      ...query,
      raw: true
    })
    return result
  }

  async count(query?: FindOptions): Promise<number> {
    const result: number = await this.repo.count(query)
    return result
  }

  async create(user: UserDto): Promise<User> {
    const result: User = await this.repo.create(user)
    return result
  }

  async update(id: string, user: UserDto): Promise<User> {
    const record: User = await this.repo.findByPk(id)

    if (isEmpty(record)) throw new Error('Record not found.')

    const result: User = await record.update(user)
    return result
  }

  async destroy(query?: FindOptions): Promise<number> {
    const result: number = await this.repo.destroy(query)
    return result
  }
}
