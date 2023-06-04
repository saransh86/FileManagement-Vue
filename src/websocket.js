import * as WebSocket from 'ws';

export class WebSocketClass {
    constructor() {
        this.url = "ws://localhost:3001"
        this.ws = null;
    }
    connectToServer() {
        const ws = new WebSocket('ws://localhost:3001/ws');
        return new Promise(async (resolve, reject) => {
            const timer = setInterval(() => {
                if(ws.readyState === 1) {
                    clearInterval(timer)
                    resolve(ws);
                }
            }, 10);
        });
    }
    // openWsConnection(token) {
    //     return new Promise(async (resolve, reject) => {

    //         this.ws = new WebSocket(this.url + "/ws?token=" + token);

    //         this.ws.onopen = (event) => {
    //             console.log("Websocket connection established!");
                
                
    //         }
    //         this.ws.onmessage = (event) => {
    //             console.log("WebSocket message received: ", event.data);
    //         }

    //         this.ws.onerror = (event) => {
    //             console.log("WebSocket error received: ", event);
    //         }

    //         this.ws.onclose = (event) => {
    //             console.log("WebSocket connection closed.");
    //         }
    //     });

    // }
}