const express = require('express');
const app = express()
//配置跨域
const cors = require('cors')
app.use(cors())

//配置解析表单的(application/x-www-from-urlencoded)中间件
// app.use(express.urlencoded({
//     extended: false
// }))

//设置响应头
app.all('*', (req, res, next) => {
    const { origin, Origin, referer, Referer } = req.headers;
    const allowOrigin = origin || Origin || referer || Referer || '*';
    res.header("Access-Control-Allow-Origin",allowOrigin)
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", 'Express');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.use(express.static('public'))

const cookieParser = require('cookie-parser')
app.use(cookieParser());

const session = require('express-session');
app.use(
    session({
        secret: 'xiaoye',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
)

//导入路由模块之前配置解析Token的中间件
const config = require('./config');
const jwt = require('express-jwt');
app.use(jwt({ secret: config.jwtsecretkey }).unless({ path: [/^\/api\//] }))

//解析参数问题，解析表单
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit:'50mb',extended: false }))
app.use(bodyParser.json({
    limit: '50mb'//设置接收的文件大小
}));



//导入路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);

const userinfoRouter = require('./router/my');
app.use(userinfoRouter);

const articleRouter = require('./router/article');
app.use(articleRouter);


const shopping = require('./router/shopping');
app.use(shopping);

//定义错误级别中间件
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.send({
            code: 401,
            msg: err.message
        })
    } else {
        res.send({
            code: 403,
            msg: err.message
        })
    }
    next()
})


app.listen(80, (req, res) => {
    console.log("api_server服务器启动成功")
})
