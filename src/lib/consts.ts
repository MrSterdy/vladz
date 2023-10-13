export const AUTH_ACCESS_COOKIE_NAME = "vlad-pechenie";
export const AUTH_REFRESH_COOKIE_NAME = "vlad-obnova";
export const AUTH_TELEGRAM_COOKIE_NAME = "vlad-telega";

export const REDIRECT_PARAM_NAME = "vlad-tuda";

export const weekdays = [
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота"
] as const;

export const userRoles = {
    "ADMIN": "администратор",
    "HELPER": "помощник",
    "USER": "пользователь"
} as const;

export const groupUserRoles = {
    "CURATOR": "куратор",
    "REDACTOR": "редактор",
    "STUDENT": "студент",
    "APPLICATION": "заявка"
} as const;

export const imageTypes = ["image/png", "image/jpg", "image/jpeg"];
