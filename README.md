# 🏆 Tournament Bracket System
---

## 📖 Описание проекта
Система для создания и управления турнирными сетками. Пользователи могут создавать турниры, загружать участников и проводить голосования в формате "кто лучше".

---

## 🛠 Технологический стек

- **Backend:** `NestJS` + `Sequelize TypeScript`
- **Frontend:** `React`
- **Database:** `PostgreSQL` (запускается в Docker)
- **Data Seeding:** `Sequelize CLI` + `Faker.js`

---

## 🚀 Быстрый старт

### 1️⃣ Подготовка Backend
Зайдите в папку бэкенда и установите зависимости:
```bash
cd backend
npm install

Создайте файл .env на основе примера и настройте доступы:
bash
cp .env.example .env
```

### 2️⃣ Запуск базы данных
Запустите Docker-контейнер с PostgreSQL:
```bash
docker-compose up -d
```

### 3️⃣ Миграции и Тестовые данные
Создайте структуру таблиц и наполните базу через сидеры:
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 4️⃣ Запуск приложений
Backend:
```bash
npm run start:dev
```

Frontend:
```bash
cd ../frontend
npm install
npm run dev
```
---
## 🔐 Тестовый аккаунт
Вы можете использовать готовый аккаунт для входа:
Email: test@example.com
Password: password123