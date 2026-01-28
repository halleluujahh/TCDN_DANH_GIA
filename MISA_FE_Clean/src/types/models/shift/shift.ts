import type { Auditable } from "../base/auditable";

export interface Shift extends Auditable {
  shiftId: string;

  shiftCode: string;
  shiftName: string;

  shiftBeginTime: string; // "HH:mm"
  shiftEndTime: string; // "HH:mm"

  shiftBeginBreakTime?: string; // "HH:mm"
  shiftEndBreakTime?: string; // "HH:mm"
  
  shiftWorkingTime: number;
  shiftBreakingTime: number;

  shiftStatus: number;

  shiftDescription?: string;
}
