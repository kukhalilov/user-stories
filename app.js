const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const path = require('path')
const pug = require('pug')
const app = express()
const PORT = process.env.PORT || 3000

// Load config
dotenv.config({path: './config/config.env'})

// Connect to database
connectDB()

// Set view engine
app.set('view engine', 'pug')

// Routes
app.use('/', require('./routes/index'))

// Static assets
app.use(express.static(path.join(__dirname, 'public')))

// Console logging methods, requests ...
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.listen(PORT, err => {
    if (err) throw err

    console.log(`Server running on port ${PORT}`)
})