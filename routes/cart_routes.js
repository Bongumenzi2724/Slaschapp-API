const router=require('express').Router()

const {create_cart,getCart,get_business_cart,updateCart, getAllOrders, searchBasedOnCode, user_orders} = require('../controllers/cart_controller');

router.post('/add-bait',create_cart);
router.patch('/update-cart/:cartId',updateCart);
router.get('/:cartId',getCart);
router.get('/orders/:userId',getAllOrders);
router.get('/codes/order/:code',searchBasedOnCode);
router.get('/orders/:auctionId',get_business_cart)
router.get('/owner/orders',user_orders)
module.exports=router