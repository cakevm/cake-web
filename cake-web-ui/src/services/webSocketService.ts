import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { map, Observable } from "rxjs";

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocketSubject<unknown>;

  private constructor() {
    this.socket = webSocket({
      url: "ws://127.0.0.1:3000/ws",
      openObserver: {
        next: () => {
          //console.log('WebSocket connected');
        },
      },
      closeObserver: {
        next: () => {
          //console.log('WebSocket disconnected');
        },
      },
    });
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }

    return WebSocketService.instance;
  }

  public on<Type>(message_type: string): Observable<Type> {
    return this.socket
      .multiplex(
        () => ({ subscribe: message_type }),
        () => ({ unsubscribe: message_type }),
        (message: any) => message.type === message_type,
      )
      .pipe(map((message: any) => message as Type));
  }
}
