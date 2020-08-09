import { NestFactory } from '@nestjs/core'
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import * as express from 'express'
import { logger } from './middleware/logger.middleware'
import { TransformInterceptor } from './interceptor/transform.interceptor'
import { HttpExceptionFilter } from './filter/http-exception.filter'
import { AllExceptionsFilter } from './filter/any-exception.filter'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'

async function main() {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter())
  const configService: ConfigService = app.get(ConfigService)
  app.use(express.json()) // For parsing application/json
  app.use(express.urlencoded({ extended: true })) // For parsing application/x-www-form-urlencoded
  // 监听所有的请求路由，并打印日志
  // app.use(logger)
  // 使用拦截器打印出参
  // app.useGlobalInterceptors(new TransformInterceptor())
  // app.useGlobalFilters(new AllExceptionsFilter())
  // app.useGlobalFilters(new HttpExceptionFilter())
  app.use(
    cors({
      origin: '*',
      credentials: true
    })
  )
  app.use(cookieParser())
  return app.listenAsync(configService.get<number>('GRAPHQL_PORT'))
}

main()
