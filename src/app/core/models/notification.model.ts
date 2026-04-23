export interface NotificationDto {
    id: number;
    createdAt: string | Date;
    userId: number;
    title: string;
    body: string;
    redirectUrl: string;
    isRead: boolean;
    sentAt?: string | Date | null;
}
