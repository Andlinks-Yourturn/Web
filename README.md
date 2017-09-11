
# Guide for deploy Java Web Application
## In dev Mode
run `node server.js` & `npm run build:dev`

This will generate a build folder in development mode

## In production mode

run `npm run build:prod`

This will generate a build folder in production mode

### 发布流程
1. 开发模式:
    运行 node server.js
    运行 npm run build:dev // 会生成开发模式的build目录

2. 生产模式
    运行 npm run build:prod // 会生成生产模式的build目录