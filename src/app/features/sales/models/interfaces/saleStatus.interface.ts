export enum SaleStatusEnum {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

enum SaleStatusTranslate {
  COMPLETED = 'COMPLETADO',
  CANCELLED = 'CANCELADO',
}

interface SalesStatusConfig {
  color: string;
  descriptionEs: string;
}

export const SALE_STATUS_CONFIG: Record<SaleStatusEnum, SalesStatusConfig> = {
  [SaleStatusEnum.COMPLETED]: {
    color: 'badge-success',
    descriptionEs: SaleStatusTranslate.COMPLETED,
  },
  [SaleStatusEnum.CANCELLED]: {
    color: 'badge-success',
    descriptionEs: SaleStatusTranslate.CANCELLED,
  },
};
