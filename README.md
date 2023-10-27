[![MIT License](https://img.shields.io/badge/license-MIT-green.svg?color=3F51B5&style=for-the-badge&label=License&logoColor=000000&labelColor=ececec)](https://opensource.org/licenses/MIT)

# Владз

**Владз** - ваш помощник по просмотру и управлению расписаний и домашних заданий на любой день

## Особенности

-   Приятный дизайн
-   Темная и светлая темы _(зависит от настроек Телеграма)_
-   Возможность создания групп и приглашения участников
-   Удобный просмотр и изменение расписаний _(Начало занятий, предметы и их преподаватели, кабинеты, домашние задания)_
-   Уведомления о различных событиях
-   Разделение участников по ролям _(Участник -> Редактор -> Куратор)_
-   Автоматический перенос домашних заданий при изменении расписаний _(**ВАЖНО!!!** ДЗ не переносится, если следующее занятие уже содержит ДЗ)_

### Роли и возможности администрации

-   **Администратор** - назначение помощников
-   **Помощник** - полный контроль над всеми группами

### Роли и возможности участников группы

-   **Куратор** - управление участниками и заявками группы
-   **Редактор** - изменение расписаний, каникул и предметов группы

## Локальный запуск

#### Переменные сред

`DATABASE_URL` - ссылка подключения к базе данных _(PostgreSQL)_

`TELEGRAM_BOT_TOKEN` - токен бота в Телеграме

`ADMIN_ID` - ID администратора в Телеграме

`MINIO_ENDPOINT` - эндпоинт MinIO API

`MINIO_PORT` - порт MinIO API

`MINIO_SSL` - требовать ли SSL при запросах к MinIO

`MINIO_ACCESS_KEY` - ключ доступа MinIO

`MINIO_SECRET_KEY` - секрет MinIO

`ORIGIN` - ссылка будущего сайта

### Docker

Сделайте порт `5173` публичным (для примера взят [ngrok](https://ngrok.com))

```bash
ngrok http 5173
```

Постройте и запустите проект, указав токен бота в Телеграм, Телеграм ID администратора и получившуюся https ссылку ngrok

```bash
docker compose build --build-arg TELEGRAM_BOT_TOKEN=<TOKEN> --build-arg ADMIN_ID=<ID> --build-arg ORIGIN=<NGROK_HTTPS_URL>
docker compose up
```

И привяжите ссылку к кнопке вашего бота через `BotFather`

## Скриншоты

![Скриншот](https://user-images.githubusercontent.com/83646375/276526012-36f36878-8a81-44df-bc33-a34b72045b0e.png)
![Скриншот](https://user-images.githubusercontent.com/83646375/276526023-f3b52339-206b-4d8b-9996-454131a5a439.png)
![Скриншот](https://user-images.githubusercontent.com/83646375/276526027-bbbf3f0c-e820-4d38-b033-dc5497578391.png)
![Скриншот](https://user-images.githubusercontent.com/83646375/276526030-1e73a08f-291e-42fd-8f3e-e8ab452933e2.png)
