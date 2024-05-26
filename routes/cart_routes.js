const router=require('express').Router()

const {create_cart,getCart, updateCart} = require('../controllers/cart_controller');

router.post('/add-bait',create_cart);
router.patch('/bait/update-cart/:cartID',updateCart);
router.get('/',getCart);

module.exports=router