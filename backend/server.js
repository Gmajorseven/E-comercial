const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const { readdirSync } = require('fs')

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

readdirSync('./routes').map((path) => app.use('/api', require(`./routes/${path}`)))


app.listen(5000, () => console.log("Server is running on port 5000"))