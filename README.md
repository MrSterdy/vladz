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
-   Автоматический перенос домашних заданий при изменении расписаний

### Роли и возможности администрации

-   **Администратор** - назначение помощников
-   **Помощник** - полный контроль над всеми группами

### Роли и возможности участников группы

-   **Куратор** - управление участниками и заявками группы
-   **Редактор** - изменение расписаний, каникул и предметов группы

## Локальный запуск

#### Переменные сред

Для запуска проекта вам потребуется добавить следующие переменные в `.env`

`DATABASE_URL` - ссылка подключения к базе данных _(PostgreSQL)_

`TELEGRAM_BOT_TOKEN` - токен бота в Телеграме

`ADMIN_ID` - ID администратора в Телеграме

`MINIO_ENDPOINT` - эндпоинт MinIO API

`MINIO_PORT` - порт MinIO API

`MINIO_SSL` - требовать ли SSL при запросах к MinIO

`MINIO_ACCESS_KEY` - ключ доступа MinIO

`MINIO_SECRET_KEY` - секрет MinIO

`PUBLIC_MAX_FILES` - максимальное кол-во файлов за 1 ДЗ

`PUBLIC_MAX_FILE_SIZE` - максимальный размер файла _(в байтах)_

### Docker

Постройте и запустите проект

```bash
docker compose build --build-arg TELEGRAM_BOT_TOKEN="<TOKEN>" --build-arg ADMIN_ID="<ID>"
docker compose up
```

Затем сделайте `http://localhost:5173` публичным (для примера взят [ngrok](https://ngrok.com))

```bash
ngrok http http://localhost:5173
```

И привяжите новоиспеченную ссылку к кнопке вашего бота через `BotFather`