const SECRET = 'JOGODAVELHA';
const KEY = 'nickname';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cookie = cookieParser(SECRET);
const store = new expressSession.MemoryStore();

let lastEmitter;

app.use(express.static(path.join(__dirname, '/ProgWebTrab/public')));
app.set('views', path.join(__dirname, '/ProgWebTrab/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(cookie);
app.use(expressSession({
  secret: SECRET,
  name: KEY,
  resave: true,
  saveUninitialized: true,
  store: store
}));

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

io.use((socket, next) => {
  let data = socket.request;
  cookie(data, {}, (err) => {
    let ID = data.signedCookies[KEY];
    store.get(ID, (err, session) => {
      if (err || !session) {
        return next(new Error('Acesso negado!'));
      } else {
        socket.handshake.session = session;
        return next();
      }
    });
  });
});

app.get('/', (req, res) => {
  res.render('login.html');
});

app.post('/', (req, res) => {
  req.session.nickname = req.body.nickname;
  res.render('game.html');
});

let messages = [];
io.on('connection', socket => {
  let nickname = socket.handshake.session.nickname
  console.log(`socket conectado: ${socket.id}`);

  socket.emit('previousMessages', messages);

  socket.on('move', data => {
    if (lastEmitter != nickname) {
      socket.emit('move', data);
      socket.broadcast.emit('move', data);
      lastEmitter = nickname;
    }
  });

  socket.on('resetGame', () => {
    socket.broadcast.emit('resetGame');
    lastEmitter = undefined;
  });

  socket.on('sendMessage', data => {
    data.author = nickname ? nickname : "Anonymous";
    messages.push(data);
    socket.emit('receivedMessage', data);
    socket.broadcast.emit('receivedMessage', data);
  });
  socket.on('disconnect', data => {
    console.log(`socket disconectado: ${socket.id}`);
  })
});

server.listen(3000, () => {
  console.log('Server rodando em http://localhost:3000');
});