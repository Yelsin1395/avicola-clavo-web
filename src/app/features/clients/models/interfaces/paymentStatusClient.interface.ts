export enum StatusPaymentClient {
  NEW = 'NEW',
  EARLY = 'EARLY',
  PER_DAY = 'PER_DAY',
  PENDING_CUMULATEDAYS = 'PENDING_CUMULATEDAYS',
  LATE = 'LATE',
}

enum StatusPaymentClientTranslate {
  NEW = 'NUEVO',
  EARLY = 'PAGO ANTICIPADO',
  PER_DAY = 'PAGOS AL DIA',
  PENDING_CUMULATEDAYS = 'PENDIENTE DE PAGO',
  LATE = 'PAGO ATRASADO',
}

interface ConfigStatusPayment {
  color: string;
  descriptionEs: string;
}

export const CONFIG_STATUS_PAYMENT: Record<StatusPaymentClient, ConfigStatusPayment> = {
  [StatusPaymentClient.NEW]: {
    color: 'badge-neutral',
    descriptionEs: StatusPaymentClientTranslate.NEW,
  },
  [StatusPaymentClient.EARLY]: {
    color: 'badge-primary',
    descriptionEs: StatusPaymentClientTranslate.EARLY,
  },
  [StatusPaymentClient.PER_DAY]: {
    color: 'badge-success',
    descriptionEs: StatusPaymentClientTranslate.PER_DAY,
  },
  [StatusPaymentClient.PENDING_CUMULATEDAYS]: {
    color: 'badge-warning',
    descriptionEs: StatusPaymentClientTranslate.PENDING_CUMULATEDAYS,
  },
  [StatusPaymentClient.LATE]: {
    color: 'badge-error',
    descriptionEs: StatusPaymentClientTranslate.LATE,
  },
};
