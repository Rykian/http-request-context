const util = require('util')
const Koa = require('koa')
const httpRequestContext = require('../')

const app = new Koa()

app.use(httpRequestContext.koaMiddleware)

app.use(async (ctx, next) => {
  ctx.res.once('finish', () => {
    console.log('finish', httpRequestContext.get('user'))
  })
  await next()
})

app.use(async (ctx, next) => {
  await new Promise(resolve => {
    setTimeout(() => {
      httpRequestContext.set('user', 'user')
      resolve()
    }, 300)
  })
  await next()
})

app.use(async (ctx, next) => {
  await util.promisify(process.nextTick)().then(() => {
    httpRequestContext.set('age', '99')
  })
  await next()
})

app.use(ctx => {
  ctx.body = {
    user: httpRequestContext.get('user'),
    age: httpRequestContext.get('age')
  }
})

app.listen(3002)
