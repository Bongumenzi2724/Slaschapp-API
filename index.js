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
const businessRouter=require('./routes/business')
//Database Connection
const connectDB = require('./db/connect')
//midlleware
const authenticateUser=require('./middleware/authentication');
//error-handler
const notFoundMiddleWare=require('./middleware/no-found')
const errorHandlerMiddleWare=require('./middleware/error-handler')
const swaggerJSdoc = require('swagger-jsdoc')
const swaggerUI=require('swagger-ui-express')


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
app.use('/api/slaschapp/auth',authRouter)
app.use('/api/slaschapp/business',authenticateUser,businessRouter)
const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Business Management API",
            version:"1.0.0",
            description:"Business API",

        },
        servers: [
            {
                url:"http://localhost:3000"
            },
        ],
    },
    apis:["./routes/*.js"]
} 

const specs=swaggerJSdoc(options)

app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(specs))

const port=process.env.PORT||5000
const start=async()=>{
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(3000,()=>console.log(`Server is listening on port 3000`))
    }
    catch(error){
        console.log(error)
    }
}
start()

// Error middleware
app.use(notFoundMiddleWare)
app.use(errorHandlerMiddleWare)