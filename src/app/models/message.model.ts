export interface Message {
  chatId: string;
  sender: string;
  senderUsername?: string;
  content: string;
  timestamp?: Date;
}
