"use client";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { toast } from "sonner";

type WebSocketContextType = object;

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function connect() {
      if (wsRef.current) {
        wsRef.current.close();
      }

      const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "";

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = null;
        }
      };

      wsRef.current.onmessage = (event) => {
        console.log(event);
        try {
          const message = JSON.parse(event.data);
          if (message.event === "high_score") {
            toast.success(
              `🎉 ${message.data.user_name} scored ${message.data.score}!`,
              { duration: 4000 }
            );
          }
        } catch {
          console.error("Error parsing websocket message");
        }
      };

      wsRef.current.onclose = (event) => {
        console.log(
          `WebSocket disconnected, code: ${event.code}, reason: ${event.reason}`
        );
        reconnectTimeout.current = setTimeout(connect, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        wsRef.current?.close();
      };
    }

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, []);

  return <>{children}</>;
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWebSocket must be used within WebSocketProvider");
  return context;
}
