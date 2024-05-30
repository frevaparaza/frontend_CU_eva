export interface ChatCreationRequest {
  chatName: string;
  members: Set<string>;
  chatType: string;
}
