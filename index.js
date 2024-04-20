const express= require('express')
require('dotenv').config()
require('express-async-errors')
const app = express()
//extra security packages
const helmet=require('helmet')
const cors=require('cors')
//const xss=require('xss-clean')
const rateLimiter=require('express-rate-limit')
//routers

const authRouter=require('./routes/authentication')
const allRouter=require('./routes/AllRoutes')
const businessRouter=require('./routes/business')
const businessSearchRouter=require('./routes/search')
const dataRouter=require('./routes/dataRoutes')
//Database Connection
const connectDB = require('./db/connect')
//middleware
const authenticateUser=require('./middleware/authentication');
//error-handler
const notFoundMiddleWare=require('./middleware/no-found')
const User=require('./models/UserRegistrationSchema')
const Auction=require('./models/AuctionSchema')
const Business=require('./models/BusinessRegistrationSchema')
const errorHandlerMiddleWare=require('./middleware/error-handler')
//Swagger
const swaggerUI=require('swagger-ui-express')
const YAML=require('yamljs')
const swaggerDocument=YAML.load('./swagger.yaml')
app.set('trust proxy',1);
app.use(rateLimiter({
    windowMS:15*60*1000,//15 minutes
    max:100,//Limit each IP to 100 requests per windowsMS
})) 
app.use(express.json())
app.use(helmet())
app.use(cors())
//app.use(xss())



//Routes
app.use('/api/slaschapp/all',allRouter);
app.use('/api/slaschapp/business/auction',businessRouter);
app.use('/api/slaschapp/auth',authRouter);
app.use('/api/slaschapp/business',authenticateUser,businessRouter);
app.use('/api/slaschapp/search',authenticateUser,businessSearchRouter);
app.use('/api/slaschapp/data',dataRouter);
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

