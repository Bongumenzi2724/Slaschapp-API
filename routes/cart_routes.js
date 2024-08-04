const router=require('express').Router()

const {create_cart,getCart,get_business_cart,update_cart_checkout, getAllOrders, searchBasedOnCode, user_orders, update_cart_remove_item} = require('../controllers/cart_controller');

router.post('/add-bait',create_cart);

router.patch('/update-cart/:cartId',update_cart_checkout);

router.get('/:cartId',getCart);

router.get('/orders/:userId',getAllOrders);

router.get('/codes/order/:code',searchBasedOnCode);

router.get('/orders/:auctionId',get_business_cart);

router.get('/owner/orders',user_orders);

router.patch('/remove-item/:cartId',update_cart_remove_item);

module.exports=router