<script setup lang="ts">
// @ts-ignore
import BaseInput from "../../../components/BaseInput.vue";
import { CONSTANTS } from "../../../constants/common";
// @ts-ignore
import { ref, defineExpose, defineProps, onMounted } from "vue";
import type { FormData } from "../../../types/ui/form";
// @ts-ignore
import BaseTextArea from "../../../components/BaseTextArea.vue";
// @ts-ignore
import BaseTimePicker from "../../../components/BaseTimePicker.vue";
// @ts-ignore
import BaseRadioButton from "../../../components/BaseRadioButton.vue";
import { useShiftForm } from "../../../composables/shift/use-shift-form";
import type { TableRow } from "../../../types/ui/table-row";
import type { Shift } from "../../../types/models/shift/shift";

interface ShiftFormProps {
  row: TableRow<Shift> | null;
}
const props = defineProps<ShiftFormProps>();
/**
 * Hàm lấy phương thức tính toán thời gian làm việc từ composable useShiftForm
 */
const { isEmpty, isEqual, isTimeInRange, calcWorkingHours, validateModalForm } =
  useShiftForm();

/**
 * Tham số truyền vào form
 */
const formRef = ref<FormData>({
  formInputFields: [
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
          iconSize: "icon16",
          pointer: true,
          errorMessage: "",
          value: null,
        },
        {
          label: "Giờ hết ca",
          field: "shiftEndTime",
          type: CONSTANTS.BASE_INPUT_TYPE.TIME_PICKER,
          isRequired: true,
          icon: "ic-time",
          iconSize: "icon16",
          pointer: true,
          errorMessage: "",
          value: null,
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
          iconSize: "icon16",
          pointer: true,
          errorMessage: "",
          value: null,
        },
        {
          label: "Kết thúc nghỉ giữa ca",
          field: CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndBreakTime,
          type: CONSTANTS.BASE_INPUT_TYPE.TIME_PICKER,
          isRequired: false,
          icon: "ic-time",
          iconSize: "icon16",
          pointer: true,
          errorMessage: "",
          value: null,
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
          isHideTooltip: true,
        },
        {
          label: "Thời gian nghỉ giữa ca (giờ)",
          field: CONSTANTS.COLUMN_NAME_SHIFT.ShiftBreakingTime,
          type: CONSTANTS.BASE_INPUT_TYPE.FLOAT_NUM,
          isRequired: false,
          isDisabled: true,
          errorMessage: "",
          value: null,
          isHideTooltip: true,
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
          rows: 3,
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
              value: 1,
              isChecked: true,
            },
            {
              text: CONSTANTS.STATUS_SHIFT[0],
              value: 0,
              isChecked: false,
            },
          ],
          value: null,
        },
      ],
    },
  ],
  errorModal: {
    title: "Cảnh báo!",
    iconTitle: "danger",
    iconTooltip: "Đóng (ESC)",
    message: "",
  },
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
  shiftBeginTime: null as string | null,
  shiftEndTime: null as string | null,
  shiftBeginBreakTime: null as string | null,
  shiftEndBreakTime: null as string | null,
  shiftBreakingTime: null as string | null,
  shiftWorkingTime: null as string | null,
});

/**
 * Tính toán thời gian làm việc và thời gian nghỉ giữa ca
 * Cập nhật giá trị vào timeRef và các trường tương ứng trong modal
 */
function calculateTimeToHours() {
  // Lấy giá trị thời gian từ các trường trong modal
  formRef.value.formInputFields.forEach((group: any) => {
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
      "",
    );
  }
  if (
    props.row &&
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
    props.row &&
    !timeRef.value.shiftBeginTime &&
    !timeRef.value.shiftEndTime
  ) {
    timeRef.value.shiftWorkingTime = "0,00";
  }

  // Cập nhật giá trị thời gian làm việc và thời gian nghỉ giữa ca vào modal
  formRef.value.formInputFields.forEach((group: any) => {
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

/**
 * Xử lý khi thay đổi giá trị trạng thái
 * @param value
 */
const handleChangeValueStatus = (value: any) => {
  formRef.value.formInputFields.forEach((group: any) => {
    group.formItems.forEach((item: any) => {
      if (item.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus) {
        item.value = value;
      }
      item.checkItems?.forEach((checkItem: any) => {
        if (checkItem.value == value) {
          checkItem.isChecked = true;
        } else {
          checkItem.isChecked = false;
        }
      });
    });
  });
};

/**
 * Validate dữ liệu trong modal ca làm việc
 * Sử dụng useFormValidator để kiểm tra:
 * - Required fields (Mã ca, Tên ca, Giờ vào/hết ca)
 * - Business rules (Giờ hết ca != Giờ vào ca, thời gian nghỉ trong khoảng hợp lệ)
 * @returns {boolean} - true nếu dữ liệu hợp lệ
 */
function validateShiftModal(): boolean {
  // Định nghĩa các rule validate nghiệp vụ
  const customRules = {
    // Rule 1: Giờ hết ca không được bằng giờ vào ca
    [CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndTime]: () => {
      if (
        !isEmpty(timeRef.value.shiftEndTime) &&
        !isEmpty(timeRef.value.shiftBeginTime) &&
        isEqual(timeRef.value.shiftEndTime, timeRef.value.shiftBeginTime)
      ) {
        formRef.value.errorModal.message =
          "Giờ hết ca không được bằng giờ vào ca.";
        return {
          isValid: false,
          message: "Giờ hết ca không được bằng giờ vào ca.",
        };
      }
      return { isValid: true };
    },

    // Rule 2: Kết thúc nghỉ giữa ca không được bằng Bắt đầu nghỉ giữa ca
    shiftEndBreakTime: () => {
      if (
        !isEmpty(timeRef.value.shiftEndBreakTime) &&
        !isEmpty(timeRef.value.shiftBeginBreakTime) &&
        isEqual(
          timeRef.value.shiftEndBreakTime,
          timeRef.value.shiftBeginBreakTime,
        )
      ) {
        formRef.value.errorModal.message =
          "Kết thúc nghỉ giữa ca không được bằng Bắt đầu nghỉ giữa ca.";
        return {
          isValid: false,
          message:
            "Kết thúc nghỉ giữa ca không được bằng Bắt đầu nghỉ giữa ca.",
        };
      }
      return { isValid: true };
    },

    // Rule 3: Thời gian bắt đầu nghỉ giữa ca phải nằm trong khoảng ca làm việc
    [CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginBreakTime]: () => {
      if (
        !isEmpty(timeRef.value.shiftBeginBreakTime) &&
        !isEmpty(timeRef.value.shiftBeginTime) &&
        !isEmpty(timeRef.value.shiftEndTime) &&
        !isTimeInRange(
          timeRef.value.shiftBeginBreakTime as string,
          timeRef.value.shiftBeginTime as string,
          timeRef.value.shiftEndTime as string,
        )
      ) {
        const message =
          "Thời gian bắt đầu nghỉ giữa ca phải nằm trong khoảng thời gian tính từ giờ vào ca đến giờ hết ca. Vui lòng kiểm tra lại.";
        formRef.value.errorModal.message = message;
        return { isValid: false, message };
      }
      return { isValid: true };
    },

    // Rule 4: Thời gian kết thúc nghỉ giữa ca phải nằm trong khoảng ca làm việc
    shiftEndBreakTimeRange: () => {
      if (
        !isEmpty(timeRef.value.shiftEndBreakTime) &&
        !isEmpty(timeRef.value.shiftBeginTime) &&
        !isEmpty(timeRef.value.shiftEndTime) &&
        !isTimeInRange(
          timeRef.value.shiftEndBreakTime as string,
          timeRef.value.shiftBeginTime as string,
          timeRef.value.shiftEndTime as string,
        )
      ) {
        const message =
          "Thời gian kết thúc nghỉ giữa ca phải nằm trong khoảng thời gian tính từ giờ vào ca đến giờ hết ca. Vui lòng kiểm tra lại.";
        formRef.value.errorModal.message = message;

        // Gán error cho field shiftEndBreakTime
        formRef.value.formInputFields.forEach((group) => {
          group.formItems.forEach((item: any) => {
            if (item.field === "shiftEndBreakTime") {
              item.errorMessage = message;
            }
          });
        });

        return { isValid: false, message };
      }
      return { isValid: true };
    },
  };

  // Gọi validateModalForm với custom rules
  const result = validateModalForm(formRef.value.formInputFields, customRules);

  // Nếu có lỗi và chưa có message, set error message đầu tiên vào errorModal
  if (!result && !formRef.value.errorModal.message) {
    const firstError = Object.values(customRules).find((rule) => {
      const ruleResult = rule();
      return !ruleResult.isValid;
    });
    if (firstError) {
      const ruleResult = firstError();
      formRef.value.errorModal.message = ruleResult.message ?? "";
    }
  }

  return result;
}

const clearForm = () => {
  formRef.value.formInputFields.forEach((group) => {
    group.formItems.forEach((item: any) => {
      item.value = null;
      item.errorMessage = "";
      if (item.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus) {
        item.checkItems?.forEach((checkItem: any) => {
          if (checkItem.value == 1) {
            checkItem.isChecked = true;
            item.value = 1;
          } else {
            checkItem.isChecked = false;
          }
        });
      }
    });
  });
};
/**
 * Set dữ liệu vào form
 * @param row
 */
const setData = (row: TableRow<Shift>) => {
  formRef.value.formInputFields.map((field) => {
    field.formItems.map((item: any) => {
      switch (item.field) {
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftCode:
          item.value = row.data.shiftCode;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftName:
          item.value = row.data.shiftName;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginTime:
          item.value = row.data.shiftBeginTime;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndTime:
          item.value = row.data.shiftEndTime;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginBreakTime:
          item.value = row.data.shiftBeginBreakTime;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndBreakTime:
          item.value = row.data.shiftEndBreakTime;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftWorkingTime:
          item.value = row.data.shiftWorkingTime;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftBreakingTime:
          item.value = row.data.shiftBreakingTime;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftDescription:
          item.value = row.data.shiftDescription;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus:
          handleChangeValueStatus(row.data.shiftStatus);
          break;
      }
    });
  });
};
defineExpose({
  getData: () => ({ ...formRef.value }),
  validateShiftModal,
  clearForm,
});

/**
 * Set dữ liệu vào form
 * @param row Dòng dữ liệu ca làm việc
 */
onMounted(() => {
  clearForm();

  if (props.row !== null) {
    setData(props.row);
    calculateTimeToHours();
  }
});
</script>

<template>
  <div class="container-content">
    <div
      v-for="(field, indexFormInputFields) in formRef.formInputFields"
      :key="indexFormInputFields"
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
        <div class="flex items-center">
          <label class="label">{{ fieldItems.label }}</label>
          <div v-show="fieldItems.isRequired" class="ms-required">&nbsp;*</div>
        </div>
        <template
          v-if="
            fieldItems.type === CONSTANTS.BASE_INPUT_TYPE.TEXT ||
            fieldItems.type === CONSTANTS.BASE_INPUT_TYPE.FLOAT_NUM
          "
        >
          <BaseInput
            :fieldName="fieldItems.label"
            :autoComplete="fieldItems.autoComplete"
            :tooltip="'Nhập ' + fieldItems.label"
            :is-hide-tooltip="fieldItems.isHideTooltip"
            :max-length="fieldItems.maxLength"
            :disabled="fieldItems.isDisabled"
            :error="fieldItems.errorMessage"
            :required="fieldItems.isRequired"
            v-model="fieldItems.value"
          />
        </template>
        <template
          v-else-if="fieldItems.type === CONSTANTS.BASE_INPUT_TYPE.TEXTAREA"
        >
          <BaseTextArea
            :fieldName="fieldItems.label"
            :max-length="fieldItems.maxLength"
            :is-disabled="fieldItems.isDisabled"
            :error="fieldItems.errorMessage"
            :tooltip="'Nhập ' + fieldItems.label"
            :rows="fieldItems.rows || 3"
            v-model="fieldItems.value"
          />
        </template>
        <template
          v-else-if="fieldItems.type === CONSTANTS.BASE_INPUT_TYPE.TIME_PICKER"
        >
          <BaseTimePicker
            :fieldName="fieldItems.label"
            :max-length="fieldItems.maxLength"
            :is-disabled="fieldItems.isDisabled"
            :error="fieldItems.errorMessage"
            :tooltip="'Nhập ' + fieldItems.label"
            :icon="fieldItems.icon"
            :icon-size="fieldItems.iconSize"
            :pointer="fieldItems.pointer"
            :required="fieldItems.isRequired"
            v-model="fieldItems.value"
            @input="calculateTimeToHours"
            @blur="calculateTimeToHours"
          />
        </template>
        <template
          v-else-if="fieldItems.type === CONSTANTS.BASE_INPUT_TYPE.CHECKBOX"
        >
          <BaseRadioButton
            :fieldName="fieldItems.label"
            :disabled="fieldItems.isDisabled"
            :pointer="fieldItems.pointer"
            :check-items="fieldItems.checkItems || []"
            @handle-change-value="handleChangeValueStatus"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
