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
const userSearchRouter=require('./routes/userSearch')
const businessSearchRouter=require('./routes/businessSearch')
const businessRouter=require('./routes/business')

//Database Connection
const connectDB = require('./db/connect')
//midlleware
const authenticateUser=require('./middleware/authentication');

//error-handler
const notFoundMiddleWare=require('./middleware/no-found')
const errorHandlerMiddleWare=require('./middleware/error-handler')

//Swagger
const swaggerUI=require('swagger-ui-express')
const YAML=require('yamljs')
const swaggerDocument=YAML.load('./swagger.yml')

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
app.use('/api/slaschapp/business/search',authenticateUser,businessSearchRouter)
app.use('/api/slaschapp/user/search',authenticateUser,userSearchRouter) 

/* const options={
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
}  */
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

