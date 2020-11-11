import { NotificationType } from "./notification-type";

export interface NotificationHandlerMetaData {
  type: NotificationType;
  message: string;
  duration: number;
}
