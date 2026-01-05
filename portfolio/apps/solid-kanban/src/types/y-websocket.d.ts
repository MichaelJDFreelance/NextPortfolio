declare module "y-websocket" {
    class WebsocketProvider {
        constructor(
            serverUrl: string,
            room: string,
            doc: any,
            opts?: any
        );

        // --- instance properties ---
        ws: WebSocket | null;
        roomname: string;
        doc: any;
        awareness: any;
        shouldConnect: boolean;
        connected: boolean;

        // --- instance methods ---
        connect(): void;
        disconnect(): void;
        destroy(): void;

        // Awareness API (Yjs)
        on(eventName: string, callback: (...args: any[]) => void): void;
        off(eventName: string, callback: (...args: any[]) => void): void;
    }

    export { WebsocketProvider };
}