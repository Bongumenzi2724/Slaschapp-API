const router=require('express').Router()
const {addBaitToCart, decrementBaitQuantity, removeBaitFromCart, getCartCount, getCart} = require('../controllers/cart_controller');

router.post('/:baitID/:userID',addBaitToCart);

router.delete('/decrement/:baitID',decrementBaitQuantity);

router.delete('/remove/:cartItemID/:userID',removeBaitFromCart);

router.get('/count',getCartCount);

router.get('/:cartID',getCart)

module.exports=router