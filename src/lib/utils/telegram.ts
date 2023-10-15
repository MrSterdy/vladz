export function showConfirm(
    message: string,
    onSuccess: () => Promise<void> | void,
    onCancel: () => Promise<void> | void = () => {}
) {
    if (import.meta.env.DEV) {
        onSuccess();
    } else {
        window.Telegram.WebApp.showConfirm(message, ok =>
            ok ? onSuccess() : onCancel()
        );
    }
}
