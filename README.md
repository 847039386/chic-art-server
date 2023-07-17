
## Description

Chic-Art 管理系统 使用框架[Nest](https://github.com/nestjs/nest) ，数据库使用[mongodb](https://www.mongodb.com/zh-cn)

## 安装

```bash
$ npm install
```

## 运行

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## mongodb事务处理

> ##### MongoDB 的事务只能在开启副本集的时候才能使用，Windows 上的 MongoDB 安装后默认是单副本，我们可以将其转换成多副本后再运行事务

1. 安装目录下找到 MongoDB 的配置文件 mongod.cfg 这里5.0的路径是 mongodb安装路径/bin/mongod.cfg
2. 添加如下配置，注意格式：replSetName 前面是 4 个空格而不是 tab 字符

```bash
replication:
    replSetName: rs0
```

3. 重启 MongoDB 服务
4. 进入 MongoDB 的 bin 目录，cmd 执行 mongo 命令，执行 rs.initiate() 初始化复制集

```bash
rs.initiate() 
rs.secondaryOk()
```


5. 可能会提示需要身份验证

```bash
use admin;
db.auth("admin", "666666");
```


## License

Nest is [MIT licensed](LICENSE).
