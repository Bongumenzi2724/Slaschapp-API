const router=require('express').Router()

const {addBaitToCart, decrementBaitQuantity, removeBaitFromCart, getCartCount, getCart} = require('../controllers/cart_controller');

router.post('/bait/:baitID',addBaitToCart);

router.get('/bait/decrement/:cartID',decrementBaitQuantity);

router.delete('/bait/remove/:baitID',removeBaitFromCart);

router.get('/count',getCartCount);

router.get('/bait/:cartID',getCart)

module.exports=router