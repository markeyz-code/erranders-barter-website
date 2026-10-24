import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

/**
 * Chat API — written against `backend/src/chat/chat.controller.ts`
 * (`@Controller('chats')`, all routes JWT-guarded). The `api/v1` global prefix is
 * appended by axios.config.ts, so paths here are written without it.
 *
 * The backend exposes exactly three chat routes:
 *   GET  /chats                    → the caller's conversations
 *   GET  /chats/:chatId/messages   → messages in one conversation
 *   POST /chats/init               → { participantId, itemId? } find-or-create a conversation
 *
 * There is NO REST send-message route. Sending happens over the Socket.IO
 * gateway (`backend/src/chat/chat.gateway.ts`, `sendMessage` event) — see
 * `composables/modules/chat/useChat.ts`.
 */

/**
 * A user as populated by the backend (`firstName lastName email`).
 * Where the populate is missing the value is a raw ObjectId string instead.
 */
export interface ChatUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

/** Matches `enum: ['text', 'image', 'voice', 'video', 'file', 'call']` in backend/src/chat/schemas/message.schema.ts */
export type ChatMessageType = 'text' | 'image' | 'voice' | 'video' | 'file' | 'call';

/** Matches backend/src/chat/schemas/message.schema.ts (timestamps: true). */
export interface ChatMessage {
  _id: string;
  chatId: string;
  sender: ChatUser | string;
  content: string;
  type: ChatMessageType;
  assetUrl?: string;
  replyTo?: ChatMessage | string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** Matches backend/src/chat/schemas/chat.schema.ts (timestamps: true). */
export interface Chat {
  _id: string;
  participants: Array<ChatUser | string>;
  item?: string | null;
  lastMessage?: ChatMessage | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InitChatPayload {
  participantId: string;
  itemId?: string;
}

export const chat_api = {
  /** GET /chats — the caller's conversations, newest first. */
  getChats: () => GATEWAY_ENDPOINT_WITH_AUTH.get<Chat[]>('/chats'),

  /** GET /chats/:chatId/messages — oldest first. */
  getMessages: (chatId: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.get<ChatMessage[]>(`/chats/${chatId}/messages`),

  /** POST /chats/init — creates the conversation if it does not exist yet. */
  initChat: (payload: InitChatPayload) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post<Chat>('/chats/init', payload),
};
