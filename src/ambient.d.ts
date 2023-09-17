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
    show: () => voild;
    hide: () => voild;
    enable: () => voild;
    disable: () => voild;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
    setParams: (params: MainButtonParams) => void;
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
        MainButton: TelegramMainButton;
        onEvent: (
            eventType: TelegramWebAppEvent,
            eventHandler: () => unknown
        ) => void;
        offEvent: (
            eventType: TelegramWebAppEvent,
            eventHandler: () => unknown
        ) => void;
        sendData: (data: unknown) => void;
        ready: () => void;
        expand: () => void;
        close: () => void;
    }

    interface Window {
        Telegram: {
            WebApp: TelegramWebApp;
        };
    }
}

export {};
