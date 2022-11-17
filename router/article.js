const express = require('express');
const router = express.Router();
const expressjoi = require('@escook/express-joi');
const {
    article_add
}=require('../scheme/user')

const db = require('../mysql/mysqluser');

//获取文章列表接口
router.get("/api/article/list", (req, res) => {
    const sql = `select * from artide_cate where is_delete= ?`;
    db.query(sql, 0, (err, resulet) => {
        if (err) {
            return res.send({
                code: 400,
                msg:err.message
            })
        }
        if (resulet.affectedRows === undefined) {
            return res.send({
                code: 200,
                msg:'分类不存在'
            })
        } else {
            return res.send({
                code: 200,
                msg: "获取分类成功",
                data:resulet
            })
        }
    })
})

//添加分类列表接口
router.post('/article/add', expressjoi(article_add), (req, res) => {
    const sql = `INSERT INTO artide_cate set ?`
    db.query(sql, req.body, (err, result) => {
        if (err) {
            return res.send({
                code: 401,
                msg:err.message
            })
        }
        if (result.affectedRows !== 0) {
            return res.send({
                code: 200,
                msg:'添加成功'
            })
        }
    })
})

module.exports=router