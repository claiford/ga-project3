const express = require('express');
const cors = require('cors');
const passport = require("passport")

const http = require('http');
const { Server } = require("socket.io");

// const path = require('path');
// const cookieParser = require('cookie-parser');
const socketsManager = require('./listeners/socketsManager.js');

require('dotenv').config(); // process config vars => procces.env.VAR
require('./config/database'); // connect to the database with AFTER the config vars are processed
const customerRouter = require('./routes/CustomerRouter.js');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
    }
});

// Router import
const authRouter = require("./routes/authRouter");

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
}));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use("/", authRouter);
app.use('/customer', customerRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.get('/', function(req, res) {
    res.send("backend running")
})

const sessionsController = require('./controllers/SessionsController')
app.get('/customer/group/groupid', sessionsController.index)
app.post('/session/new', sessionsController.create)
app.put('/session/:sessionid/handle-voting', sessionsController.handleVoting)
app.put('/session/:sessionid/handle-archive', sessionsController.handleArchive)

///// SOCKET
io.on('connection', socketsManager.onConnect)
///// SOCKET

httpServer.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});
