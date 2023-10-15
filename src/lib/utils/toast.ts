import { toast } from "@zerodevx/svelte-toast";

export function showToastSuccess(message: string) {
    toast.push(message, { classes: ["toast-success"] });
}

export function showToastError(message: string) {
    toast.push(message, { classes: ["toast-error"] });
}
