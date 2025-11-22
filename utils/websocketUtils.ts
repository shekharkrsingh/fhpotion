import { websocketAppointment } from "@/newService/config/websocket/websocketService";

export const waitForWebSocketConnection = async (timeout = 5000): Promise<boolean> => {
    return new Promise(async (resolve) => {
        let interval: NodeJS.Timeout | null = null;
        let resolved = false;
        
        const cleanup = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };
        
        const safeResolve = (value: boolean) => {
            if (!resolved) {
                resolved = true;
                cleanup();
                resolve(value);
            }
        };
        
        try {
            await websocketAppointment.connect();
            
            if (websocketAppointment.connected) {
                safeResolve(true);
                return;
            }

            const startTime = Date.now();
            interval = setInterval(() => {
                if (resolved) return;
                
                if (websocketAppointment.connected) {
                    safeResolve(true);
                } else if (Date.now() - startTime > timeout) {
                    safeResolve(false);
                }
            }, 200);
        } catch {
            safeResolve(false);
        }
    });
};