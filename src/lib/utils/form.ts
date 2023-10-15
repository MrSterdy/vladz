import type { SuperValidated, ZodValidation } from "sveltekit-superforms";
import type { AnyZodObject } from "zod";
import { showToastError, showToastSuccess } from "$lib/utils/toast";

export function handleUpdated({
    form
}: {
    form: Readonly<SuperValidated<ZodValidation<AnyZodObject>>>;
}) {
    if (form.valid) {
        showToastSuccess(form.message);
    } else {
        showToastError(form.message || "Произошла ошибка");
    }
}

export function handleError({
    result: { error }
}: {
    result: { error: App.Error };
}) {
    showToastError(error.message);
}
