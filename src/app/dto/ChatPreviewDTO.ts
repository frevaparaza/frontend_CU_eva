export interface ChatPreviewDTO {
  chatId: string;
  chatName: string;
  chatType: string;
  lastMessage: LastMessage;
}

export interface LastMessage {
  content: string;
  sender: string;
  timestamp?: Date;
}
