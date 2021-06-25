const express                   = require('express')

const app = express()

app.get('/',(req,res) =>{
    res.end(`hello from server`)
})

const port = 8000
app.listen(port,() =>{
    console.log(`running at http://localhost:8000`)
})

