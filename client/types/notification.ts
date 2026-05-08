export type AppNotification = {
  id: number;
  title: string;
  message: string;
  href?: string | null;
  type: string;
  channel: string;
  metadata?: Record<string, unknown> | null;
  readAt?: string | null;
  createdAt: string;
  actor?: {
    id: number;
    firstName: string;
    lastName?: string;
    email: string;
  } | null;
};

export type PushSubscriptionPayload = {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
};
