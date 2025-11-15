// utils/websocketUtils.ts
import { websocketAppointment } from "@/newService/config/websocket/websocketService";

/** 
 * Waits for WebSocket connection (max wait = timeout ms)
 * Returns true if connected, false if timeout or failure.
 */
export const waitForWebSocketConnection = async (timeout = 5000): Promise<boolean> => {
    return new Promise(async (resolve) => {
        let interval: NodeJS.Timeout | null = null;
        try {
            await websocketAppointment.connect();

            const startTime = Date.now();
            interval = setInterval(() => {
                const isConnected = (websocketAppointment as any).stompClient?.connected;

                if (isConnected) {
                    if (interval) clearInterval(interval);
                    resolve(true);
                } else if (Date.now() - startTime > timeout) {
                    if (interval) clearInterval(interval);
                    resolve(false);
                }
            }, 200);
        } catch {
            if (interval) clearInterval(interval);
            resolve(false);
        }
    });
};