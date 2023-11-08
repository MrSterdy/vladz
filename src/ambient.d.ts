interface TelegramMainButton extends MainButtonParams {
    setText: (text: string) => void;

    onClick(callback: () => void): void;
    offClick(callback: () => void): void;

    color: string;

    show: () => void;
    hide: () => void;

    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
}

interface TelegramBackButton {
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;

    show(): void;
    hide(): void;
}

declare global {
    interface TelegramWebApp {
        initData: string;

        colorScheme: string;
        setHeaderColor: (color: string) => void;

        MainButton: TelegramMainButton;
        BackButton: TelegramBackButton;

        showConfirm: (message, callback: (ok: boolean) => void) => void;

        ready: () => void;

        expand: () => void;

        openLink: (url: string) => void;
        openTelegramLink: (url: string) => void;
    }

    interface Window {
        Telegram: {
            WebApp: TelegramWebApp;
        };
    }
}

export {};
