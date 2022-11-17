const db = require('../mysql/mysqluser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('../config')
const nodemailer = require("nodemailer")
//邮箱验证码验证接口
var transporter = nodemailer.createTransport({
    //邮件传输
    host: 'smtp.qq.com',
    secureConnection: false,
    port: 465,
    auth: {
        user: "3474636132@qq.com",
        pass: 'yqxutqlaxkybdbbb'
    }
});

//登录接口
exports.login = (req, res) => {
    const userinfo = req.body
    const loginsql = `select * from user where username=?`
    console.log(req.body)
    db.query(loginsql, userinfo.username,(err, result) => {
        if (err) {
            return res.send({
                code: 403,
                msg:err.message
            })
        }

        if (result.length <= 0) {
            return res.send({
                code: 403,
                msg:'用户不存在'
            })
        } else {
            const lan = bcrypt.compareSync(userinfo.password, result[0].password);
            if (!lan) {
                return res.send({
                    code: 403,
                    msg:'密码不正确'
                })
            }
            const user = { ...result[0], password: '', user_pic: '' } 
            const token = jwt.sign(user, config.jwtsecretkey, { expiresIn: '24h' })
            res.send({
                code: 200,
                msg: '登录成功',
                token:'Bearer '+token
            })
        }
    })
}

//邮箱验证码接口
exports.email = (req, res) => {
    var code = "";
    while (code.length < 5) {
        code += Math.floor(Math.random() * 10);
    }
    req.session.code = code
    var mailOption = {
        from: "3474636132@qq.com",
        to: req.body.email,
        subject: "验证码",
        html: "<h1>欢迎注册，您本次的注册验证码为：" + code + "</h1><br/>"+"<p>吾生也有涯,而知也有涯。已有涯随无涯,殆以!已而为知者,殆而已矣!</p>",
    };
    transporter.sendMail(mailOption, function (err, result) {
        if (err) {
            res.send({
                code: '401',
                msg:err.message
            })
        } else {
            res.send({
                code: '200',
                msg: "验证码发送成功",
                data:req.session.code
            })
        }
    })
}


//注册接口
exports.regUser = (req, res) => {
    let userinfo = req.body;
    console.log(userinfo)
    if (userinfo.code != req.session.code) {
        return res.send({
            code: 400,
            msg:'验证码错误'
        })
    }
    //判断用户名是否被占用
    const getuser = 'select * from user where username=?'
    db.query(getuser,userinfo.username,(err,result) => {
        if (err) {
            return res.send({
                code: 500,
                msg:err.message
            })
        }
        if (result.length>0) {//result是一个数组
            return res.send({
                code: 403,
                msg:'用户名占用'
            })
        } else {
            //对密码进行加密处理(bcrypt.js) 参数：明文密码，随机盐长度
            userinfo.password = bcrypt.hashSync(userinfo.password, 10);
            //注册
            const strsql = "INSERT INTO user set ? "
            db.query(strsql, userinfo, (err,result) => {
                if (err) {
                    return res.send({
                        code: 500,
                        msg:err.message
                    })
                }
                if (result.affectedRows !== 1) {
                    return res.send({
                        code: 403,
                        msg:'注册失败,请稍后再试'
                    })
                }
                res.send({
                    code: 200,
                    msg:"注册成功"
                })
            })
        }
    })
}
