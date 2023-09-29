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
