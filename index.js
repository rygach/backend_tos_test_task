const express = require('express');
const mongoose = require('mongoose');

const corsMiddleware = require('./middleware/corsMiddleware');
// испортируем роутер для аутенфикации
const authRouter = require('./authRouter');
const PORT = process.env.PORT || 5000;

const app = express();

// вводим настройки CORS
app.use(corsMiddleware);

// чтобы наш сервак мог парсить JSON
app.use(express.json());
// чтобы сервак слушал путь /auth и по нему выполнял логику роутинга (см. файл authRouter)
app.use('/auth', authRouter);

const start = async () => {
  try {
    // подключаемся к БД (не бэкэнду!), в ссылке на монгус указываем пароль к БД и пользователя. раньше нужно было ещё указывать название БД, но в новой версии походу не нужно
    await mongoose.connect(
      'mongodb+srv://rygach:oluzaf22@cluster0.2rxke.mongodb.net/?retryWrites=true&w=majority',
    );
    // прослушиваем порт, он хранится в переменной PORT (нода сама считает свободный порт с моих настроек из свойства env объекта process, либо укажет порт, который поставил я)
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
