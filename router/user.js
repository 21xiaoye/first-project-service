/**
 * 用户接口
 */

const express = require('express');

const router = express.Router();

const userHandler = require('../router_handler/user')

const expressjoi = require('@escook/express-joi')


const {reg_login_scheme,email_from,reg_scheme}=require('../scheme/user')


//用户登录接口
router.post('/login', expressjoi(reg_login_scheme), userHandler.login)

//邮箱验证码接口
router.post('/email', expressjoi(email_from), userHandler.email)

//用户注册接口
router.post('/reguser',expressjoi(reg_scheme),userHandler.regUser)


module.exports = router