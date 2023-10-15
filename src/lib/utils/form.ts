import type { SuperValidated, ZodValidation } from "sveltekit-superforms";
import { toast } from "@zerodevx/svelte-toast";
import type { AnyZodObject } from "zod";

export function handleUpdated({ form }: { form: Readonly<SuperValidated<ZodValidation<AnyZodObject>>> }) {
    if (form.valid) {
        toast.push(form.message, { classes: ["toast-success"] });
    } else {
        toast.push(form.message || "Произошла ошибка", { classes: ["toast-error"] });
    }
}

export function handleError({ result: { error } }: { result: { error: App.Error } }) {
    toast.push(error.message, { classes: ["toast-error"] });
}
