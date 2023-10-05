import dayjs from "dayjs";
import "dayjs/locale/ru";
import type { HandleClientError } from "@sveltejs/kit";

export const handleError: HandleClientError = ({ error }) => {
    console.error(error);

    return { message: "Произошла непредвиденная ошибка" };
};

window.Telegram.WebApp.ready();

window.Telegram.WebApp.BackButton.onClick(() => window.history.back());

window.Telegram.WebApp.expand();

dayjs.locale("ru");
