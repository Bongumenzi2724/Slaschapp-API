const router=require('express').Router()

const {create_cart,getCart, updateCart, getAllOrders} = require('../controllers/cart_controller');

router.post('/add-bait',create_cart);
router.patch('/bait/update-cart/:cartId',updateCart);
router.get('/:cartId',getCart);
router.get('/orders',getAllOrders)

module.exports=router