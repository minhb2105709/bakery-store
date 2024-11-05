const express = require('express');
const cors = require('cors');

const JSend = require('./jsend');
const cartRouter = require('./routes/cart.router');
const adminRouter = require('./routes/admin.router');
const customerRouter = require('./routes/customers.router');
const productRouter = require('./routes/products.router');
const authRouter = require('./routes/auth.router');

const knex = require('./database/knex');
// khai báo session
const session = require('express-session');

const {
    resourceNotFound,
    handleError,
} = require('./controllers/errors.controller');

const { specs, swaggerUi } = require('./docs/swagger');

const app = express();

// Cấu hình CORS với credentials cho phép gửi cookie session
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // Cho phép gửi cookie qua CORS
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// định nghĩa session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
}))

// kiểm tra kết nối đến cơ sở dữ liệu
app.get('/api/check-connection', async (req, res) => {
    try {
        await knex.raw('SELECT 1');
        res.json({ message: 'Kết nối thành công đến cơ sở dữ liệu!' });
    } catch (error) {
        res.status(500).json({ error: 'Không thể kết nối đến cơ sở dữ liệu', details: error.message });
    }
});


app.get('/', (req, res) => {
    return res.json(JSend.success());
});

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

authRouter.setup(app);
cartRouter.setup(app);
adminRouter.setup(app);
customerRouter.setup(app);
productRouter.setup(app);

// error handling
app.use(resourceNotFound);
app.use(handleError);

module.exports = app;