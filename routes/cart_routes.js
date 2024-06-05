const router=require('express').Router()

const {create_cart,getCart,get_business_cart,updateCart, getAllOrders, searchBasedOnCode} = require('../controllers/cart_controller');

router.post('/add-bait',create_cart);
router.patch('/update-cart/:cartId',updateCart);
router.get('/:cartId',getCart);
router.get('/orders',getAllOrders)
router.get('/codes/order',searchBasedOnCode)
router.get('/orders/:auctionId',get_business_cart)
module.exports=router