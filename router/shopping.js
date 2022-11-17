const express = require('express')
const router = express.Router()
const handler=require('../router_handler/shopping')

//获取商品分类
router.get('/api/shopping/list', handler.shoppingList);

//获取轮播图
router.get('/api/shopping/banner', handler.bannerlist)

//获取classlist
router.get('/api/shopping/classFlist', handler.classFlist)

//获取品牌商品列表信息
router.get('/api/shopping/barnd/list', handler.barndPList)

//获取商品详细信息
router.get('/api/shopping/commodity',handler.commodity)
module.exports = router;