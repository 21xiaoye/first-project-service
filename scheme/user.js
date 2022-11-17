//导入定义验证的包
const e = require('express')
const joi=require('joi')

//定义用户名和密码的验证规则
const username = joi.string().min(1).max(20).required()
const password = joi.string().pattern(/^[\S]{6,18}$/).required()

const email = joi.string().email()

//登录的验证规则
exports.reg_login_scheme = {
    body: {
        username, password,
    }
}
//注册的验证规则
exports.reg_scheme = {
    body: {
        username,
        password,
        code: joi.string().required(),
        email:joi.string().email().required()
    }
}
//更新用户信息的验证规则
exports.update_userinfo = {
    body: {
        username: joi.string(),
        email,
        sign: joi.string(),
        sex:joi.string(),
        age: joi.string(),
        birthday:joi.string()
    }
}

//修改密码验证规则
exports.update_password = {
    body: {
        oldpassword: joi.string().required(),
        newpassword: joi.not(joi.ref('oldpassword')).required(),
        code: joi.string().required(),
        username:joi.string().required()
    }
}

//更换头像的校验规则
exports.avatar_scheme = {
    body: {
        avatar: joi.required(),
        name:joi.required()
    }
}

//添加商品分类校验规则
exports.article_add = {
    body: {
        name: joi.string().required(),
        alias:joi.string().required()
    }
}

//邮箱验证
exports.email_from = {
    body: {
        email: joi.string().email().required()
    }
}