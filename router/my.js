const bcrypt = require('bcryptjs');
const express = require('express');
const db = require('../mysql/mysqluser');
const expressjoi = require('@escook/express-joi')
const rs=require('fs')
const {
    update_userinfo,
    update_password,
    avatar_scheme,
} = require('../scheme/user')

const router = express.Router();

//获取用户信息接口
router.get('/my/userinfo',(req, res) => {
    // res.send({
    //     code: 200,
    //     msg: '获取用户信息成功',
    //     data:req.user
    // })

    const getUserinfoSql = `select * from user where id=?`
    db.query(getUserinfoSql, req.user.id,(err, resulet) => {
        if (err) {
            res.send({
                code: 400,
                msg:err.message
            })
        }
        if (resulet.length !== 1) {
            res.send({
                code: 400,
                msg:'获取用户信息失败'
            })
        } else {
            featured=resulet[0].featured
            const user={...resulet[0],featured:JSON.parse(featured)}
            res.send({
                code: 200,
                msg: "获取用户信息成功",
                data:user
            })
        }
    })
}) 


//更新用户信息接口
router.put('/user/updateuser', expressjoi(update_userinfo), (req, res) => {
    console.log(req.body)
    const updateUserinfo = 'UPDATE user set ? where id=?'
    db.query(updateUserinfo,[req.body,req.user.id],(err, result)=>{
        if (err) {
            return res.send({
                code: 400,
                msg:err.message
            })
        }
        res.send({
            code: 200,
            msg:'用户信息更新成功'
        })
    })
})

//上传用户精选照片
router.post('/user/featuredphotos', (req, res) => {
    var featured=[]//用户上传的照片
    for (let item of req.body.photos) {
        item.content = item.content.replace(/^data:image\/\w+;base64,/, '');
        let dataBuffer = new Buffer(item.content, 'base64')
        rs.writeFile(`public/images/photos/${item.name}`, dataBuffer, function (err) {
            if (err) {
                return res.send({
                    code: 401,
                    msg:err
                })
            } 
        })
        item.content = `http://127.0.0.1/images/user/${item.name}`
        featured.push(item)
    }

    const getfeatured = `select featured from user where id= ?`
    db.query(getfeatured, req.user.id, (err, resule) => {
        if (resule[0].featured != null) {
            for (let item of JSON.parse(resule[0].featured)) {
                featured.push(item)
            }
            addphotos(featured,req,res)
        } else {
            addphotos(featured, req, res);
        }
    })
})

function addphotos(featured, req,res) {
    const sql = `UPDATE user set featured=? where id= ? `
    db.query(sql, [JSON.stringify(featured), req.user.id], (err, resule) => {
        if (err) {
            return res.send({
                code: 401,
                msg:err.message
            })
        }
        res.send({
            code: 200
        })
    })
}

//修改密码接口
router.put('/user/updatepwd', expressjoi(update_password), (req, res) => {
    console.log(req.body)
    if (req.session.code != req.body.code) {
        return res.send({
            code: 401,
            msg:'验证码不正确'
        })
    }
    const getuser = 'select * from user where id=?'
    db.query(getuser, req.user.id, (err, result) => {
        if (err) {
            return res.send({
                code: 400,
                msg:err.msg
            })
        }
        if (result.length !== 1) {
            return res.send({
                code: 400,
                msg:'该用户不存在，无法修改密码'
            })
        } else {
            console.log(req.body.oldpassword)
            const lan = bcrypt.compareSync(req.body.oldpassword, result[0].password);
            if (!lan) {
                res.send({
                    code: 401,
                    msg:"密码不正确"
                })
            } else {
                const sql = `UPDATE user set password=? where id=?`
                const newpassword = bcrypt.hashSync(req.body.newpassword, 10);
                db.query(sql, [newpassword, req.user.id], (err, result) => {
                    if (err) {
                        res.send({
                            code: 403,
                            msg:err.message
                        })
                    }
                    if (result.affectedRows == 1) {
                        res.send({
                            code: 200,
                            msg: '密码修改成功'
                        })
                    }
                })
            }
        }
    })
})

//更换用户头像接口
router.post('/user/avatar', expressjoi(avatar_scheme), (req, res) => {
    let img = req.body.avatar
    let imgData = img.replace(/^data:image\/\w+;base64,/, '')
    console.log(imgData)
    let dataBuffer = new Buffer(imgData, 'base64');
    rs.writeFile(`public/images/user/${req.body.name}`, dataBuffer, function (err) {//保存到本地服务器
        if (err) {
            return res.send({
                code: '401',
                msg: err
            })
        } else {
            let url = `http://127.0.0.1/images/user/${req.body.name}`//图片路径
            const sql = `UPDATE  user set user_pic=? where id=?`
            db.query(sql, [url, req.user.id], (err, resule)=>{
                if (err) {
                    return res.send({
                        code: 401,
                        msg:err.message
                    })
                }
                if (resule.affectedRows === 1) {
                    res.send({
                        code: 200,
                        msg:'头像上传成功'
                    })
                }
            })
        }
    })
})

//更换主页背景
router.post('/user/user_bg', (req, res) => {
    let imgData = req.body.bg.replace(/^data:image\/\w+;base64,/, '')
    let dataBuffer = new Buffer(imgData, 'base64');
    rs.writeFile(`public/images/bg/${req.body.name}`, dataBuffer, function (err) {
        if (err) {
            res.send({
                code: 401,
                msg:err
            })
        } else {
            let url = `http://127.0.0.1/images/bg/${req.body.name}`//图片路径
            const sql = `UPDATE  user set user_bg=? where id=?`
            db.query(sql, [url, req.user.id], (err, resule)=>{
                if (err) {
                    return res.send({
                        code: 401,
                        msg:err.message
                    })
                }
                if (resule.affectedRows === 1) {
                    res.send({
                        code: 200,
                        msg:'背景更换成功'
                    })
                }
            })
        }
    })
})

//删除用户精选接口
router.delete('/user/deletephotos', (req, res) => {
    var featured=[]
    const getphotos = `select featured from user where id= ?`;
    db.query(getphotos, [req.user.id], function (err,result) {
        if (err) { return res.send({ code: 500, msg: err }) }
        else {
            // for (let [index, item] of new Map(JSON.parse(result[0].featured).map((item, index) => [index, item]))) {
            //     console.log(index,item.id)
            // }
            for (let item of JSON.parse(result[0].featured)) {
                featured.push(item);
            }
            let newArr = featured.filter(
                item => !req.body.deleteID.some(
                    val => item.id === val
                )
            )
            addphotos(newArr,req,res)
        }
    })
})

module.exports=router