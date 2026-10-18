import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export interface AppNotification {
  _id: string;
  userId: string;
  actorId?: any;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  data: AppNotification[];
  unreadCount: number;
}

export const notificationsApi = {
  /** GET /notifications — get current user notifications and unread count */
  list: (limit = 20) =>
    GATEWAY_ENDPOINT_WITH_AUTH.get<NotificationsResponse>('/notifications', {
      params: { limit },
    }),

  /** PATCH /notifications/:id/read — mark a single notification read */
  markRead: (id: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<AppNotification>(`/notifications/${id}/read`, {}),

  /** PATCH /notifications/read-all — mark all notifications read */
  markAllRead: () =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<{ success: boolean; modifiedCount: number }>(
      '/notifications/read-all',
      {},
    ),
};
