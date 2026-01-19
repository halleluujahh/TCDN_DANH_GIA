<script setup>
import BasePageHeader from "@/components/base/BasePageHeader.vue";
import BaseBtn from "../../../components/base/BaseBtn.vue";
import BaseTable from "../../../components/base/BaseTable.vue";
import { onMounted, ref, watch } from "vue";
import BaseModal from "../../../components/base/BaseModal.vue";
import { CONSTANTS } from "../../../commons/constants";
import {
  calcWorkingHours,
  formatDate,
  formatTime,
} from "../../../utils/format";
import ShiftApi from "../../../api/modules/ShiftApi";
import { Enums } from "../../../commons/enums";
import { clone } from "lodash";
import { useToast } from "../../../composables/useToast";

const toast = useToast();

// Dữ liệu bảng ca làm việc
const propsTable = ref({
  tableData: {
    header: [
      {
        text: "Mã ca",
        isOpenFilterColumnValueModal: false,
        filterColumnValueAction: "filterValueColumn",
        typeFilter: CONSTANTS.BASE_INPUT_TYPE.TEXT,

        valueFilterType: null,
        filterType: null,
        valueFilterTypeAfterSaved: null,
        filterTypeAfterSaved: null,

        action: "openSortMenu",
        isOpenSortMenu: false,
        align: "center",
        sortable: true,
        sortOrder: "asc",
        isPin: false,
        columnName: CONSTANTS.COLUMN_NAME_SHIFT_FILTER.ShiftCode,
        style: {
          width: "120px",
          minWidth: "120px",
          maxWidth: "120px",
        },
      },
      {
        text: "Tên ca",
        isOpenFilterColumnValueModal: false,
        filterColumnValueAction: "filterValueColumn",
        typeFilter: CONSTANTS.BASE_INPUT_TYPE.TEXT,

        valueFilterType: null,
        filterType: null,
        valueFilterTypeAfterSaved: null,
        filterTypeAfterSaved: null,

        action: "openSortMenu",
        isOpenSortMenu: false,
        align: "center",
        sortable: true,
        sortOrder: "asc",
        isPin: false,
        columnName: CONSTANTS.COLUMN_NAME_SHIFT_FILTER.ShiftName,
        style: {
          minWidth: "250px",
        },
      },
      {
        text: "Giờ vào ca",
        align: "center",
        action: "openSortMenu",
        isOpenSortMenu: false,
        sortable: true,
        sortOrder: "asc",
        isPin: false,
        columnName: CONSTANTS.COLUMN_NAME_SHIFT_FILTER.ShiftBeginTime,
        style: {
          width: "130px",
          minWidth: "130px",
          maxWidth: "130px",
        },
      },
      {
        text: "Giờ hết ca",
        align: "center",
        action: "openSortMenu",
        isOpenSortMenu: false,
        sortable: true,
        sortOrder: "asc",
        isPin: false,
        columnName: CONSTANTS.COLUMN_NAME_SHIFT_FILTER.ShiftEndTime,
        style: {
          width: "130px",
          minWidth: "130px",
          maxWidth: "130px",
        },
      },
      {
        text: "Bắt đầu nghỉ giữa ca",
        align: "center",
        action: "openSortMenu",
        isOpenSortMenu: false,
        sortable: true,
        sortOrder: "asc",
        isPin: false,
        columnName: CONSTANTS.COLUMN_NAME_SHIFT_FILTER.ShiftBeginBreakTime,
        style: {
          width: "200px",
          minWidth: "200px",
          maxWidth: "200px",
        },
      },
      {
        text: "Kết thúc",
        align: "center",
        action: "openSortMenu",
        isOpenSortMenu: false,
        sortable: false,
        sortOrder: "asc",
        isPin: false,
        columnName: CONSTANTS.COLUMN_NAME_SHIFT_FILTER.ShiftEndBreakTime,
        style: {
          width: "210px",
          minWidth: "210px",
          maxWidth: "210px",
        },
      },
      {
        text: "Thời gian làm việc (giờ)",
        isOpenFilterColumnValueModal: false,
        filterColumnValueAction: "filterValueColumn",
        typeFilter: CONSTANTS.BASE_INPUT_TYPE.FLOAT_NUM,

        valueFilterType: null,
        filterType: null,
        valueFilterTypeAfterSaved: null,
        filterTypeAfterSaved: null,

        action: "openSortMenu",
        isOpenSortMenu: false,
        align: "center",
        sortable: false,
        sortOrder: "asc",
        isPin: false,
        columnName: CONSTANTS.COLUMN_NAME_SHIFT_FILTER.ShiftWorkingTime,
        style: {
          width: "210px",
          minWidth: "210px",
          maxWidth: "210px",
        },
      },
      {
        text: "Thời gian nghỉ giữa ca (giờ)",
        isOpenFilterColumnValueModal: false,
        filterColumnValueAction: "filterValueColumn",
        typeFilter: CONSTANTS.BASE_INPUT_TYPE.FLOAT_NUM,

        valueFilterType: null,
        filterType: null,
        valueFilterTypeAfterSaved: null,
        filterTypeAfterSaved: null,

        action: "openSortMenu",
        isOpenSortMenu: false,
        align: "center",
        sortable: false,
        sortOrder: "asc",
        isPin: false,
        columnName: CONSTANTS.COLUMN_NAME_SHIFT_FILTER.ShiftBreakingTime,
        style: {
          width: "230px",
          minWidth: "230px",
          maxWidth: "230px",
        },
      },
      {
        text: "Trạng thái",
        isOpenFilterColumnValueModal: false,
        filterColumnValueAction: "filterValueColumn",
        typeFilter: CONSTANTS.BASE_INPUT_TYPE.COMBOBOX,

        valueFilterType: null,
        filterType: null,
        valueFilterTypeAfterSaved: null,
        filterTypeAfterSaved: null,

        comboboxItems: [
          {
            value: CONSTANTS.STATUS_SHIFT.Active,
            isSelected: false,
          },
          {
            value: CONSTANTS.STATUS_SHIFT.Inactive,
            isSelected: false,
          },
        ],
        action: "openSortMenu",
        isOpenSortMenu: false,
        align: "center",
        sortable: false,
        sortOrder: "asc",
        isPin: false,
        columnName: CONSTANTS.COLUMN_NAME_SHIFT_FILTER.ShiftStatus,
        style: {
          width: "200px",
          minWidth: "200px",
          maxWidth: "200px",
        },
      },
      {
        text: "Người tạo",
        isOpenFilterColumnValueModal: false,
        filterColumnValueAction: "filterValueColumn",
        typeFilter: CONSTANTS.BASE_INPUT_TYPE.TEXT,

        valueFilterType: null,
        filterType: null,
        valueFilterTypeAfterSaved: null,
        filterTypeAfterSaved: null,

        action: "openSortMenu",
        isOpenSortMenu: false,
        align: "center",
        sortable: false,
        sortOrder: "asc",
        isPin: false,
        columnName: CONSTANTS.COLUMN_NAME_SHIFT_FILTER.CreatedBy,
        style: {
          width: "160px",
          minWidth: "160px",
          maxWidth: "160px",
        },
      },
      {
        text: "Ngày tạo",
        isOpenFilterColumnValueModal: false,
        filterColumnValueAction: "filterValueColumn",
        typeFilter: CONSTANTS.BASE_INPUT_TYPE.DATE,

        valueFilterType: null,
        filterType: null,
        valueFilterTypeAfterSaved: null,
        filterTypeAfterSaved: null,

        action: "openSortMenu",
        isOpenSortMenu: false,
        align: "center",
        sortable: false,
        sortOrder: "asc",
        isPin: false,
        columnName: CONSTANTS.COLUMN_NAME_SHIFT_FILTER.CreatedDate,
        style: {
          width: "160px",
          minWidth: "160px",
          maxWidth: "160px",
        },
      },
      {
        text: "Người sửa",
        isOpenFilterColumnValueModal: false,
        filterColumnValueAction: "filterValueColumn",
        typeFilter: CONSTANTS.BASE_INPUT_TYPE.TEXT,

        valueFilterType: null,
        filterType: null,
        valueFilterTypeAfterSaved: null,
        filterTypeAfterSaved: null,

        action: "openSortMenu",
        isOpenSortMenu: false,
        align: "center",
        sortable: false,
        sortOrder: "asc",
        isPin: false,
        columnName: CONSTANTS.COLUMN_NAME_SHIFT_FILTER.ModifiedBy,
        style: {
          width: "160px",
          minWidth: "160px",
          maxWidth: "160px",
        },
      },
      {
        text: "Ngày sửa",
        isOpenFilterColumnValueModal: false,
        filterColumnValueAction: "filterValueColumn",
        typeFilter: CONSTANTS.BASE_INPUT_TYPE.DATE,

        valueFilterType: null,
        filterType: null,
        valueFilterTypeAfterSaved: null,
        filterTypeAfterSaved: null,

        action: "openSortMenu",
        isOpenSortMenu: false,
        align: "center",
        sortable: false,
        sortOrder: "asc",
        isPin: false,
        columnName: CONSTANTS.COLUMN_NAME_SHIFT_FILTER.ModifiedDate,
        style: {
          width: "160px",
          minWidth: "160px",
          maxWidth: "160px",
        },
      },
    ],
    body: [],
    pagination: {
      totalCount: 0,
      pageSize: 10,
      currentPage: 0,
      itemPerPageOptions: [
        { value: 10, isSelected: true },
        { value: 20, isSelected: false },
        { value: 30, isSelected: false },
        { value: 50, isSelected: false },
        { value: 100, isSelected: false },
      ],
    },

    indexTbhItem: null,

    indexTbdItem: null,
    indexBtnAction: null,

    styleMoreContainer: {
      left: "0px",
      top: "0px",
      right: "unset",
      bottom: "unset",
      overflow: "auto",
      minWidth: "0px",
      padding: "8px 0px",
      items: [],
    },

    styleHeaderContainer: {
      left: "0px",
      top: "0px",
      right: "unset",
      bottom: "unset",
      overflow: "auto",
      minWidth: "0px",
      padding: "8px 0px",
      items: [],
    },

    styleColumnValueModal: {
      left: "0px",
      top: "0px",
      right: "unset",
      bottom: "unset",
      items: [],
      columnName: null,
      valueFilterType: null,
      filterType: null,
    },

    idsSelected: [],
  },
});

// Modal ca làm việc
const propsModal = ref({
  idEdited: null,
  shiftUpdated: null,
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
          field: "shiftEndBreakTime",
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
          isValueNegative: false,
          action: calculateTimeToHours,
        },
        {
          label: "Thời gian nghỉ giữa ca (giờ)",
          field: "shiftBreakingTime",
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
          action: changeStatus,
          errorMessage: "",
        },
      ],
    },
  ],
  buttonFooter: [],
  isShowModal: false,
  errorModal: {
    title: "Cảnh báo!",
    iconTitle: "danger",
    iconTooltip: "Đóng (ESC)",
    message: "",
    buttonFooterModalError: [
      {
        text: "Đóng",
        type: "solid-brand",
        action: "closeErrorModal",
      },
    ],
  },
});
// Modal xác nhận xóa ca làm việc
const deleteConfirmModal = ref({
  title: "Xóa Ca làm việc!",
  iconTitle: "danger",
  iconTooltip: "Đóng (ESC)",
  message: "",
  buttonFooterModalError: [
    {
      text: "Hủy",
      type: "outline-neutral",
      action: "closeErrorModal",
    },
    {
      text: "Xóa",
      type: "outline-danger",
      action: "deleteMultiple",
    },
  ],
});

const filterRef = ref({
  SearchKeyword: "",
  FilterByShiftColumn: [],
});

// Tham chiếu lưu trữ thời gian để tính toán
const timeRef = {
  shiftBeginTime: null,
  shiftEndTime: null,
  shiftBeginBreakTime: null,
  shiftEndBreakTime: null,
  shiftBreakingTime: null,
  shiftWorkingTime: null,
};
// Hàm hiển thị toast
function showToast(message, status) {
  switch (status) {
    case "success":
      toast.success(message, {
        duration: 5000,
        position: "top",
      });
      break;
    case "error":
      toast.error(message, {
        duration: 5000,
        position: "top",
      });
      break;
    case "info":
      toast.info(message, {
        duration: 5000,
        position: "top",
      });
      break;
    case "warning":
      toast.warning(message, {
        duration: 5000,
        position: "top",
      });
      break;
  }
}
// Hàm tính toán thời gian làm việc và thời gian nghỉ giữa ca
function calculateTimeToHours() {
  // Lấy giá trị thời gian từ các trường trong modal
  propsModal.value.modalInputFields.forEach((group) => {
    group.formItems.forEach((item) => {
      switch (item.field) {
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginTime:
          timeRef.shiftBeginTime = item.value;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndTime:
          timeRef.shiftEndTime = item.value;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginBreakTime:
          timeRef.shiftBeginBreakTime = item.value;
          break;
        case CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndBreakTime:
          timeRef.shiftEndBreakTime = item.value;
          break;
      }
    });
  });
  // Tính toán thời gian nghỉ giữa ca
  if (timeRef.shiftBeginBreakTime && timeRef.shiftEndBreakTime) {
    timeRef.shiftBreakingTime = calcWorkingHours(
      timeRef.shiftBeginBreakTime,
      timeRef.shiftEndBreakTime,
      null,
    );
  }
  if (
    propsModal.value.idEdited !== null &&
    !timeRef.shiftBeginBreakTime &&
    !timeRef.shiftEndBreakTime
  ) {
    timeRef.shiftBreakingTime = "0,00";
  }

  // Tính toán thời gian làm việc
  if (timeRef.shiftBeginTime && timeRef.shiftEndTime) {
    timeRef.shiftWorkingTime = calcWorkingHours(
      timeRef.shiftBeginTime,
      timeRef.shiftEndTime,
      timeRef.shiftBreakingTime,
    );
  }

  if (
    propsModal.value.idEdited !== null &&
    !timeRef.shiftBeginTime &&
    !timeRef.shiftEndTime
  ) {
    timeRef.shiftWorkingTime = "0,00";
  }

  // Cập nhật giá trị thời gian làm việc và thời gian nghỉ giữa ca vào modal
  propsModal.value.modalInputFields.forEach((group) => {
    group.formItems.forEach((item) => {
      if (item.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftBreakingTime) {
        item.value = timeRef.shiftBreakingTime;
      }
      if (item.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftWorkingTime) {
        if (
          timeRef.shiftWorkingTime &&
          Number(timeRef.shiftWorkingTime.replace(",", ".")) < 0
        ) {
          item.value = "(" + timeRef.shiftWorkingTime.replace("-", "") + ")";
          item.isValueNegative = true;
        } else {
          item.value = timeRef.shiftWorkingTime;
          item.isValueNegative = false;
        }
      }
    });
  });
}
// Hàm xử lý thay đổi trạng thái radio button
function changeStatus(indexCheckbox, indexModalInputFields, indexFieldItems) {
  // Cập nhật trạng thái radio button
  propsModal.value.modalInputFields[indexModalInputFields].formItems[
    indexFieldItems
  ].checkItems[indexCheckbox].isChecked = true;
  propsModal.value.modalInputFields[indexModalInputFields].formItems[
    indexFieldItems
  ].checkItems.forEach((item, index) => {
    if (index !== indexCheckbox) {
      item.isChecked = false;
    }
  });
}
// Hàm hiển thị lỗi từ API lên modal
function errorDisplayHandler(error) {
  // Hiển thị lỗi validation từ API lên modal
  propsModal.value.modalInputFields.forEach((group) => {
    group.formItems.forEach((item) => {
      if (
        item.field ===
        CONSTANTS.COLUMN_NAME_SHIFT[
          error.data.errors[CONSTANTS.ERROR_RESPONSE.FieldName]
        ]
      ) {
        item.errorMessage =
          error.data.errors[CONSTANTS.ERROR_RESPONSE.ErrorMessage];
      } else {
        item.errorMessage = "";
      }
    });
  });
  // Hiển thị lỗi chung lên modal lỗi
  propsModal.value.errorModal.message =
    error.data.errors[CONSTANTS.ERROR_RESPONSE.ErrorMessage];
}
// Hàm lấy dữ liệu từ modal
function getDataFromModal(action) {
  let formData = {};
  // Lấy dữ liệu từ modal
  propsModal.value.modalInputFields.forEach((group) => {
    group.formItems.forEach((item) => {
      if (
        item.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus &&
        action === "update"
      ) {
        const checkedItem = item.checkItems.find((i) => i.isChecked);
        if (checkedItem) {
          formData[item.field] =
            checkedItem.text === CONSTANTS.STATUS_SHIFT[1] ? 1 : 0;
        }
        return;
      }
      if (item.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftWorkingTime) {
        if (item.isValueNegative) {
          formData[item.field] = Number(
            String(item.value ?? "")
              .slice(1, -1)
              .replace(",", "."),
          );
          item.isValueNegative = false;
        } else {
          formData[item.field] = Number(
            String(item.value ?? "").replace(",", "."),
          );
        }
        return;
      }
      if (
        item.value &&
        item.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftBreakingTime
      ) {
        formData[item.field] = Number(
          String(item.value ?? "").replace(",", "."),
        );
        return;
      }
      if (
        item.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftBreakingTime &&
        (item.value === null || item.value === "")
      ) {
        formData[item.field] = null;
        return;
      }
      if (
        item.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftWorkingTime &&
        (item.value === null || item.value === "")
      ) {
        formData[item.field] = null;
        return;
      }
      formData[item.field] = String(item.value ?? "").trim();
    });
  });
  return formData;
}
// Kiểm tra dữ liệu hợp lệ trong modal
function validationShiftModal() {
  let isValid = true;

  // Kiểm tra các trường tính hợp lệ:
  // - Mã ca không được để trống.
  // - Tên ca không được để trống.
  // - Giờ vào ca không được để trống.
  // - Giờ hết ca không được để trống.
  // - Giờ hết ca không được bằng giờ vào ca.
  // - Kết thúc nghỉ giữa ca không được bằng Bắt đầu nghỉ giữa ca.
  // - Thời gian bắt đầu nghỉ giữa ca phải nằm trong khoảng thời
  // gian tính từ giờ vào ca đến giờ hết ca.
  // Vui lòng kiểm tra lại.
  // - Thời gian kết thúc nghỉ giữa ca phải nằm trong khoảng thời
  // gian tính từ giờ vào ca đến giờ hết ca.
  // Vui lòng kiểm tra lại.
  propsModal.value.modalInputFields.forEach((group) => {
    if (!isValid) return;
    group.formItems.forEach((item) => {
      if (item.isRequired) {
        if (
          item.value === null ||
          item.value === "" ||
          (typeof item.value === "string" && item.value.trim() === "")
        ) {
          propsModal.value.errorModal.message = `${item.label} không được để trống.`;
          item.errorMessage = `${item.label} không được để trống.`;
          isValid = false;
          return isValid;
        } else {
          item.errorMessage = "";
        }
      }

      if (
        item.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndTime &&
        timeRef.shiftBeginTime &&
        item.value === timeRef.shiftBeginTime
      ) {
        propsModal.value.errorModal.message = `Giờ hết ca không được bằng giờ vào ca.`;
        item.errorMessage = "Giờ hết ca không được bằng giờ vào ca.";
        isValid = false;
        return isValid;
      } else {
        item.errorMessage = "";
      }

      if (
        item.field === "shiftEndBreakTime" &&
        timeRef.shiftBeginBreakTime &&
        item.value === timeRef.shiftBeginBreakTime
      ) {
        propsModal.value.errorModal.message = `Kết thúc nghỉ giữa ca không được bằng Bắt đầu nghỉ giữa ca.`;
        item.errorMessage =
          "Kết thúc nghỉ giữa ca không được bằng Bắt đầu nghỉ giữa ca.";
        isValid = false;
        return isValid;
      } else {
        item.errorMessage = "";
      }

      if (
        item.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginBreakTime &&
        timeRef.shiftBeginTime &&
        timeRef.shiftEndTime &&
        (item.value < timeRef.shiftBeginTime ||
          item.value > timeRef.shiftEndTime)
      ) {
        propsModal.value.errorModal.message = `Thời gian bắt đầu nghỉ giữa ca phải nằm trong khoảng thời gian tính từ giờ vào ca đến giờ hết ca. Vui lòng kiểm tra lại.`;
        item.errorMessage =
          "Thời gian bắt đầu nghỉ giữa ca phải nằm trong khoảng thời gian tính từ giờ vào ca đến giờ hết ca. Vui lòng kiểm tra lại.";
        isValid = false;
        return isValid;
      } else {
        item.errorMessage = "";
      }

      if (
        item.field === "shiftEndBreakTime" &&
        timeRef.shiftBeginTime &&
        timeRef.shiftEndTime &&
        (item.value < timeRef.shiftBeginTime ||
          item.value > timeRef.shiftEndTime)
      ) {
        propsModal.value.errorModal.message = `Thời gian kết thúc nghỉ giữa ca phải nằm trong khoảng thời gian tính từ giờ vào ca đến giờ hết ca. Vui lòng kiểm tra lại.`;
        item.errorMessage =
          "Thời gian kết thúc nghỉ giữa ca phải nằm trong khoảng thời gian tính từ giờ vào ca đến giờ hết ca. Vui lòng kiểm tra lại.";
        isValid = false;
        return isValid;
      } else {
        item.errorMessage = "";
      }
    });
  });
  return isValid;
}
// Hàm xử lý lưu ca làm việc
async function handleSave() {
  // Kiểm tra dữ liệu hợp lệ
  if (!validationShiftModal()) {
    return;
  }

  let formData = getDataFromModal("add");
  // Gọi API thêm mới ca làm việc
  await ShiftApi.saveShift(formData)
    .then((response) => {
      showToast("Thêm Ca làm việc thành công", "success");

      closeModal();
      // Gán ShiftId, ShiftStatus, CreatedBy, CreatedDate trả về từ API cho dữ liệu mới thêm
      formData[CONSTANTS.COLUMN_NAME_SHIFT.ShiftId] =
        response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftId];
      formData[CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus] =
        response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus];
      formData[CONSTANTS.COLUMN_NAME_SHIFT.CreatedBy] =
        response.data[CONSTANTS.COLUMN_NAME_SHIFT.CreatedBy];
      formData[CONSTANTS.COLUMN_NAME_SHIFT.CreatedDate] =
        response.data[CONSTANTS.COLUMN_NAME_SHIFT.CreatedDate];
      // Thêm dòng mới vào bảng
      let row = generateRowDataTableBody(formData);
      propsTable.value.tableData.body.unshift({
        row,
      });
      // Cập nhật lại tổng số bản ghi trong phân trang
      propsTable.value.tableData.pagination.totalCount += 1;
    })
    .catch((error) => {
      console.error("Lỗi khi thêm ca làm việc:", error);
      errorDisplayHandler(error);
    });
}
// Hàm xử lý lưu và thêm mới
function handleSaveAdd() {
  console.log("Save and Add clicked");
}
// Hàm xử lý cập nhật ca làm việc
async function handleUpdate() {
  // Kiểm tra dữ liệu hợp lệ
  if (!validationShiftModal()) {
    return;
  }

  let formData = getDataFromModal("update");

  // Gọi API cập nhật ca làm việc
  await ShiftApi.update(propsModal.value.idEdited, formData)
    .then((response) => {
      if (response && response.isSuccess) {
        // Cập nhật lại dòng vừa cập nhật ở trong bảng
        propsTable.value.tableData.body.forEach((item) => {
          const idCol = item.row.rowItems.find(
            (col) => col.columnName === CONSTANTS.COLUMN_NAME_SHIFT.ShiftId,
          );
          // Cập nhật dữ liệu cho các cột trong hàng tương ứng
          if (idCol?.columnData === propsModal.value.idEdited) {
            item.row.rowItems.forEach((col) => {
              if (
                col.columnName !== CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus &&
                response.data[col.columnName] !== undefined
              ) {
                col.columnData = response.data[col.columnName];
              }
              if (
                col.columnName === CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus &&
                response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus] !==
                  undefined
              ) {
                col.columnData =
                  CONSTANTS.STATUS_SHIFT[
                    response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus]
                  ];
                col.isActive = !col.isActive;
                propsModal.value.shiftUpdated.shiftStatus = col.isActive
                  ? CONSTANTS.STATUS_SHIFT.Active
                  : CONSTANTS.STATUS_SHIFT.Inactive;
              }
            });
            // Cập nhật lại dữ liệu cho nút hành động trong hàng tương ứng
            item.row.btnActions.forEach((btnAction) => {
              btnAction.shiftUpdated = propsModal.value.shiftUpdated;
            });
          }
        });
        closeModal();
      }
    })
    .catch((error) => {
      console.error("Lỗi khi cập nhật ca làm việc:", error);
      errorDisplayHandler(error);
    });
}
// Hàm xử lý thay đổi trạng thái ca làm việc thành Đang không sử dụng
async function handleUpdateStatusInactive(shiftIds) {
  return await ShiftApi.updateStatusInactive(shiftIds)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("Lỗi khi thay đổi trạng thái ca làm việc:", error);
      return null;
    });
}
// Hàm xử lý thay đổi trạng thái ca làm việc thành Đang sử dụng
async function handleUpdateStatusActive(shiftIds) {
  return await ShiftApi.updateStatusActive(shiftIds)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("Lỗi khi thay đổi trạng thái ca làm việc:", error);
      return null;
    });
}
// Hàm xử lý xóa ca làm việc
async function deleteShifts(shiftIds) {
  return await ShiftApi.deleteShift(shiftIds)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("Lỗi khi xóa ca làm việc:", error);
      showToast("Lỗi khi xóa ca làm việc", "error");
      return null;
    });
}
// Mở modal thêm ca làm việc
function openModal() {
  propsModal.value.isShowModal = true;
}
// Đóng modal
function closeModal() {
  propsModal.value.isShowModal = false;
  propsModal.value.idEdited = null;
  propsModal.value.shiftUpdated = null;
  clearModalInputFields(propsModal.value);
  closeErrorModal();
}
// Đóng modal lỗi
function closeErrorModal() {
  propsModal.value.errorModal.message = "";
  deleteConfirmModal.value.message = "";
}
// Xử lý sự kiện khi nhấn nút hành động trong footer modal
function handleFooterModalAction(action) {
  if (action === "save") {
    handleSave();
  } else if (action === "saveAdd") {
    handleSaveAdd();
  } else if (action === "closeModal") {
    closeModal();
  } else if (action === "update") {
    handleUpdate();
  } else if (action === "closeErrorModal") {
    closeErrorModal();
  }
}
// Xóa dữ liệu trong modal
function clearModalInputFields(modalProps) {
  modalProps.modalInputFields.forEach((group) => {
    group.formItems.forEach((item) => {
      item.value = null;
      item.errorMessage = "";
    });
  });
  timeRef.shiftBeginTime = null;
  timeRef.shiftEndTime = null;
  timeRef.shiftBeginBreakTime = null;
  timeRef.shiftEndBreakTime = null;
  timeRef.shiftBreakingTime = null;
}
// Tạo nút footer động cho modal
function generateFooterButton(action) {
  propsModal.value.buttonFooter = [
    {
      text: "Lưu",
      type: "solid-brand",
      action: action === "add" ? "save" : "update",
      tooltipText: "Ctrl + S",
    },
    {
      text: "Lưu và thêm",
      type: "outline-neutral",
      action: "update",
      tooltipText: "Ctrl + Shift + S",
    },
    {
      text: "Hủy",
      type: "outline-neutral",
      action: "closeModal",
    },
  ];
}
// Mở select box cho nút hành động "Khác"
function closeAllMoreMenuSelectBox() {
  propsTable.value.tableData.body.forEach((item) => {
    item.row.btnActions.forEach((btnAction) => {
      btnAction.isOpenSelectBox = false;
    });
  });
}
// Mở delete confirm modal
function openDeleteConfirmModal() {
  if (propsTable.value.tableData.idsSelected.length === 0) return;
  if (propsTable.value.tableData.idsSelected.length === 1) {
    const row = propsTable.value.tableData.body.find((item) => {
      const idCol = item.row.rowItems.find(
        (col) => col.columnName === CONSTANTS.COLUMN_NAME_SHIFT.ShiftId,
      );
      return idCol?.columnData === propsTable.value.tableData.idsSelected[0];
    });
    if (!row) return;
    const shiftIdCol = row.row.rowItems.find(
      (col) => col.columnName === CONSTANTS.COLUMN_NAME_SHIFT.ShiftCode,
    );
    // Hiển thị modal xác nhận xóa
    deleteConfirmModal.value.message = `Ca làm việc <b>${shiftIdCol?.columnData}</b> sau khi bị xóa sẽ không thể khôi phục. Bạn có muốn tiếp tục xóa không?`;
    return;
  }
  deleteConfirmModal.value.message = `Các <b>Ca làm việc</b> sau khi bị xóa sẽ không thể khôi phục. Bạn có muốn tiếp tục xóa không?`;
  return;
}
// Xử lý thay đổi trạng thái cho nhiều ca làm việc
async function handleStatusMultiple(status) {
  let response;
  if (status === CONSTANTS.STATUS_SHIFT.Active) {
    response = await handleUpdateStatusActive(
      propsTable.value.tableData.idsSelected,
    );
  }
  if (status === CONSTANTS.STATUS_SHIFT.Inactive) {
    response = await handleUpdateStatusInactive(
      propsTable.value.tableData.idsSelected,
    );
  }
  // Cập nhật lại trạng thái trong bảng
  if (response && response.isSuccess) {
    propsTable.value.tableData.body.forEach((item) => {
      const idCol = item.row.rowItems.find(
        (col) => col.columnName === CONSTANTS.COLUMN_NAME_SHIFT.ShiftId,
      );
      // Cập nhật dữ liệu cho các cột trong hàng tương ứng
      if (propsTable.value.tableData.idsSelected.includes(idCol?.columnData)) {
        item.row.rowItems.forEach((col) => {
          if (col.columnName === CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus) {
            col.columnData = CONSTANTS.STATUS_SHIFT[status];
            col.isActive =
              status === CONSTANTS.STATUS_SHIFT.Active ? true : false;
          }
        });
        // Cập nhật lại dữ liệu cho nút hành động trong hàng tương ứng
        item.row.btnActions.forEach((btnAction) => {
          btnAction.shiftUpdated.shiftStatus = CONSTANTS.STATUS_SHIFT[status];
        });
      }
    });
  }
}
// Xử lý sự kiện khi nhấn nút hành động trong bảng
async function handleActionTableBtn(
  action,
  shiftUpdated = null,
  indexTbdItem,
  indexBtnAction,
  event,
  sortType,
) {
  // Mở modal chỉnh sửa ca làm việc
  if (shiftUpdated != null && action === "openEditModal") {
    // Đóng tất cả các select box đang mở
    closeAllMoreMenuSelectBox();

    // Thiết lập id của ca làm việc đang chỉnh sửa
    propsModal.value.idEdited = shiftUpdated.shiftId;
    propsModal.value.shiftUpdated = shiftUpdated;

    // Điền dữ liệu vào modal
    propsModal.value.modalInputFields.forEach((inputField) => {
      inputField.formItems.forEach((formItem) => {
        if (formItem.field === CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus) {
          formItem.checkItems.forEach((item) => {
            if (
              item.text === CONSTANTS.STATUS_SHIFT[shiftUpdated.shiftStatus]
            ) {
              item.isChecked = true;
            } else {
              item.isChecked = false;
            }
          });
        } else {
          formItem.value = shiftUpdated[formItem.field];
        }
      });
    });
    propsModal.value.isShowModal = true;
    generateFooterButton("update");
    return;
  }
  // Mở modal thêm mới ca làm việc
  if (action === "openAddModal") {
    propsModal.value.isShowModal = true;
    generateFooterButton("add");
    return;
  }
  // Mở modal nhân bản ca làm việc
  if (action === "duplicate") {
    // Điền dữ liệu vào modal
    propsModal.value.modalInputFields.forEach((inputField) => {
      inputField.formItems.forEach((formItem) => {
        if (
          formItem.field !== CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus &&
          formItem.field !== CONSTANTS.COLUMN_NAME_SHIFT.ShiftCode
        ) {
          formItem.value = shiftUpdated[formItem.field];
        }
      });
    });
    propsModal.value.isShowModal = true;
    generateFooterButton("add");
    return;
  }
  // Mở select box cho nút hành động "Khác"
  if (action === "openMoreMenu") {
    openMoreMenuSelectBox(event, indexTbdItem, indexBtnAction, shiftUpdated);
    return;
  }
  // Xử lý thay đổi trạng thái ca làm việc
  if (shiftUpdated != null && action === "changeStatus") {
    let response;
    // Gọi API thay đổi trạng thái ca làm việc
    if (shiftUpdated.shiftStatus === CONSTANTS.STATUS_SHIFT.Active) {
      response = await handleUpdateStatusInactive([shiftUpdated.shiftId]);
    } else {
      response = await handleUpdateStatusActive([shiftUpdated.shiftId]);
    }

    if (!response || !response.isSuccess) return;

    // Cập nhật lại trạng thái trong bảng
    const row = propsTable.value.tableData.body[indexTbdItem];
    if (!row) return;

    // Cập nhật lại dữ liệu cho cột trạng thái trong hàng tương ứng
    row.row.rowItems.forEach((col) => {
      if (col.columnName === CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus) {
        col.columnData =
          CONSTANTS.STATUS_SHIFT[
            shiftUpdated.shiftStatus === CONSTANTS.STATUS_SHIFT.Active
              ? CONSTANTS.STATUS_SHIFT.Inactive
              : CONSTANTS.STATUS_SHIFT.Active
          ];
        col.isActive = !col.isActive;
        shiftUpdated.shiftStatus = col.isActive
          ? CONSTANTS.STATUS_SHIFT.Active
          : CONSTANTS.STATUS_SHIFT.Inactive;
      }
    });

    // Cập nhật lại dữ liệu cho nút hành động trong hàng tương ứng
    row.row.btnActions.forEach((btnAction) => {
      btnAction.shiftUpdated = shiftUpdated;
    });
    closeAllMoreMenuSelectBox();
    return;
  }
  // Xử lý xóa ca làm việc
  if (shiftUpdated != null && action === "delete") {
    // Gọi API xóa ca làm việc
    const response = await deleteShifts([shiftUpdated.shiftId]);
    // Xóa dòng tương ứng trong bảng
    if (response && response.isSuccess) {
      propsTable.value.tableData.body.splice(indexTbdItem, 1);
      closeAllMoreMenuSelectBox();

      showToast("Xóa Ca làm việc thành công", "success");
    }
    return;
  }
  // Xử lý thay đổi trạng thái ca làm việc thành Đang sử dụng cho nhiều ca
  if (action === "activeMultiple") {
    await handleStatusMultiple(CONSTANTS.STATUS_SHIFT.Active);
    return;
  }
  // Xử lý thay đổi trạng thái ca làm việc thành Đang không sử dụng cho nhiều ca
  if (action === "inactiveMultiple") {
    await handleStatusMultiple(CONSTANTS.STATUS_SHIFT.Inactive);
    return;
  }
  // Xử lý xác nhận xóa ca làm việc
  if (action === "confirmDeleteMultiple") {
    // Doạn này kiểm tra nếu chỉ xóa 1 ca thì hiển thị nội dung modal khác với xóa nhiều ca
    if (indexBtnAction !== null && indexTbdItem !== null) {
      const shiftIdCol = propsTable.value.tableData.body[
        indexTbdItem
      ].row.rowItems[indexBtnAction].find(
        (col) => col.columnName === CONSTANTS.COLUMN_NAME_SHIFT.ShiftId,
      );
      deleteConfirmModal.value = {
        title: "Xóa Ca làm việc!",
        iconTitle: "danger",
        iconTooltip: "Đóng (ESC)",
        message: "",
        buttonFooterModalError: [
          {
            text: "Hủy",
            type: "outline-neutral",
            action: "closeErrorModal",
          },
          {
            text: "Xóa",
            type: "outline-danger",
            action: "delete",
          },
        ],
      };

      // Hiển thị modal xác nhận xóa
      deleteConfirmModal.value.message = `Ca làm việc <b>${shiftIdCol?.columnData}</b> sau khi bị xóa sẽ không thể khôi phục. Bạn có muốn tiếp tục xóa không?`;
      return;
    }
    deleteConfirmModal.value = {
      title: "Xóa Ca làm việc!",
      iconTitle: "danger",
      iconTooltip: "Đóng (ESC)",
      message: "",
      buttonFooterModalError: [
        {
          text: "Hủy",
          type: "outline-neutral",
          action: "closeErrorModal",
        },
        {
          text: "Xóa",
          type: "outline-danger",
          action: "deleteMultiple",
        },
      ],
    };
    openDeleteConfirmModal();
    return;
  }
  // Xử lý xóa nhiều ca làm việc
  if (action === "deleteMultiple") {
    const response = await deleteShifts(propsTable.value.tableData.idsSelected);
    // Xóa các dòng tương ứng trong bảng
    if (response && response.isSuccess) {
      propsTable.value.tableData.body = propsTable.value.tableData.body.filter(
        (item) => {
          const idCol = item.row.rowItems.find(
            (col) => col.columnName === CONSTANTS.COLUMN_NAME_SHIFT.ShiftId,
          );
          return !propsTable.value.tableData.idsSelected.includes(
            idCol?.columnData,
          );
        },
      );
      propsTable.value.tableData.idsSelected = [];
      showToast("Xóa Ca làm việc thành công", "success");
      closeErrorModal();
    }
    return;
  }
  // Đóng modal lỗi
  if (action === "closeErrorModal") {
    closeErrorModal();
  }
  // Mở select box cho nút hành động sắp xếp cột
  if (action === "openSortMenu") {
    openSortMenuSelectBox(event, indexTbdItem);
    return;
  }
  // Sắp xếp cột
  if (action === "sort") {
    checkExistFilterRef(sortType);
    await loadShiftsWithFilter();
    closeAllSortMenu();
    return;
  }
  // Tìm kiếm theo từ khóa
  if (action === "searchByKeyword") {
    // Gán giá trị từ khóa tìm kiếm vào filter
    filterRef.value.SearchKeyword = event;
    await loadShiftsWithFilter();
    return;
  }
  // Mở modal lọc giá trị cột
  if (action === "filterValueColumn") {
    await openFilterValueColumnModal(indexTbdItem, event);
    return;
  }
  // Đóng modal lọc giá trị cột
  if (action === "closeFilterColumnValue") {
    closeAllFilterValueColumnModal();
    return;
  }
  // Lưu giá trị lọc cột
  if (action === "saveFilterColumnValue") {
    checkExistFilterRef(null);
    // Đặt lại trang hiện tại về 1
    propsTable.value.tableData.pagination.currentPage = 0;
    await loadShiftsWithFilter();
    closeAllFilterValueColumnModal();
    return;
  }
  // Tải lại dữ liệu bảng
  if (action === "reloadData") {
    await reloadData();
    return;
  }
  // Xóa điều kiện lọc của cột
  if (action === "removeConditionFilter") {
    // Đặt lại trang hiện tại về 1
    propsTable.value.tableData.pagination.currentPage = 0;
    await loadShiftsWithFilter();
    removeConditionFilterOfColumn();
    // Đóng modal lọc giá trị cột
    closeAllFilterValueColumnModal();
    return;
  }
  if (action === "removeAllConditionFilter") {
    removeAllConditionFilter();

    // Đặt lại trang hiện tại về 1
    propsTable.value.tableData.pagination.currentPage = 0;
    await loadShiftsWithFilter();
    // Đóng modal lọc giá trị cột
    closeAllFilterValueColumnModal();
    return;
  }
  if (action === "pin") {
    return;
  }
  if (action === "unpin") {
    return;
  }
}
// Xóa tất cả điều kiện lọc
function removeAllConditionFilter() {
  // Xóa tất cả điều kiện lọc trong filterRef
  filterRef.value.FilterByShiftColumn.forEach((filter, index) => {
    filter.Value = "";
    filter.FilterColumnType = null;
    filter.DateFilterColumnType = null;
  });
  
  // Đặt lại giá trị lọc trong bảng
  propsTable.value.tableData.header.forEach((headerItem) => {
    headerItem.valueFilterType = null;
    headerItem.filterType = null;
    headerItem.valueFilterTypeAfterSaved = null;
    headerItem.filterTypeAfterSaved = null;
  });
}
// Xóa điều kiện lọc của cột hiện tại
function removeConditionFilterOfColumn() {
  // Xóa điều kiện lọc trong filterRef
  filterRef.value.FilterByShiftColumn.forEach((filter, index) => {
    if (
      filter.Name ===
      propsTable.value.tableData.header[propsTable.value.tableData.indexTbhItem]
        .columnName
    ) {
      filter.Value = "";
      filter.FilterColumnType = null;
      filter.DateFilterColumnType = null;
    }
  });

  // Đặt lại giá trị lọc trong bảng
  propsTable.value.tableData.header[
    propsTable.value.tableData.indexTbhItem
  ].valueFilterType = null;
  propsTable.value.tableData.header[
    propsTable.value.tableData.indexTbhItem
  ].filterType = null;

  propsTable.value.tableData.header[
    propsTable.value.tableData.indexTbhItem
  ].valueFilterTypeAfterSaved = null;
  propsTable.value.tableData.header[
    propsTable.value.tableData.indexTbhItem
  ].filterTypeAfterSaved = null;
}
// Kiểm tra filterRef đã tồn tại bộ lọc cho cột hay chưa, nếu có thì cập nhật lại giá trị
function checkExistFilterRef(sortType) {
  let isExist = false;

  // Duyệt qua các bộ lọc trong filterRef
  filterRef.value.FilterByShiftColumn.forEach((filter) => {
    if (
      filter.Name ===
      propsTable.value.tableData.header[propsTable.value.tableData.indexTbhItem]
        .columnName
    ) {
      filter.Value = String(
        propsTable.value.tableData.styleColumnValueModal.valueFilterType !==
          undefined &&
          propsTable.value.tableData.styleColumnValueModal.valueFilterType !==
            null
          ? propsTable.value.tableData.styleColumnValueModal.valueFilterType
          : "",
      );
      // Cập nhật lại kiểu lọc tương ứng
      if (
        propsTable.value.tableData.styleColumnValueModal.typeFilter ===
        CONSTANTS.BASE_INPUT_TYPE.DATE
      ) {
        filter.DateFilterColumnType =
          propsTable.value.tableData.styleColumnValueModal.filterType;
      } else {
        filter.FilterColumnType =
          propsTable.value.tableData.styleColumnValueModal.filterType;
      }
      if (sortType !== null) {
        filter.SortType = sortType;
      }
      isExist = true;
    }
  });
  // Nếu chưa tồn tại thì thêm mới bộ lọc vào filterRef
  if (!isExist) {
    filterRef.value.FilterByShiftColumn.push({
      Name: propsTable.value.tableData.header[
        propsTable.value.tableData.indexTbhItem
      ].columnName,
      Value: String(
        propsTable.value.tableData.styleColumnValueModal.valueFilterType !==
          undefined &&
          propsTable.value.tableData.styleColumnValueModal.valueFilterType !==
            null
          ? propsTable.value.tableData.styleColumnValueModal.valueFilterType
          : "",
      ),
      SortType: sortType !== null ? sortType : null,

      FilterColumnType:
        propsTable.value.tableData.styleColumnValueModal.typeFilter ===
        CONSTANTS.BASE_INPUT_TYPE.DATE
          ? null
          : propsTable.value.tableData.styleColumnValueModal.filterType,

      DateFilterColumnType:
        propsTable.value.tableData.styleColumnValueModal.typeFilter ===
        CONSTANTS.BASE_INPUT_TYPE.DATE
          ? propsTable.value.tableData.styleColumnValueModal.filterType
          : null,
    });
  }

  // Cập nhật lại giá trị đã lưu trong bảng
  propsTable.value.tableData.header[
    propsTable.value.tableData.indexTbhItem
  ].valueFilterTypeAfterSaved =
    propsTable.value.tableData.header[
      propsTable.value.tableData.indexTbhItem
    ].valueFilterType;

  propsTable.value.tableData.header[
    propsTable.value.tableData.indexTbhItem
  ].filterTypeAfterSaved =
    propsTable.value.tableData.styleColumnValueModal.filterType;
}
// Đóng tất cả các select box nút hành động "Khác"
function closeAllMenuBtnAction() {
  propsTable.value.tableData.body.forEach((item, idxTbd) => {
    item.row.btnActions.forEach((btnAction, idxBtnAction) => {
      btnAction.isOpenSelectBox = false;
    });
  });
}
// Đóng tất cả các select box sắp xếp cột
function closeAllSortMenu() {
  propsTable.value.tableData.header.forEach((item, idx) => {
    item.isOpenSortMenu = false;
  });
}
// Đóng tất cả các modal lọc giá trị cột
function closeAllFilterValueColumnModal() {
  propsTable.value.tableData.header.forEach((item, idx) => {
    item.isOpenFilterColumnValueModal = false;
  });
}
// Đặt lại style cho tất cả các menu
function resetAllMenu() {
  propsTable.value.tableData.styleColumnValueModal = {};
  propsTable.value.tableData.styleHeaderContainer = {};
  propsTable.value.tableData.styleMoreContainer = {};
}
function resetMenuUnlessFilterModal() {
  propsTable.value.tableData.styleHeaderContainer = {};
  propsTable.value.tableData.styleMoreContainer = {};
}
// Hàm tính toán vị trí hiển thị của menu
function calculatePositionMenu(event, menuWidth = 450) {
  // Lấy vị trí của phần tử nút hành động
  const rect = event.currentTarget.getBoundingClientRect();

  // Các hằng số cấu hình
  const MARGIN = 8;
  const GAP = 8;
  const POPUP_HEIGHT = 140;

  // Tính vị trí top
  let top = rect.bottom + GAP;

  // Không tràn đáy
  if (top + POPUP_HEIGHT > window.innerHeight) {
    top = rect.top - POPUP_HEIGHT - GAP;
  }

  // Không tràn trên
  top = Math.max(top, MARGIN);

  // Kiểm tra tràn ngang
  const spaceOnRight = window.innerWidth - rect.right;
  const spaceOnLeft = rect.left;

  let left = "unset";
  let right = "unset";

  // Nếu không đủ chỗ bên phải, thử bên trái
  if (spaceOnLeft >= menuWidth + MARGIN) {
    right = `${window.innerWidth - rect.right}px`;
    left = "unset";
  }

  // Ưu tiên hiển thị bên phải
  else if (spaceOnRight >= menuWidth + MARGIN) {
    left = `${rect.left}px`;
    right = "unset";
  }

  // Nếu cả 2 bên đều không đủ, chọn bên nào rộng hơn
  else {
    if (spaceOnRight > spaceOnLeft) {
      left = `${Math.max(rect.left, MARGIN)}px`;
      right = "unset";
    } else {
      right = `${Math.max(window.innerWidth - rect.right, MARGIN)}px`;
      left = "unset";
    }
  }

  return { top: `${top}px`, right, left };
}

watch(
  () => propsTable.value.tableData.styleColumnValueModal.valueFilterType,
  (newVal) => {
    if (propsTable.value.tableData.indexTbhItem !== null) {
      propsTable.value.tableData.header[
        propsTable.value.tableData.indexTbhItem
      ].valueFilterType = newVal;
    }
  },
);

watch(
  () => propsTable.value.tableData.styleColumnValueModal.filterType,
  (newVal) => {
    if (propsTable.value.tableData.indexTbhItem !== null) {
      propsTable.value.tableData.header[
        propsTable.value.tableData.indexTbhItem
      ].filterType = newVal;
    }
  },
);
async function openFilterValueColumnModal(indexTbhItems, event) {
  // Kiểm tra phần tử hiện tại tồn tại hay không
  if (!event?.currentTarget) return;

  resetMenuUnlessFilterModal();

  // Đóng modal lọc giá trị cột của phần tử khác trừ phần tử hiện tại
  propsTable.value.tableData.header.forEach((item, idx) => {
    if (idx !== indexTbhItems) {
      item.isOpenFilterColumnValueModal = false;
    }
  });

  closeAllSortMenu();
  closeAllMenuBtnAction();

  // Lấy vị trí của phần tử nút hành động
  const { top, right, left } = calculatePositionMenu(event);

  // Cập nhật style cho container của select box
  setTimeout(() => {
    propsTable.value.tableData.styleColumnValueModal = {
      left,
      top,
      right,
      bottom: "unset",
      columnName: propsTable.value.tableData.header[indexTbhItems].text,
      items:
        propsTable.value.tableData.header[indexTbhItems].typeFilter !==
        CONSTANTS.BASE_INPUT_TYPE.DATE
          ? [
              {
                value: Enums.FilterColumnType.Difference,
                isSelected: false,
              },
              {
                value: Enums.FilterColumnType.Contains,
                isSelected: true,
              },
              {
                value: Enums.FilterColumnType.NotContains,
                isSelected: false,
              },
              {
                value: Enums.FilterColumnType.StartsWith,
                isSelected: false,
              },
              {
                value: Enums.FilterColumnType.EndsWith,
                isSelected: false,
              },
            ]
          : [
              {
                value: Enums.DateFilterColumnType.Equal,
                isSelected: true,
              },
              {
                value: Enums.DateFilterColumnType.Different,
                isSelected: false,
              },
              {
                value: Enums.DateFilterColumnType.Greater,
                isSelected: false,
              },
              {
                value: Enums.DateFilterColumnType.Less,
                isSelected: false,
              },
              {
                value: Enums.DateFilterColumnType.GreaterOrEqual,
                isSelected: false,
              },
              {
                value: Enums.DateFilterColumnType.LessOrEqual,
                isSelected: false,
              },
              {
                value: Enums.FilterColumnType.Contains,
                isSelected: false,
              },
              {
                value: Enums.FilterColumnType.NotContains,
                isSelected: false,
              },
            ],
      valueFilterType:
        propsTable.value.tableData.header[indexTbhItems]?.valueFilterType ??
        null,
      filterType: propsTable.value.tableData.header[indexTbhItems]?.filterType
        ? propsTable.value.tableData.header[indexTbhItems]?.filterType
        : propsTable.value.tableData.header[indexTbhItems]?.typeFilter ===
            CONSTANTS.BASE_INPUT_TYPE.DATE
          ? Enums.DateFilterColumnType.Equal
          : Enums.FilterColumnType.Contains,
      typeInput: propsTable.value.tableData.header[indexTbhItems].typeFilter,
      isDisplayStatus:
        propsTable.value.tableData.header[indexTbhItems].columnName ===
        CONSTANTS.COLUMN_NAME_SHIFT_FILTER.ShiftStatus,
      comboboxItems:
        propsTable.value.tableData.header[indexTbhItems].typeFilter ===
        CONSTANTS.BASE_INPUT_TYPE.COMBOBOX
          ? propsTable.value.tableData.header[indexTbhItems].comboboxItems
          : [],
    };
  }, 100);

  // Mở/Đóng modal lọc giá trị cột của phần tử được nhấn
  propsTable.value.tableData.header[
    indexTbhItems
  ].isOpenFilterColumnValueModal =
    !propsTable.value.tableData.header[indexTbhItems]
      .isOpenFilterColumnValueModal;
  propsTable.value.tableData.indexTbhItem = indexTbhItems;
}
// Mở select box cho nút hành động sắp xếp cột
function openSortMenuSelectBox(event, indexTbhItems) {
  // Kiểm tra phần tử hiện tại tồn tại hay không
  if (!event?.currentTarget) return;

  resetAllMenu();

  // Đóng tất cả các select box khác
  propsTable.value.tableData.header.forEach((item, idx) => {
    if (idx !== indexTbhItems) {
      item.isOpenSortMenu = false;
    }
  });
  closeAllFilterValueColumnModal();
  closeAllMenuBtnAction();

  // Lấy vị trí của phần tử nút hành động
  const { top, right, left } = calculatePositionMenu(event);

  // Cập nhật style cho container của select box
  setTimeout(() => {
    propsTable.value.tableData.styleHeaderContainer = {
      left,
      top,
      right,
      bottom: "unset",
      overflow: "auto",
      minWidth: "0px",
      padding: "8px 0px",
      items: [
        {
          text: "Không sắp xếp",
          icon: "empty",
          action: "sort",
          sortType: Enums.SortType.Default,
          idxTbdItem: indexTbhItems,
        },
        {
          text: "Tăng dần",
          icon: "arrow-up",
          action: "sort",
          sortType: Enums.SortType.Ascending,
          idxTbdItem: indexTbhItems,
        },
        {
          text: "Giảm dần",
          icon: "arrow-down",
          action: "sort",
          sortType: Enums.SortType.Descending,
          idxTbdItem: indexTbhItems,
          isHasMenuBorder: true,
        },
        {
          text: "Ghim cột",
          icon: "pin",
          action: "pinColumn",
          idxTbdItem: indexTbhItems,
        },
        {
          text: "Bỏ ghim cột",
          icon: "unpin",
          action: "unpinColumn",
          idxTbdItem: indexTbhItems,
        },
      ],
    };
  }, 100);

  // Mở/Đóng select box của nút hành động được nhấn
  propsTable.value.tableData.header[indexTbhItems].isOpenSortMenu =
    !propsTable.value.tableData.header[indexTbhItems].isOpenSortMenu;
  propsTable.value.tableData.indexTbhItem = indexTbhItems;
}
// Mở select box cho nút hành động "Khác"
function openMoreMenuSelectBox(
  event,
  indexTbdItem,
  indexBtnAction,
  shiftUpdated,
) {
  // Kiểm tra phần tử hiện tại tồn tại hay không
  if (!event?.currentTarget) return;

  resetAllMenu();

  // Đóng tất cả các select box khác
  propsTable.value.tableData.body.forEach((item, idxTbd) => {
    item.row.btnActions.forEach((btnAction, idxBtnAction) => {
      if (idxTbd !== indexTbdItem || idxBtnAction !== indexBtnAction) {
        btnAction.isOpenSelectBox = false;
      }
    });
  });

  closeAllFilterValueColumnModal();
  closeAllSortMenu();

  // Lấy vị trí của phần tử nút hành động
  const { top, right, left } = calculatePositionMenu(event);

  // Cập nhật style cho container của select box
  setTimeout(() => {
    propsTable.value.tableData.styleMoreContainer = {
      left,
      top,
      right,
      bottom: "unset",
      overflow: "auto",
      minWidth: "0px",
      padding: "8px 0px",
      items: [
        {
          text: "Nhân bản",
          icon: "duplicate",
          action: "duplicate",
          shiftUpdated: shiftUpdated,
        },
        {
          text: getStatusActionText(indexTbdItem),
          icon: "empty",
          action: "changeStatus",
          shiftUpdated: shiftUpdated,
          idxTbdItem: indexTbdItem,
        },
        {
          text: "Xóa",
          icon: "trash",
          action: "confirmDeleteMultiple",
          shiftUpdated: shiftUpdated,
          idxTbdItem: indexTbdItem,
        },
      ],
    };
  }, 100);

  // Mở/Đóng select box của nút hành động được nhấn
  propsTable.value.tableData.body[indexTbdItem].row.btnActions[
    indexBtnAction
  ].isOpenSelectBox =
    !propsTable.value.tableData.body[indexTbdItem].row.btnActions[
      indexBtnAction
    ].isOpenSelectBox;
  propsTable.value.tableData.indexTbdItem = indexTbdItem;
  propsTable.value.tableData.indexBtnAction = indexBtnAction;
}
// Hàm xử lý thay đổi danh sách ID được chọn
function handleChangedSelectedIds(selectedIds) {
  propsTable.value.tableData.idsSelected = selectedIds;
}
// Lấy text hành động thay đổi trạng thái
function getStatusActionText(indexTbdItem) {
  const row = propsTable.value.tableData.body[indexTbdItem];
  if (!row) return "";

  const statusCol = row.row.rowItems.find(
    (col) => col.columnName === CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus,
  );

  if (!statusCol) return "";

  return statusCol.isActive ? "Ngừng sử dụng" : "Sử dụng";
}
// Hàm tạo dữ liệu hàng cho bảng từ dữ liệu ca làm việc
function generateRowDataTableBody(item) {
  return {
    isSelected: false,
    rowItems: [
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.ShiftId,
        columnData: item[CONSTANTS.COLUMN_NAME_SHIFT.ShiftId],
        textAlign: "text-left",
      },
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.ShiftCode,
        columnData: item[CONSTANTS.COLUMN_NAME_SHIFT.ShiftCode],
        textAlign: "text-left",
      },
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.ShiftName,
        columnData: item[CONSTANTS.COLUMN_NAME_SHIFT.ShiftName],
        textAlign: "text-left",
      },
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginTime,
        columnData: formatTime(
          item[CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginTime],
        ),
        textAlign: "text-left",
      },
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndTime,
        columnData: formatTime(item[CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndTime]),
        textAlign: "text-left",
      },
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginBreakTime,
        columnData: formatTime(
          item[CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginBreakTime],
        ),
        textAlign: "text-left",
      },
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndBreakTime,
        columnData: formatTime(
          item[CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndBreakTime],
        ),
        textAlign: "text-left",
      },
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.ShiftWorkingTime,
        columnData: item[CONSTANTS.COLUMN_NAME_SHIFT.ShiftWorkingTime],
        textAlign: "text-right",
      },
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.ShiftBreakingTime,
        columnData: item[CONSTANTS.COLUMN_NAME_SHIFT.ShiftBreakingTime],
        textAlign: "text-right",
      },
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus,
        columnData:
          CONSTANTS.STATUS_SHIFT[item[CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus]],
        isActive:
          item[CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus] === 1 ? true : false,
        textAlign: "text-left",
      },
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.CreatedBy,
        columnData: item[CONSTANTS.COLUMN_NAME_SHIFT.CreatedBy],
        textAlign: "text-left",
      },
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.CreatedDate,
        columnData: formatDate(item[CONSTANTS.COLUMN_NAME_SHIFT.CreatedDate]),
        textAlign: "text-left",
      },
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.ModifiedBy,
        columnData: item[CONSTANTS.COLUMN_NAME_SHIFT.ModifiedBy],
        textAlign: "text-left",
      },
      {
        columnName: CONSTANTS.COLUMN_NAME_SHIFT.ModifiedDate,
        columnData: formatDate(item[CONSTANTS.COLUMN_NAME_SHIFT.ModifiedDate]),
        textAlign: "text-left",
      },
    ],
    btnActions: [
      {
        icon: "pencil",
        tooltipText: "Sửa",
        action: "openEditModal",
        isHideBorder: true,
        isBtnActionTable: true,
        shiftUpdated: item,
      },
      {
        icon: "feature-more-blue",
        action: "openMoreMenu",
        isHideBorder: true,
        isBtnActionTable: true,
        shiftUpdated: item,
        isOpenSelectBox: false,
      },
    ],
  };
}
// Gọi API lấy danh sách ca làm việc phân trang
const loadShifts = async () => {
  try {
    const response = await ShiftApi.getAllPagination(
      propsTable.value.tableData.pagination.pageSize,
      propsTable.value.tableData.pagination.currentPage,
    );
    if (response && response.isSuccess && response.listData) {
      propsTable.value.tableData.body = []; // Xóa dữ liệu cũ
      response.listData.forEach((item) => {
        let row = generateRowDataTableBody(item);
        propsTable.value.tableData.body.push({
          row,
        });
      });
      propsTable.value.tableData.pagination.totalCount = response.totalItem;
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ca làm việc:", error);
  }
};
const loadShiftsWithFilter = async () => {
  const filter = clone(filterRef.value);
  await ShiftApi.getAllPaginationFilter(
    filter,
    propsTable.value.tableData.pagination.pageSize,
    propsTable.value.tableData.pagination.currentPage,
  )
    .then((response) => {
      if (response && response.isSuccess) {
        // Cập nhật dữ liệu bảng
        propsTable.value.tableData.body = [];
        response.listData.forEach((item) => {
          let row = generateRowDataTableBody(item);
          propsTable.value.tableData.body.push({ row });
        });
        // Cập nhật tổng số bản ghi
        propsTable.value.tableData.pagination.totalItems = response.totalItems;
      }
    })
    .catch((error) => {
      console.error("Lỗi khi lấy dữ liệu ca làm việc:", error);
    });
};
// Hàm xử lý thay đổi trang hiện tại
function handleChangeCurrentPage(newPage) {
  propsTable.value.tableData.pagination.currentPage = newPage;
}
async function reloadData() {
  propsTable.value.tableData.pagination.currentPage = 0;
  if (
    filterRef.value.SearchKeyword !== "" ||
    filterRef.value.FilterByShiftColumn.length > 0
  ) {
    await loadShiftsWithFilter();
    return;
  }
  await loadShifts();
}
// Watcher để theo dõi thay đổi trong phân trang và tải lại dữ liệu
watch(
  () => propsTable.value.tableData.pagination.pageSize,
  async () => {
    await reloadData();
  },
  { deep: true },
);
watch(
  () => propsTable.value.tableData.pagination.currentPage,
  async () => {
    if (
      filterRef.value.SearchKeyword !== "" ||
      filterRef.value.FilterByShiftColumn.length > 0
    ) {
      await loadShiftsWithFilter();
      return;
    }
    await loadShifts();
  },
  { deep: true },
);
// Load dữ liệu khi component được mounted
onMounted(async () => {
  await loadShifts();
});
</script>

<template>
  <div class="development-page">
    <BasePageHeader title="Ca làm việc">
      <template #actions>
        <BaseBtn
          icon="add-white"
          text="Thêm"
          @click="handleActionTableBtn('openAddModal')"
        />
      </template>
    </BasePageHeader>

    <BaseTable
      :table-data="propsTable.tableData"
      :load-data="loadShifts"
      :delete-confirm-modal="deleteConfirmModal"
      :filterRef="filterRef"
      @emit-action-btn="handleActionTableBtn"
      @selected-ids-changed="handleChangedSelectedIds"
      @handle-change-current-page="handleChangeCurrentPage"
    />
    <BaseModal
      :modal-title="
        propsModal.idEdited === null ? 'Thêm Ca làm việc' : 'Sửa Ca làm việc'
      "
      :modal-input-fields="propsModal.modalInputFields"
      :button-footer="propsModal.buttonFooter"
      :is-show-modal="propsModal.isShowModal"
      :id-edited="propsModal.idEdited"
      :error-modal="propsModal.errorModal"
      @save="handleSave"
      @saveAdd="handleSaveAdd"
      @closeModal="closeModal"
      @action="handleFooterModalAction"
      @closeErrorModal="closeErrorModal"
    >
    </BaseModal>
  </div>
</template>

<style scoped></style>
