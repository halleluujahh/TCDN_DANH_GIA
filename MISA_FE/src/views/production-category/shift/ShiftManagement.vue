<script setup>
/**
 * ShiftManagement Component - Trang quản lý Ca làm việc
 * Cung cấp các chức năng CRUD (Create, Read, Update, Delete) đầy đủ cho ca làm việc
 * Tính toán tự động thời gian làm việc và thời gian nghỉ giữa ca
 * Hỗ trợ tìm kiếm, lọc, sắp xếp, phân trang dữ liệu
 * Xác thực dữ liệu nghiệp vụ phức tạp (thời gian trùng lặp, khoảng thời gian hợp lệ)
 * Created By hanv 20/01/2026
 */

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
import { useAppStore } from "../../../stores/appStore";
import { useFormValidator } from "../../../composables/useFormValidator";
import { isEmpty, isEqual, isTimeInRange } from "../../../utils/validation";

const toast = useToast();
const appStore = useAppStore();
const { validateModalForm, validateNotEqual, validateTimeInRange } = useFormValidator();

/**
 * Cấu hình và dữ liệu bảng ca làm việc
 * Chứa header (cột), body (dòng), phân trang, trạng thái modal lọc/sắp xếp
 * @type {Object} propsTable
 * @property {Array} tableData.header - Danh sách cột bảng với cấu hình lọc, sắp xếp
 * @property {Array} tableData.body - Danh sách dòng dữ liệu ca làm việc
 * @property {Object} tableData.pagination - Cấu hình phân trang (pageSize, currentPage, totalCount)
 * @property {Array} tableData.idsSelected - Danh sách ID được chọn
 * Created By hanv 20/01/2026
 */
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
      left: "calc(50% - 225px)",
      top: "calc(50% - 150px)",
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

/**
 * Cấu hình modal thêm/sửa ca làm việc
 * Quản lý dữ liệu form, trạng thái, lỗi và button footer
 * @type {Object} propsModal
 * @property {number} idEdited - ID ca làm việc đang chỉnh sửa (null nếu thêm mới)
 * @property {Object} shiftUpdated - Dữ liệu ca làm việc hiện tại
 * @property {Array} modalInputFields - Danh sách nhóm form fields với validation
 * @property {Array} buttonFooter - Cấu hình button footer (Lưu, Hủy, etc)
 * @property {boolean} isShowModal - Trạng thái modal (mở/đóng)
 * @property {Object} errorModal - Thông tin modal lỗi hiển thị
 * Created By hanv 20/01/2026
 */
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

/**
 * Modal xác nhận xóa ca làm việc
 * Hiển thị thông báo và xác nhận trước khi xóa dữ liệu
 * @type {Object} deleteConfirmModal
 * @property {string} title - Tiêu đề modal "Xóa Ca làm việc!"
 * @property {string} message - Nội dung cảnh báo (động dựa trên số lượng)
 * @property {Array} buttonFooterModalError - Button footer (Hủy/Xóa)
 * Created By hanv 20/01/2026
 */
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
const timeRef = {
  shiftBeginTime: null,
  shiftEndTime: null,
  shiftBeginBreakTime: null,
  shiftEndBreakTime: null,
  shiftBreakingTime: null,
  shiftWorkingTime: null,
};

/**
 * Hiển thị toast notification
 * @param {string} message - Nội dung thông báo
 * @param {string} status - Loại thông báo: success, error, info, warning
 */
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

/**
 * Tính toán thời gian làm việc và thời gian nghỉ giữa ca
 * Cập nhật giá trị vào timeRef và các trường tương ứng trong modal
 */
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

/**
 * Xử lý thay đổi trạng thái radio button (Active/Inactive)
 * @param {number} indexCheckbox - Index của checkbox được chọn
 * @param {number} indexModalInputFields - Index của nhóm input fields
 * @param {number} indexFieldItems - Index của field item
 */
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

/**
 * Xử lý và hiển thị lỗi từ API response
 * Map lỗi từ API vào các field tương ứng trong modal và hiển thị error modal
 * @param {Object} error - Error response từ API
 */
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

/**
 * Lấy dữ liệu từ modal form và format theo yêu cầu API
 * Xử lý các trường đặc biệt: ShiftStatus, ShiftWorkingTime, ShiftBreakingTime
 * @param {string} action - Loại action: 'add' hoặc 'update'
 * @returns {Object} Form data đã được format
 */
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

/**
 * Xử lý sự kiện blur trên input field
 * Validate required field khi người dùng rời khỏi input
 * @param {number} indexFieldItems - Index của field item
 * @param {number} indexModalInputFields - Index của nhóm input fields
 */
function handleBlurAction(indexFieldItems, indexModalInputFields) {
  if (
    propsModal.value.modalInputFields[indexModalInputFields].formItems[
      indexFieldItems
    ].isRequired
  ) {
    if (
      propsModal.value.modalInputFields[indexModalInputFields].formItems[
        indexFieldItems
      ].value === null ||
      propsModal.value.modalInputFields[indexModalInputFields].formItems[
        indexFieldItems
      ].value === "" ||
      (typeof propsModal.value.modalInputFields[indexModalInputFields]
        .formItems[indexFieldItems].value === "string" &&
        propsModal.value.modalInputFields[indexModalInputFields].formItems[
          indexFieldItems
        ].value.trim() === "")
    ) {
      propsModal.value.modalInputFields[indexModalInputFields].formItems[
        indexFieldItems
      ].message =
        `${propsModal.value.modalInputFields[indexModalInputFields].formItems[indexFieldItems].label} không được để trống.`;
      propsModal.value.modalInputFields[indexModalInputFields].formItems[
        indexFieldItems
      ].errorMessage =
        `${propsModal.value.modalInputFields[indexModalInputFields].formItems[indexFieldItems].label} không được để trống.`;
    } else {
      propsModal.value.modalInputFields[indexModalInputFields].formItems[
        indexFieldItems
      ].errorMessage = "";
    }
  }
}
/**
 * Validate dữ liệu trong modal ca làm việc
 * Sử dụng useFormValidator để kiểm tra:
 * - Required fields (Mã ca, Tên ca, Giờ vào/hết ca)
 * - Business rules (Giờ hết ca != Giờ vào ca, thời gian nghỉ trong khoảng hợp lệ)
 * @returns {boolean} - true nếu dữ liệu hợp lệ
 */
function validationShiftModal() {
  // Định nghĩa các rule validate nghiệp vụ
  const customRules = {
    // Rule 1: Giờ hết ca không được bằng giờ vào ca
    [CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndTime]: () => {
      if (
        !isEmpty(timeRef.shiftEndTime) &&
        !isEmpty(timeRef.shiftBeginTime) &&
        isEqual(timeRef.shiftEndTime, timeRef.shiftBeginTime)
      ) {
        propsModal.value.errorModal.message = "Giờ hết ca không được bằng giờ vào ca.";
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
        !isEmpty(timeRef.shiftEndBreakTime) &&
        !isEmpty(timeRef.shiftBeginBreakTime) &&
        isEqual(timeRef.shiftEndBreakTime, timeRef.shiftBeginBreakTime)
      ) {
        propsModal.value.errorModal.message = "Kết thúc nghỉ giữa ca không được bằng Bắt đầu nghỉ giữa ca.";
        return {
          isValid: false,
          message: "Kết thúc nghỉ giữa ca không được bằng Bắt đầu nghỉ giữa ca.",
        };
      }
      return { isValid: true };
    },

    // Rule 3: Thời gian bắt đầu nghỉ giữa ca phải nằm trong khoảng ca làm việc
    [CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginBreakTime]: () => {
      if (
        !isEmpty(timeRef.shiftBeginBreakTime) &&
        !isEmpty(timeRef.shiftBeginTime) &&
        !isEmpty(timeRef.shiftEndTime) &&
        !isTimeInRange(timeRef.shiftBeginBreakTime, timeRef.shiftBeginTime, timeRef.shiftEndTime)
      ) {
        const message = "Thời gian bắt đầu nghỉ giữa ca phải nằm trong khoảng thời gian tính từ giờ vào ca đến giờ hết ca. Vui lòng kiểm tra lại.";
        propsModal.value.errorModal.message = message;
        return { isValid: false, message };
      }
      return { isValid: true };
    },

    // Rule 4: Thời gian kết thúc nghỉ giữa ca phải nằm trong khoảng ca làm việc  
    shiftEndBreakTimeRange: () => {
      if (
        !isEmpty(timeRef.shiftEndBreakTime) &&
        !isEmpty(timeRef.shiftBeginTime) &&
        !isEmpty(timeRef.shiftEndTime) &&
        !isTimeInRange(timeRef.shiftEndBreakTime, timeRef.shiftBeginTime, timeRef.shiftEndTime)
      ) {
        const message = "Thời gian kết thúc nghỉ giữa ca phải nằm trong khoảng thời gian tính từ giờ vào ca đến giờ hết ca. Vui lòng kiểm tra lại.";
        propsModal.value.errorModal.message = message;
        
        // Gán error cho field shiftEndBreakTime
        propsModal.value.modalInputFields.forEach(group => {
          group.formItems.forEach(item => {
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
  const result = validateModalForm(
    propsModal.value.modalInputFields,
    customRules
  );

  // Nếu có lỗi và chưa có message, set error message đầu tiên vào errorModal
  if (!result && !propsModal.value.errorModal.message) {
    const firstError = Object.values(customRules).find(rule => {
      const ruleResult = rule();
      return !ruleResult.isValid;
    });
    if (firstError) {
      const ruleResult = firstError();
      propsModal.value.errorModal.message = ruleResult.message;
    }
  }

  return result;
}
/**
 * Lưu ca làm việc mới
 * Validate dữ liệu, gọi API, cập nhật bảng và thông báo kết quả
 */
async function handleSave() {
  // Kiểm tra dữ liệu hợp lệ
  if (!validationShiftModal()) {
    return;
  }
  // Bật trạng thái loading
  appStore.setIsLoading(true);
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
  // Tắt trạng thái loading
  appStore.setIsLoading(false);
}

/**
 * Lưu và tiếp tục thêm mới ca làm việc
 * TODO: Implement chức năng lưu và giữ modal mở để thêm tiếp
 */
function handleSaveAdd() {
  console.log("Save and Add clicked");
}

/**
 * Cập nhật thông tin ca làm việc
 * Validate dữ liệu, gọi API, cập nhật bảng và thông báo kết quả
 */
async function handleUpdate() {
  // Kiểm tra dữ liệu hợp lệ
  if (!validationShiftModal()) {
    return;
  }

  let formData = getDataFromModal("update");

  appStore.setIsLoading(true);
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
              switch (col.columnName) {
                case CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginTime:
                case CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndTime:
                case CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginBreakTime:
                case CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndBreakTime:
                  if (response.data[col.columnName] !== undefined) {
                    col.columnData = formatTime(response.data[col.columnName]);
                  }
                  break;
                case CONSTANTS.COLUMN_NAME_SHIFT.CreatedDate:
                case CONSTANTS.COLUMN_NAME_SHIFT.ModifiedDate:
                  if (response.data[col.columnName] !== undefined) {
                    col.columnData = formatDate(response.data[col.columnName]);
                  }
                  break;
                case CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus:
                  // Xử lý riêng cho cột Trạng thái
                  col.columnData =
                    CONSTANTS.STATUS_SHIFT[
                      response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus]
                    ];

                  col.isActive =
                    response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus];
                  propsModal.value.shiftUpdated.shiftStatus = col.isActive
                    ? CONSTANTS.STATUS_SHIFT.Active
                    : CONSTANTS.STATUS_SHIFT.Inactive;
                  break;
                default:
                  if (response.data[col.columnName] !== undefined) {
                    col.columnData = response.data[col.columnName];
                  }
                  break;
              }
            });
            // Cập nhật lại dữ liệu cho nút hành động trong hàng tương ứng
            item.row.btnActions.forEach((btnAction) => {
              btnAction.shiftUpdated = {
                shiftId: response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftId],
                shiftCode: response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftCode],
                shiftName: response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftName],
                shiftDescription:
                  response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftDescription],
                shiftBeginTime:
                  response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginTime],
                shiftEndTime:
                  response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndTime],
                shiftBeginBreakTime:
                  response.data[
                    CONSTANTS.COLUMN_NAME_SHIFT.ShiftBeginBreakTime
                  ],
                shiftEndBreakTime:
                  response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftEndBreakTime],
                shiftWorkingTime:
                  response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftWorkingTime],
                shiftBreakingTime:
                  response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftBreakingTime],
                shiftStatus:
                  response.data[CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus],
                createdBy: response.data[CONSTANTS.COLUMN_NAME_SHIFT.CreatedBy],
                createdDate:
                  response.data[CONSTANTS.COLUMN_NAME_SHIFT.CreatedDate],
                modifiedBy:
                  response.data[CONSTANTS.COLUMN_NAME_SHIFT.ModifiedBy],
                modifiedDate:
                  response.data[CONSTANTS.COLUMN_NAME_SHIFT.ModifiedDate],
              };
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
  appStore.setIsLoading(false);
}
/**
 * Cập nhật trạng thái ca làm việc thành Đang không sử dụng (Inactive)
 * Gọi API updateStatusInactive và xử lý lỗi
 * @param {Array} shiftIds - Danh sách ID ca làm việc cần cập nhật
 * @returns {Promise<Object|null>} Response từ API hoặc null nếu lỗi
 * Created By hanv 20/01/2026
 */
async function handleUpdateStatusInactive(shiftIds) {
  appStore.setIsLoading(true);

  return await ShiftApi.updateStatusInactive(shiftIds)
    .then((response) => {
      appStore.setIsLoading(false);
      return response;
    })
    .catch((error) => {
      appStore.setIsLoading(false);
      console.error("Lỗi khi thay đổi trạng thái ca làm việc:", error);
      return null;
    });
}
/**
 * Cập nhật trạng thái ca làm việc thành Đang sử dụng (Active)
 * Gọi API updateStatusActive và xử lý lỗi
 * @param {Array} shiftIds - Danh sách ID ca làm việc cần cập nhật
 * @returns {Promise<Object|null>} Response từ API hoặc null nếu lỗi
 * Created By hanv 20/01/2026
 */
async function handleUpdateStatusActive(shiftIds) {
  appStore.setIsLoading(true);
  return await ShiftApi.updateStatusActive(shiftIds)
    .then((response) => {
      appStore.setIsLoading(false);
      return response;
    })
    .catch((error) => {
      appStore.setIsLoading(false);
      console.error("Lỗi khi thay đổi trạng thái ca làm việc:", error);
      return null;
    });
}
/**
 * Xóa ca làm việc theo danh sách ID
 * Gọi API deleteShift và hiển thị toast lỗi nếu thất bại
 * @param {Array} shiftIds - Danh sách ID ca làm việc cần xóa
 * @returns {Promise<Object|null>} Response từ API hoặc null nếu lỗi
 * Created By hanv 20/01/2026
 */
async function deleteShifts(shiftIds) {
  appStore.setIsLoading(true);

  return await ShiftApi.deleteShift(shiftIds)
    .then((response) => {
      appStore.setIsLoading(false);

      return response;
    })
    .catch((error) => {
      appStore.setIsLoading(false);
      console.error("Lỗi khi xóa ca làm việc:", error);
      showToast("Lỗi khi xóa ca làm việc", "error");
      return null;
    });
}
/**
 * Mở modal thêm/sửa ca làm việc
 * Đặt trạng thái hiển thị modal về true
 * Created By hanv 20/01/2026
 */
function openModal() {
  propsModal.value.isShowModal = true;
}
/**
 * Đóng modal và đặt lại dữ liệu form
 * Reset id chỉnh sửa, dữ liệu form và modal lỗi
 * Created By hanv 20/01/2026
 */
function closeModal() {
  propsModal.value.isShowModal = false;
  propsModal.value.idEdited = null;
  propsModal.value.shiftUpdated = null;
  clearModalInputFields(propsModal.value);
  closeErrorModal();
}

/**
 * Đóng modal lỗi và xóa message
 */
function closeErrorModal() {
  propsModal.value.errorModal.message = "";
  deleteConfirmModal.value.message = "";
}

/**
 * Xử lý các action từ footer buttons của modal
 * Router actions: save, saveAdd, update, closeModal, closeErrorModal
 * @param {string} action - Tên action cần thực hiện
 */
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

/**
 * Xóa toàn bộ dữ liệu trong modal input fields
 * Reset values, errors và timeRef
 * @param {Object} modalProps - Modal properties object
 */
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

/**
 * Tạo cấu hình buttons cho modal footer
 * Khác nhau giữa mode 'add' và 'update'
 * @param {string} action - Mode: 'add' hoặc 'update'
 */
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
/**
 * Đóng tất cả select box của nút hành động "Khác" trong bảng
 * Created By hanv 20/01/2026
 */
function closeAllMoreMenuSelectBox() {
  propsTable.value.tableData.body.forEach((item) => {
    item.row.btnActions.forEach((btnAction) => {
      btnAction.isOpenSelectBox = false;
    });
  });
}
/**
 * Mở modal xác nhận xóa ca làm việc
 * Cập nhật nội dung cảnh báo theo số bản ghi được chọn
 * Created By hanv 20/01/2026
 */
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
/**
 * Thay đổi trạng thái cho nhiều ca làm việc (Active/Inactive)
 * @param {number} status - Giá trị trạng thái cần áp dụng (CONSTANTS.STATUS_SHIFT)
 * @returns {Promise<void>}
 * Created By hanv 20/01/2026
 */
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
/**
 * Router xử lý tất cả action phát sinh từ bảng (edit, add, duplicate, sort, filter, delete,...)
 * @param {string} action - Tên action từ BaseTable
 * @param {Object|null} shiftUpdated - Dữ liệu ca làm việc liên quan (nếu có)
 * @param {number} indexTbdItem - Index hàng trong bảng
 * @param {number} indexBtnAction - Index nút hành động
 * @param {Event|string} event - Event DOM hoặc payload (từ khóa tìm kiếm)
 * @param {number} sortType - Kiểu sắp xếp (Enums.SortType)
 * @returns {Promise<void>}
 * Created By hanv 20/01/2026
 */
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

      // Nếu sau khi xóa mà không còn dữ liệu thì đặt lại trang hiện tại về trang trước đó
      if (propsTable.value.tableData.body.length === 0) {
        propsTable.value.tableData.pagination.currentPage -= 1;
      }

      // Cập nhật lại tổng số bản ghi trong phân trang
      propsTable.value.tableData.pagination.totalCount -= 1;

      showToast("Xóa Ca làm việc thành công", "success");
    }

    closeErrorModal();
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

      // Nếu sau khi xóa mà không còn dữ liệu thì đặt lại trang hiện tại về trang trước đó
      if (propsTable.value.tableData.body.length === 0) {
        propsTable.value.tableData.pagination.currentPage -= 1;
      }

      // Cập nhật lại tổng số bản ghi trong phân trang
      propsTable.value.tableData.pagination.totalCount -=
        propsTable.value.tableData.idsSelected.length;

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
    appStore.setIsLoading(true);

    checkExistFilterRef(sortType);
    await loadShiftsWithFilter();

    appStore.setIsLoading(false);
    closeAllSortMenu();
    return;
  }
  // Tìm kiếm theo từ khóa
  if (action === "searchByKeyword") {
    appStore.setIsLoading(true);

    // Gán giá trị từ khóa tìm kiếm vào filter
    filterRef.value.SearchKeyword = event;
    await loadShiftsWithFilter();
    appStore.setIsLoading(false);

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
    appStore.setIsLoading(true);

    checkExistFilterRef(null);
    // Đặt lại trang hiện tại về 1
    propsTable.value.tableData.pagination.currentPage = 0;
    closeAllFilterValueColumnModal();
    await loadShiftsWithFilter();
    appStore.setIsLoading(false);
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
/**
 * Xóa tất cả điều kiện lọc đang áp dụng trên bảng
 * Reset cả filterRef và trạng thái filter trên header
 * Created By hanv 20/01/2026
 */
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
/**
 * Xóa điều kiện lọc của cột đang thao tác (indexTbhItem)
 * Cập nhật filterRef và giá trị lưu trong header
 * Created By hanv 20/01/2026
 */
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
/**
 * Kiểm tra và cập nhật/khởi tạo filterRef cho cột hiện tại
 * @param {number|null} sortType - Kiểu sắp xếp cần cập nhật, null nếu không đổi
 * @returns {void}
 * Created By hanv 20/01/2026
 */
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
/**
 * Đóng tất cả select box của nút hành động "Khác" trên tất cả hàng
 * Created By hanv 20/01/2026
 */
function closeAllMenuBtnAction() {
  propsTable.value.tableData.body.forEach((item, idxTbd) => {
    item.row.btnActions.forEach((btnAction, idxBtnAction) => {
      btnAction.isOpenSelectBox = false;
    });
  });
}
/**
 * Đóng tất cả select box sắp xếp cột
 * Created By hanv 20/01/2026
 */
function closeAllSortMenu() {
  propsTable.value.tableData.header.forEach((item, idx) => {
    item.isOpenSortMenu = false;
  });
}
/**
 * Đóng tất cả modal lọc giá trị cột đang mở
 * Created By hanv 20/01/2026
 */
function closeAllFilterValueColumnModal() {
  propsTable.value.tableData.header.forEach((item, idx) => {
    item.isOpenFilterColumnValueModal = false;
  });
}
/**
 * Reset toàn bộ style menu (sort, more, filter) về mặc định
 * Created By hanv 20/01/2026
 */
function resetAllMenu() {
  propsTable.value.tableData.styleColumnValueModal = {};
  propsTable.value.tableData.styleHeaderContainer = {};
  propsTable.value.tableData.styleMoreContainer = {};
}
/**
 * Reset menu trừ modal lọc giá trị cột (giữ nguyên filter modal)
 * Created By hanv 20/01/2026
 */
function resetMenuUnlessFilterModal() {
  propsTable.value.tableData.styleHeaderContainer = {};
  propsTable.value.tableData.styleMoreContainer = {};
}
/**
 * Tính toán vị trí hiển thị menu (sort/more/filter) dựa trên vị trí nút được click
 * @param {Event} event - Sự kiện click từ nút hành động
 * @param {number} [menuWidth=450] - Độ rộng menu để tránh tràn màn hình
 * @returns {Object} Tọa độ top/left/right dạng px
 * Created By hanv 20/01/2026
 */
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

/**
 * Đồng bộ giá trị filter type từ modal lọc về header cột hiện tại
 * Created By hanv 20/01/2026
 */
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

/**
 * Đồng bộ kiểu filter từ modal lọc về header cột hiện tại
 * Created By hanv 20/01/2026
 */
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
/**
 * Mở/đóng modal lọc giá trị cột và cấu hình menu filter
 * @param {number} indexTbhItems - Index cột trong header
 * @param {Event} event - Sự kiện click nút filter
 * @returns {Promise<void>}
 * Created By hanv 20/01/2026
 */
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
/**
 * Mở/đóng select box sắp xếp cột, thiết lập vị trí hiển thị
 * @param {Event} event - Sự kiện click nút sort
 * @param {number} indexTbhItems - Index cột trong header
 * Created By hanv 20/01/2026
 */
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
/**
 * Mở/đóng select box "Khác" cho từng hàng, cấu hình menu hành động
 * @param {Event} event - Sự kiện click nút more
 * @param {number} indexTbdItem - Index dòng trong body
 * @param {number} indexBtnAction - Index nút hành động trong dòng
 * @param {Object} shiftUpdated - Dữ liệu ca làm việc tương ứng
 * Created By hanv 20/01/2026
 */
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
/**
 * Cập nhật danh sách ID đang được chọn trong bảng
 * @param {Array} selectedIds - Danh sách ID được chọn
 * Created By hanv 20/01/2026
 */
function handleChangedSelectedIds(selectedIds) {
  propsTable.value.tableData.idsSelected = selectedIds;
}
/**
 * Lấy text hành động thay đổi trạng thái (Ngừng sử dụng/Sử dụng)
 * @param {number} indexTbdItem - Index dòng trong body
 * @returns {string} Nhãn hành động tương ứng trạng thái hiện tại
 * Created By hanv 20/01/2026
 */
function getStatusActionText(indexTbdItem) {
  const row = propsTable.value.tableData.body[indexTbdItem];
  if (!row) return "";

  const statusCol = row.row.rowItems.find(
    (col) => col.columnName === CONSTANTS.COLUMN_NAME_SHIFT.ShiftStatus,
  );

  if (!statusCol) return "";

  return statusCol.isActive ? "Ngừng sử dụng" : "Sử dụng";
}

/**
 * Tạo cấu trúc dữ liệu row cho bảng từ shift data
 * Map dữ liệu ca làm việc thành format của table component
 * @param {Object} item - Dữ liệu ca làm việc từ API
 * @returns {Object} Row data đã được format cho table
 */
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
/**
 * Gọi API lấy danh sách ca làm việc (phân trang)
 * Reset body và cập nhật pagination.totalCount
 * @returns {Promise<void>}
 * Created By hanv 20/01/2026
 */
const loadShifts = async () => {
  try {
    appStore.setIsLoading(true);

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
      // Cập nhật tổng số bản ghi
      propsTable.value.tableData.pagination.totalCount = response.totalItem;
      appStore.setIsLoading(false);
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ca làm việc:", error);
    appStore.setIsLoading(false);
  }
};
/**
 * Gọi API lấy danh sách ca làm việc với filter & phân trang
 * @returns {Promise<void>}
 * Created By hanv 20/01/2026
 */
const loadShiftsWithFilter = async () => {
  appStore.setIsLoading(true);

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
  appStore.setIsLoading(false);
};
/**
 * Cập nhật trang hiện tại của bảng
 * @param {number} newPage - Trang mới
 * Created By hanv 20/01/2026
 */
function handleChangeCurrentPage(newPage) {
  propsTable.value.tableData.pagination.currentPage = newPage;
}
/**
 * Reload dữ liệu bảng theo trạng thái filter hiện tại
 * Đặt currentPage về 0 và gọi API phù hợp
 * @returns {Promise<void>}
 * Created By hanv 20/01/2026
 */
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
/**
 * Theo dõi thay đổi pageSize để reload dữ liệu
 * Created By hanv 20/01/2026
 */
watch(
  () => propsTable.value.tableData.pagination.pageSize,
  async () => {
    await reloadData();
  },
  { deep: true },
);
/**
 * Theo dõi thay đổi currentPage để load dữ liệu phù hợp filter
 * Created By hanv 20/01/2026
 */
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
      @blur-action="handleBlurAction"
    >
    </BaseModal>
  </div>
</template>

<style scoped></style>
