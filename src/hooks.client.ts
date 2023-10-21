import type { HandleClientError } from "@sveltejs/kit";
import dayjs from "dayjs";
import "dayjs/locale/ru";

import { hslToHex } from "$lib/utils/color";

export const handleError: HandleClientError = ({ error }) => {
    console.error(error);

    return { message: "Произошла непредвиденная ошибка" };
};

window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

const styles = getComputedStyle(document.body);
const primaryColor = styles
    .getPropertyValue("--p")
    .split(" ")
    .map(c => parseInt(c));

const baseColor = styles
    .getPropertyValue("--b1")
    .split(" ")
    .map(c => parseInt(c));

window.Telegram.WebApp.MainButton.color = hslToHex(
    primaryColor[0],
    primaryColor[1],
    primaryColor[2]
);

window.Telegram.WebApp.setHeaderColor(
    hslToHex(baseColor[0], baseColor[1], baseColor[2])
);

dayjs.locale("ru");
