const router=require('express').Router()

const {addBaitToCart, decrementBaitQuantity, removeCartItem, getCartCount, getCart} = require('../controllers/cart_controller');

router.post('/bait/add/:baitID',addBaitToCart);
router.get('/bait/decrement/:baitID',decrementBaitQuantity);
router.delete('/bait/remove/:baitID',removeCartItem);
router.get('/bait/count',getCartCount);
router.get('/bait',getCart);

module.exports=router