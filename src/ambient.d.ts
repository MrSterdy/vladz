interface TelegramWebAppUser {
    id: bigint;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    photo_url: string;
}

interface TelegramThemeParams {
    bg_color: string;
    text_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
}

interface WebAppInitData {
    query_id: string;
    user: TelegramWebAppUser;
    receiver: TelegramWebAppUser;
    start_param: string;
    auth_date: number;
    hash: string;
}

interface MainButtonParams {
    text?: string;
    color?: string;
    textColor?: string;
    isVisible?: boolean;
    isActive?: boolean;
}
interface TelegramMainButton extends MainButtonParams {
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick(callback: () => unknown): void;
    offClick(callback: () => unknown): void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
    setParams: (params: MainButtonParams) => void;
}

interface TelegramBackButton {
    isVisible: boolean;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
}

type TelegramWebAppEvent =
    | "themeChanged"
    | "viewportChanged"
    | "mainButtonClicked";

declare global {
    interface TelegramWebApp {
        initData: string;
        initDataUnsafe: WebAppInitData;
        colorScheme: string;
        themeParams: TelegramThemeParams;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        setHeaderColor: (color: string) => void;
        MainButton: TelegramMainButton;
        BackButton: TelegramBackButton;
        onEvent: (
            eventType: TelegramWebAppEvent,
            eventHandler: () => unknown
        ) => void;
        offEvent: (
            eventType: TelegramWebAppEvent,
            eventHandler: () => unknown
        ) => void;
        showConfirm: (message, callback: (ok: boolean) => void) => void;
        sendData: (data: unknown) => void;
        ready: () => void;
        expand: () => void;
        close: () => void;
        openLink: (url: string) => void;
    }

    interface Window {
        Telegram: {
            WebApp: TelegramWebApp;
        };
    }
}

export {};
