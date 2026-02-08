export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

enum PaymentStatusTranslate {
  PENDING = 'PENDIENTE',
  COMPLETED = 'COMPLETADO',
  FAILED = 'ERROR',
}

interface PaymentStatusConfig {
  color: string;
  descriptionEs: string;
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, PaymentStatusConfig> = {
  [PaymentStatus.PENDING]: {
    color: 'badge-warning',
    descriptionEs: PaymentStatusTranslate.PENDING,
  },
  [PaymentStatus.COMPLETED]: {
    color: 'badge-success',
    descriptionEs: PaymentStatusTranslate.COMPLETED,
  },
  [PaymentStatus.FAILED]: {
    color: 'badge-error',
    descriptionEs: PaymentStatusTranslate.FAILED,
  },
};
