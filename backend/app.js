const express = require('express')
require('dotenv').config()
const PORT = process.env.PORT || 4000;
const app = express();
const axios = require('axios')
const rateLimit = require('express-rate-limit')
const API_KEY = process.env.API_KEY
const API_URL = `https://v6.exchangerate-api.com/v6/`

const apiLimiter = rateLimit({
    windowMs: 15*60*1000,// * 15 minutes
    max: 100 
})

// ! == MIDDLEWARES ==
app.use(express.json())
app.use(apiLimiter)

// ! == CONVERSION ==
app.post('/api/convert', async(req,res) => {
    // * GET THE USER DATA
    try{
        const {from,to,amount} = req.body;
        const url = `${API_URL}/${API_KEY}/pair/${from}/${to}/${amount}`
        const response = await axios.get(url)
        if(response.data && response.data.result === 'success'){
            res.json({
                base: from,
                target: to,
                conversionRate: response.data.conversion_rate,
                convertedAmount: response.data.conversion_result
            })
        }else{
            res.json({
                message:'Error converting currency...', 
                details: response.data
            })
        }
    }catch(error){
        res.json({
            message:'Error converting currency...', 
            details: error.message
        })
    }
})

// ! == START THE SERVER ==
app.listen(PORT,() => {
    console.log(`LISTENING on port: ${PORT}.....`)
})



 