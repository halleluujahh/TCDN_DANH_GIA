export interface Auditable {
  createdBy?: string;
  createdDate?: Date;

  modifiedBy?: string;
  modifiedDate?: Date;
}
