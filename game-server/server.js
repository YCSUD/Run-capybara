const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const usersFilePath = path.join(__dirname, 'users.json');

// Функция для чтения пользователей из файла
function readUsers() {
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, '[]');
    }
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
}

// Функция для записи пользователей в файл
function writeUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Регистрация
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    const users = readUsers();

    // Проверка, существует ли пользователь
    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким логином или email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const newUser = { username, email, password: hashedPassword };
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
});

// Авторизация
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const users = readUsers();

    // Поиск пользователя
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    res.status(200).json({ message: 'Авторизация успешна', username: user.username });
});

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});