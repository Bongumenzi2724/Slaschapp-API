const router=require('express').Router()

const {create_cart,getCart, updateCart, getAllOrders, searchBasedOnCode} = require('../controllers/cart_controller');

router.post('/add-bait',create_cart);
router.patch('/update-cart/:cartId',updateCart);
router.get('/:cartId',getCart);
router.get('/orders',getAllOrders)
router.get('/codes/order',searchBasedOnCode)
module.exports=router