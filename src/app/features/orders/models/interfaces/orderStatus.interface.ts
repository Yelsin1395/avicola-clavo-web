export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

enum OrderStatusTranslate {
  PENDING = 'PENDIENTE',
  PROCESSING = 'EN_CAMINO',
  COMPLETED = 'COMPLETADO',
  CANCELLED = 'CANCELADO',
}

interface OrderStatusConfig {
  color: string;
  descriptionEs: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfig> = {
  [OrderStatus.PENDING]: {
    color: 'badge-warning',
    descriptionEs: OrderStatusTranslate.PENDING,
  },
  [OrderStatus.PROCESSING]: {
    color: 'badge-primary',
    descriptionEs: OrderStatusTranslate.PROCESSING,
  },
  [OrderStatus.COMPLETED]: {
    color: 'badge-success',
    descriptionEs: OrderStatusTranslate.COMPLETED,
  },
  [OrderStatus.CANCELLED]: {
    color: 'badge-error',
    descriptionEs: OrderStatusTranslate.CANCELLED,
  },
};
