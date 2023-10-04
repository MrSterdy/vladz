import dayjs from "dayjs";
import "dayjs/locale/ru";

window.Telegram.WebApp.ready();

window.Telegram.WebApp.BackButton.onClick(() => window.history.back());

window.Telegram.WebApp.expand();

dayjs.locale("ru");
