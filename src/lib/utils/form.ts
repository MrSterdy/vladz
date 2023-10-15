import type { SuperValidated, ZodValidation } from "sveltekit-superforms";
import { toast } from "@zerodevx/svelte-toast";
import type { AnyZodObject } from "zod";
import type { ActionResult } from "@sveltejs/kit";

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

export function handleKit(successMessage?: string) {
    return async ({ result, update }: { result: ActionResult, update: () => void }) => {
        if (result.type === "error") {
            toast.push((result.error as App.Error).message, { classes: ["toast-error"] });
        } else if (result.type === "failure") {
            toast.push("Произошла ошибка", { classes: ["toast-error"] });
        } else if (result.type === "success" && successMessage) {
            toast.push(successMessage, { classes: ["toast-success"] });
        }

        update();
    }
}
