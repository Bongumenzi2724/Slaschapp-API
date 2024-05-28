const express= require('express')
require('dotenv').config()
require('express-async-errors')
const app = express()
//extra security packages
const helmet=require('helmet')
const cors=require('cors')
const bodyParser=require('body-parser');
//const xss=require('xss-clean')
const rateLimiter=require('express-rate-limit')

//routers
const authRouter=require('./routes/authentication')
const adminRouter=require('./routes/admin_routes')
const businessRouter=require('./routes/business')
const businessSearchRouter=require('./routes/search')
const dataRouter=require('./routes/dataRoutes')
const baitRouter=require('./routes/bait_plant')
const ownerRouter=require('./routes/owner')
const categoriesRouter=require('./routes/categories')
const feedsRoute=require('./routes/feeds')
const cartRouter=require('./routes/cart_routes')
const accountRouter=require('./routes/transactions')
const searchRouter=require('./routes/search_route')
const userProfile=require('./routes/user_profile')
const verificationRouter=require('./routes/verification_routes')
//Database Connection
const connectDB = require('./db/connect')
//middleware
const authenticateUser=require('./middleware/authentication');
//error-handler
const notFoundMiddleWare=require('./middleware/no-found')
const errorHandlerMiddleWare=require('./middleware/error-handler')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy',1);
app.use(rateLimiter({
    windowMS:15*60*1000,//15 minutes
    max:100,//Limit each IP to 100 requests per windowsMS
})) 
app.use(express.json())
app.use(helmet())
app.use(cors())
//Swagger
const swaggerUI=require('swagger-ui-express')
const YAML=require('yamljs')
const swaggerDocument=YAML.load('./swagger.yaml')

//Routes
app.use('/api/slaschapp/admin',adminRouter);
app.use('/api/slaschapp/business/auction',authenticateUser,businessRouter);
app.use('/api/slaschapp/auth',authRouter);
app.use('/api/slaschapp/business',authenticateUser,businessRouter);
app.use('/api/slaschapp/search',authenticateUser,businessSearchRouter);
app.use('/api/slaschapp/data',dataRouter);
app.use('/api/slaschapp/bait',authenticateUser,baitRouter);
app.use('/api/slaschapp/category',categoriesRouter)
app.use('/api/slaschapp/feeds',authenticateUser,feedsRoute)
app.use('/api/slaschapp/business/owner',authenticateUser,ownerRouter)
app.use('/api/slaschapp/cart',authenticateUser,cartRouter)
app.use('/api/slaschapp/transaction/bait',accountRouter)
app.use('/api/slaschapp/master',authenticateUser,searchRouter)
app.use('/api/slaschapp/profile',authenticateUser,userProfile);

app.use('/api/slaschapp/verification',verificationRouter);
app.get('/',(req,res)=>{
    res.send('<h1>Business API</h1><a href="/api-docs">Documentation</a>');
})
//API DOCS SWAGGER-UI URL 
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocument)) 
// Error middleware
app.use(notFoundMiddleWare)
app.use(errorHandlerMiddleWare)
const port=process.env.PORT||5000
//Starting Database Connection
const start=async()=>{
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port,()=>console.log(`Server is listening on port ${port}`))
    }
    catch(error){
        console.log(error)
    }
}
start()

