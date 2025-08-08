import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useWebSocket(token: string | null) {
  const ws = useRef<WebSocket>(null);

  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?token=${token}`
    );
    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      toast.success(msg.message);
    };
    ws.current = socket;

    return () => socket.close();
  }, [token]);

  return ws.current;
}
