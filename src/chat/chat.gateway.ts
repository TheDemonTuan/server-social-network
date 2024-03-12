import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { DBChatService } from "@/database/chat/chat.service";

interface Message {
  sender_id: string;
  receiver_id: string;
  text: string;
}

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private users = [];
  constructor(private dbChatService: DBChatService) {}

  private addUser = (userId, socketId) => {
    !this.users.some((user) => user.userId === userId) && this.users.push({ userId, socketId });
  };

  private removeUser = (socketId) => {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  };

  private getUser = (userId) => {
    return this.users.find((user) => user.userId === userId);
  };

  @WebSocketServer() server: Server;

  @SubscribeMessage("addUser")
  async handleAddUser(client: Socket, payload: string): Promise<void> {
    this.addUser(payload, client.id);
    this.server.emit("getUsers", this.users);
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(client: Socket, message: Message): Promise<void> {
    await this.dbChatService.insert({
      from_user: {
        connect: {
          id: message.sender_id,
        },
      },
      to_user: {
        connect: {
          id: message.receiver_id,
        },
      },
      content: message.text,
    });
    const user = this.getUser(message?.receiver_id);
    this.server.to([user?.socketId, client?.id]).emit("getMessage", {
      sender_id: message.sender_id,
      text: message.text,
    });
  }

  afterInit(server: Server) {
    // console.log(server);
    //Do stuffs
  }

  handleDisconnect(client: Socket) {
    // console.log(`Disconnected: ${client.id}`);
    this.removeUser(client.id);
    //Do stuffs
  }

  handleConnection(client: Socket, ...args: any[]) {
    // console.log(`Connected ${client.id}`);
    //Do stuffs
  }
}
