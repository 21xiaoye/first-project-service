const db = require('../mysql/mysqluser')

exports.shoppingList = (req, res) => {
    const getclassF = `SELECT * FROM schopping;`
    db.query(getclassF, (err, result)=>{
        if (err) {
            return res.send({
                code: '500',
                msg:err
            })
        }
        res.send({
            code: 200,
            msg:'成功',
            data:result
        })
    })
}
exports.bannerlist = (req, res) => {
    const str = `SELECT * FROM banner`
    db.query(str, (err, result) => {
        if (err) {
            return res.send({
                code: 500,
                msg: err
            })
        }
        res.send({
            code: 200,
            msg: '成功',
            data:result
        })
    })
}
exports.classFlist = (req, res) => {
    const str = `SELECT * FROM classlist WHERE uid=?;`
    db.query(str, [req.query.uid], (err, result) => {
        if (err) {
            return res.send({
                code: 200,
                msg:err
            })
        }
        if (result[0].recommend==null) {
            return res.send({
                code: 200,
                msg:"该分类没有商品存在"
            })
        } else {
            let recommend = JSON.parse(result[0].recommend)
            return res.send({
                code: 200,
                msg: '成功',
                data:recommend
            })
        }
    })
}
exports.barndPList = (req,res)=> {
    const str = `SELECT * FROM productinfo WHERE uid=?`
    db.query(str, [req.query.uid], (err, result)=>{
        if (err) return res.send({ code: '500', msg: err })
        for (let item of result) {
            item.banner = JSON.parse(item.banner)
            item.parameter = JSON.parse(item.parameter);
        }
        if (result.length ==0) {
            return res.send({
                code: 200,
                msg:'分类不存在'
            })
        }
        res.send({
            code: '200',
            msg: '获取商品成功',
            data:result
        })
    })
}

exports.commodity = (req, res) => {
    const str = `SELECT * FROM productinfo WHERE id=?;`
    db.query(str, [req.query.id], (err, result) => {
        if (err) return res.send({ code: 403, msg: 'err' })
        if(result.length!=0) {
            for (let item of result) {
                item.banner = JSON.parse(item.banner)
                item.parameter = JSON.parse(item.parameter)
                item.have = JSON.parse(item.have)
            }
            res.send({
                code: 200,
                msg: '成功',
                data:result
            })
        } else {
            return res.send({
                code: 200,
                msg: '商品不存在',
                data:result
            })
        }
    })
}