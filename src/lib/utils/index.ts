import dayjs from "dayjs";

export function capitalize(input: string) {
    return input[0].toUpperCase() + input.slice(1);
}

export function formatISOString(dateInput: Date): string;
export function formatISOString(stringInput: string): string;
export function formatISOString(input: Date | string) {
    return (typeof input === "string" ? new Date(input) : input)
        .toISOString()
        .split("T")[0];
}

export function parseDate(input: string) {
    return dayjs(input, "YYYY-MM-DD", true);
}

export function numberToTime(number: number) {
    const hours = Math.floor(number / 60);
    const minutes = number % 60;

    const result = hours > 9 ? hours + ":" : `0${hours}:`;

    return minutes > 9 ? result + minutes : `${result}0${minutes}`;
}

export function timeToNumber(time: string) {
    return time
        .split(":")
        .reduce((total, val, i) => total + (i ? +val : 60 * +val), 0);
}
