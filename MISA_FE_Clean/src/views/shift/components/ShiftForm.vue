<script setup lang="ts">
import BaseInput from "../../../components/BaseInput.vue";
import { CONSTANTS } from "../../../constants/common";
import { ref } from "vue";
import type { FormData } from "../../../types/ui/form";

/**
 * Tham số truyền vào modal
 */
const modalRef = ref<FormData>({
  modalInputFields: [
    {
      isFlex: false,
      formItems: [
        {
          label: "Mã ca",
          field: CONSTANTS.COLUMN_NAME_SHIFT.ShiftCode,
          type: CONSTANTS.BASE_INPUT_TYPE.TEXT,
          errorMessage: "",
          isRequired: true,
          autoComplete: "on",
          value: null,
          maxLength: 20,
        },
      ],
    },
    {
      isFlex: false,
      formItems: [
        {
          label: "Tên ca",
          field: CONSTANTS.COLUMN_NAME_SHIFT.ShiftName,
          type: CONSTANTS.BASE_INPUT_TYPE.TEXT,
          isRequired: true,
          errorMessage: "",
          autoComplete: "on",
          value: null,
          maxLength: 50,
        },
      ],
    },
    {
      isFlex: true,
      formItems: [
        {
          label: "Giờ vào ca",
          field: CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginTime,
          type: CONSTANTS.BASE_INPUT_TYPE.TIME_PICKER,
          isRequired: true,
          icon: "ic-time",
          errorMessage: "",
          value: null,
          action: calculateTimeToHours,
        },
        {
          label: "Giờ hết ca",
          field: "shiftEndTime",
          type: CONSTANTS.BASE_INPUT_TYPE.TIME_PICKER,
          isRequired: true,
          icon: "ic-time",
          errorMessage: "",
          value: null,
          action: calculateTimeToHours,
        },
      ],
    },
    {
      isFlex: true,
      formItems: [
        {
          label: "Bắt đầu nghỉ giữa ca",
          field: CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginBreakTime,
          type: CONSTANTS.BASE_INPUT_TYPE.TIME_PICKER,
          isRequired: false,
          icon: "ic-time",
          errorMessage: "",
          value: null,
          action: calculateTimeToHours,
        },
        {
          label: "Kết thúc nghỉ giữa ca",
          field: CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndBreakTime,
          type: CONSTANTS.BASE_INPUT_TYPE.TIME_PICKER,
          isRequired: false,
          icon: "ic-time",
          errorMessage: "",
          value: null,
          action: calculateTimeToHours,
        },
      ],
    },
    {
      isFlex: true,
      formItems: [
        {
          label: "Thời gian làm việc (giờ)",
          field: CONSTANTS.COLUMN_NAME_SHIFT.ShiftWorkingTime,
          type: CONSTANTS.BASE_INPUT_TYPE.FLOAT_NUM,
          isRequired: false,
          isDisabled: true,
          errorMessage: "",
          value: null,
          action: calculateTimeToHours,
        },
        {
          label: "Thời gian nghỉ giữa ca (giờ)",
          field: CONSTANTS.COLUMN_NAME_SHIFT.ShiftBreakingTime,
          type: CONSTANTS.BASE_INPUT_TYPE.FLOAT_NUM,
          isRequired: false,
          isDisabled: true,
          errorMessage: "",
          value: null,
          action: calculateTimeToHours,
        },
      ],
    },
    {
      isFlex: false,
      formItems: [
        {
          label: "Mô tả",
          field: CONSTANTS.COLUMN_NAME_SHIFT.ShiftDescription,
          type: CONSTANTS.BASE_INPUT_TYPE.TEXTAREA,
          isRequired: false,
          errorMessage: "",
          maxLength: 255,
          value: null,
        },
      ],
    },
    {
      isFlex: false,
      isCheckboxGroup: true,
      formItems: [
        {
          label: "Trạng thái",
          field: CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus,
          type: CONSTANTS.BASE_INPUT_TYPE.CHECKBOX,
          isRequired: false,
          checkItems: [
            {
              text: CONSTANTS.STATUS_SHIFT[1],
              isChecked: true,
            },
            {
              text: CONSTANTS.STATUS_SHIFT[0],
              isChecked: false,
            },
          ],
          errorMessage: "",
          value: null,
        },
      ],
    },
  ],
});

/**
 *  ID của bản ghi đang được cập nhật
 */
const idUpdatedRef = ref<number>(0);

/**
 * Cấu hình filter/tìm kiếm cho bảng
 * Quản lý từ khóa tìm kiếm và các điều kiện lọc cột
 * @type {Object} filterRef
 * @property {string} SearchKeyword - Từ khóa tìm kiếm toàn văn
 * @property {Array} FilterByShiftColumn - Danh sách lọc theo cột (Name, Value, FilterType)
 * Created By hanv 20/01/2026
 */
const filterRef = ref({
  SearchKeyword: "",
  FilterByShiftColumn: [],
});

/**
 * Tham chiếu lưu trữ giá trị thời gian tạm để tính toán thời gian làm việc
 * Được cập nhật khi người dùng nhập thời gian vào modal
 * @type {Object} timeRef
 * @property {string} shiftBeginTime - Giờ vào ca (HH:mm)
 * @property {string} shiftEndTime - Giờ hết ca (HH:mm)
 * @property {string} shiftBeginBreakTime - Giờ bắt đầu nghỉ giữa ca (HH:mm)
 * @property {string} shiftEndBreakTime - Giờ kết thúc nghỉ giữa ca (HH:mm)
 * @property {string} shiftBreakingTime - Tổng thời gian nghỉ (định dạng giờ,phút)
 * @property {string} shiftWorkingTime - Tổng thời gian làm việc (định dạng giờ,phút)
 * Created By hanv 20/01/2026
 */
const timeRef = ref({
  shiftBeginTime: null as string | number | null,
  shiftEndTime: null as string | number | null,
  shiftBeginBreakTime: null as string | number | null,
  shiftEndBreakTime: null as string | number | null,
  shiftBreakingTime: null as string | number | null,
  shiftWorkingTime: null as string | number | null,
});

/**
 * Tính toán thời gian làm việc và thời gian nghỉ giữa ca
 * Cập nhật giá trị vào timeRef và các trường tương ứng trong modal
 */
function calculateTimeToHours() {
  // Lấy giá trị thời gian từ các trường trong modal
  modalRef.value.modalInputFields.forEach((group: any) => {
    group.formItems.forEach((item: any) => {
      switch (item.field) {
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginTime:
          timeRef.value.shiftBeginTime = item.value;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndTime:
          timeRef.value.shiftEndTime = item.value;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginBreakTime:
          timeRef.value.shiftBeginBreakTime = item.value;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndBreakTime:
          timeRef.value.shiftEndBreakTime = item.value;
          break;
      }
    });
  });
  // Tính toán thời gian nghỉ giữa ca
  if (timeRef.value.shiftBeginBreakTime && timeRef.value.shiftEndBreakTime) {
    timeRef.value.shiftBreakingTime = calcWorkingHours(
      timeRef.value.shiftBeginBreakTime,
      timeRef.value.shiftEndBreakTime,
      null,
    );
  }
  if (
    idUpdatedRef.value > 0 &&
    !timeRef.value.shiftBeginBreakTime &&
    !timeRef.value.shiftEndBreakTime
  ) {
    timeRef.value.shiftBreakingTime = "0,00";
  }

  // Tính toán thời gian làm việc
  if (timeRef.value.shiftBeginTime && timeRef.value.shiftEndTime) {
    timeRef.value.shiftWorkingTime = calcWorkingHours(
      timeRef.value.shiftBeginTime,
      timeRef.value.shiftEndTime,
      timeRef.value.shiftBreakingTime,
    );
  }

  if (
    idUpdatedRef.value > 0 &&
    !timeRef.value.shiftBeginTime &&
    !timeRef.value.shiftEndTime
  ) {
    timeRef.value.shiftWorkingTime = "0,00";
  }

  // Cập nhật giá trị thời gian làm việc và thời gian nghỉ giữa ca vào modal
  modalRef.value.modalInputFields.forEach((group: any) => {
    group.formItems.forEach((item: any) => {
      if (item.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftBreakingTime) {
        item.value = timeRef.value.shiftBreakingTime;
      }
      if (item.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftWorkingTime) {
        if (
          timeRef.value.shiftWorkingTime &&
          Number(timeRef.value.shiftWorkingTime.toString().replace(",", ".")) <
            0
        ) {
          item.value =
            "(" +
            timeRef.value.shiftWorkingTime.toString().replace("-", "") +
            ")";
          item.isValueNegative = true;
        } else {
          item.value = timeRef.value.shiftWorkingTime;
          item.isValueNegative = false;
        }
      }
    });
  });
}
</script>

<template>
  <div class="container-content">
    <div
      v-for="(field, indexModalInputFields) in modalRef.modalInputFields"
      :key="indexModalInputFields"
      :class="[
        'form-group',
        { flex: field.isFlex },
        field.isCheckboxGroup ? 'gap-4' : '',
      ]"
    >
      <div
        v-for="(fieldItems, indexFieldItems) in field.formItems"
        :key="indexFieldItems"
        :class="[
          'ms-' + fieldItems.type,
          fieldItems.type === CONSTANTS.BASE_INPUT_TYPE.CHECKBOX
            ? ''
            : 'ms-editor',
          'w-100',
          'flex',
          'items-center',
          'gap-4',
          'ms-validate',
          'mb-16px',
          field.isFlex ? 'w-1-2 mr-3' : '',
        ]"
        style="height: auto"
      >
        <div v-if="fieldItems.type === CONSTANTS.BASE_INPUT_TYPE.TEXT">
          <div class="flex items-center">
            <label class="label">{{ fieldItems.label }}</label>
            <div v-show="fieldItems.isRequired" class="ms-required">
              &nbsp;*
            </div>
          </div>
          <BaseInput
            :type="fieldItems.type"
            :autoComplete="fieldItems.autoComplete"
            :icon="fieldItems.icon"
            :max-length="fieldItems.maxLength"
            :is-disabled="fieldItems.isDisabled"
            :error="fieldItems.errorMessage"
            v-model="fieldItems.value"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
