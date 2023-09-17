<script lang="ts">
    import { enhance } from "$app/forms";

    import type { ActionResult } from "@sveltejs/kit";
    import { goto } from "$app/navigation";
    import { REDIRECT_PARAM_NAME } from "$lib/consts";
    import { page } from "$app/stores";

    function submit() {
        return ({ result }: { result: ActionResult, update: () => void }) => {
            if (result.type === "success") {
                const loginUrl = new URL("/login", $page.url.origin);
                const dashboardUrl = new URL("/dashboard", $page.url.origin);
                loginUrl.searchParams.set(REDIRECT_PARAM_NAME, dashboardUrl.toString());

                return goto(loginUrl, { replaceState: true })
            }
        }
    }
</script>

<form method="post" use:enhance={submit}>
    <input name="first_name" type="text" placeholder="Имя" />
    <input name="last_name" type="text" placeholder="Фамилия" />

    <input type="submit" />
</form>
