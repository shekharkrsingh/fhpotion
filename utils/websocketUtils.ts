// utils/websocketUtils.ts
import { websocketAppointment } from "@/newService/config/websocket/websocketAppointment";

/** 
 * Waits for WebSocket connection (max wait = timeout ms)
 * Returns true if connected, false if timeout or failure.
 */
export const waitForWebSocketConnection = async (timeout = 5000): Promise<boolean> => {
    return new Promise(async (resolve) => {
        try {
            await websocketAppointment.connect();

            const startTime = Date.now();
            const interval = setInterval(() => {
                const isConnected = (websocketAppointment as any).stompClient?.connected;

                if (isConnected) {
                    clearInterval(interval);
                    resolve(true);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    resolve(false);
                }
            }, 200);
        } catch {
            resolve(false);
        }
    });
};