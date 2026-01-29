import { defineStore } from "pinia";
import { ref } from "vue";
import { CONSTANTS } from "../constants/common";

/**
 * Global app store quản lý sidebar và trạng thái loading.
 * @returns {{sidebarCollapsed: import('vue').Ref<boolean>, sidebarItems: import('vue').Ref<Array>, isLoading: import('vue').Ref<boolean>, toggleSidebar: Function, setIsLoading: Function}}
 */
export const useAppStore = defineStore("app", () => {
  // Sidebar collapsed state
  const sidebarCollapsed = ref(
    localStorage.getItem("sidebarCollapsed") === "true",
  );
  // Sidebar menu items
  const sidebarItems = ref([
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -6,
          y: -7,
        },
      },
      title: "Tổng quan",
      route: "/development/dashboard",
      subMenu: null,
      isMenuItemLine: false,
      isActive: true,
    },
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -344,
          y: -86,
        },
      },
      title: "Đơn đặt hàng",
      route: "/development/sale-order",
      subMenu: null,
      isMenuItemLine: false,
      isActive: false,
    },
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -32,
          y: -7,
        },
      },
      title: "Kế hoạch sản xuất",
      route: null,
      subMenu: {
        isOpen: false,
        style: {
          top: "0px",
          left: "0px",
        },
        subMenuItems: [
          {
            title: "Kế hoạch tổng thể",
            route: "/development/production-plan/overall-plan",
            isOpen: false,
          },
          {
            title: "Kế hoạch chi tiết",
            route: "/development/production-plan/detailed-plan",
            isOpen: false,
          },
          {
            title: "Kế hoạch nguyên vật liệu",
            route: "/development/production-plan/materialplan",
            isOpen: false,
          },
          {
            title: "Yêu cầu mua NVL",
            route: "/development/production-plan/materialPurchaseRequest",
            isOpen: false,
          },
        ],
      },
      isMenuItemLine: false,
      isActive: false,
    },
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -57,
          y: -7,
        },
      },
      title: "Điều phối và thực thi",
      route: null,
      subMenu: {
        isOpen: false,
        style: {
          top: "0px",
          left: "0px",
        },
        subMenuItems: [
          {
            title: "Lệnh sản xuất",
            route: "/development/production-execution/order",
          },
          {
            title: "Lịch sản xuất",
            route: "/development/production-execution/schedule",
          },
          {
            title: "Yêu cầu xuất vật tư",
            route: "/development/production-execution/material-request",
          },
          {
            title: "Thống kê sản xuất",
            route: "/development/production-execution/statistics",
          },
          {
            title: "Yêu cầu nhập thành phần",
            route: "/development/production-execution/product-request",
          },
          {
            title: "Bàn giao bán thành phẩm",
            route: null,
            popupMenu: {
              isOpen: false,
              popupMenuItemRouter: null,
              style: {
                top: "0px",
                left: "0px",
              },
              popupMenuItems: [
                {
                  popupMenuItemsHeader: null,
                  popupMenuItemsList: [
                    {
                      title: "Bàn giao",
                      route: "/development/production-execution/handover",
                    },
                    {
                      title: "Trả lại",
                      route: "/development/production-execution/handoverreturn",
                    },
                  ],
                },
              ],
            },
          },
          {
            title: "Tình hình bàn giao sản xuất",
            route: "/development/production-execution/handover-overview",
          },
        ],
      },
      isMenuItemLine: false,
      isActive: false,
    },
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -110,
          y: -6,
        },
      },
      title: "Kiểm tra chất lượng",
      route: null,
      subMenu: {
        isOpen: false,
        style: {
          top: "0px",
          left: "0px",
        },
        subMenuItems: [
          {
            title: "Yêu cầu kiểm tra",
            route: "/development/product-quality/quality-check-request",
          },
          {
            title: "Phiếu kiểm tra",
            route: "/development/product-quality/inspection-voucher",
          },
          {
            title: "Tiêu chuẩn",
            route: null,
            popupMenu: {
              isOpen: false,
              popupMenuItemRouter: null,
              style: {
                top: "0px",
                left: "0px",
              },
              popupMenuItems: [
                {
                  popupMenuItemsHeader: null,
                  popupMenuItemsList: [
                    {
                      title: "Tiêu chí chất lượng",
                      route: "/development/product-quality/criteria",
                    },
                    {
                      title: "Nhóm tiêu chí chất lượng",
                      route: "/development/product-quality/criteria-group",
                    },
                    {
                      title: "Phương pháp chọn mẫu",
                      route: "/development/product-quality/sampling-method",
                    },
                    {
                      title: "Bộ tiêu chuẩn kiểm tra chất lượng",
                      route: "/development/product-quality/quality-standard",
                    },
                    {
                      title: "Lỗi kiểm tra chất lượng",
                      route: "/development/product-quality/quality-error",
                    },
                    {
                      title: "Nhóm lỗi kiểm tra chất lượng",
                      route: "/development/product-quality/quality-error-group",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      isMenuItemLine: false,
      isActive: false,
    },
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -84,
          y: -6,
        },
      },
      title: "Kho vật tư",
      route: null,
      subMenu: {
        isOpen: false,
        style: {
          top: "0px",
          left: "0px",
        },
        subMenuItems: [
          {
            title: "Đề nghị kho cấp vật tư",
            route: "/development/production-material/request-material",
          },
          {
            title: "Nhập kho",
            route: "/development/production-material/factory-inward",
          },
          {
            title: "Xuất kho",
            route: "/development/production-material/export-material",
          },
          {
            title: "Điều chuyển",
            route: "/development/production-material/transfer-material",
          },
          {
            title: "Tồn kho đầu kỳ",
            route: "/development/production-material/opn-inventory-stock",
          },
        ],
      },
      isMenuItemLine: false,
      isActive: false,
    },
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -318,
          y: -6,
        },
      },
      title: "Giao việc",
      route: null,
      subMenu: {
        isOpen: false,
        style: {
          top: "0px",
          left: "0px",
        },
        subMenuItems: [
          {
            title: "Phiếu giao việc công đoạn",
            route: "/development/production-work/work-order",
          },
          {
            title: "Tình hình giao việc",
            route: "/development/production-work/work-order-situation",
          },
        ],
      },
      isMenuItemLine: false,
      isActive: false,
    },
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -136,
          y: -86,
        },
      },
      title: "Truy xuất nguồn gốc",
      route: "/development/production-traceability",
      subMenu: null,
      isMenuItemLine: true,
      isActive: false,
    },
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -214,
          y: -7,
        },
      },
      title: "Báo cáo",
      route: "/development/reportlist",
      subMenu: null,
      isMenuItemLine: true,
      isActive: false,
    },
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -136,
          y: -6,
        },
      },
      title: "Sản phẩm, NVL",
      route: null,
      subMenu: {
        isOpen: false,
        style: {
          top: "0px",
          left: "0px",
        },
        subMenuItems: [
          {
            title: "Vật tư hàng hóa",
            route: "/development/dictionary/inventoryitem",
          },
          {
            title: "Nhóm vật tư hàng hóa",
            route: "/development/dictionary/inventoryitemgroup",
          },
          {
            title: "Định mức nguyên vật liệu",
            route: "/development/dictionary/billOfMaterials",
          },
          {
            title: "Nguyên vật liệu thay thế",
            route: "/development/dictionary/alternativeMaterialList",
          },
        ],
      },
      isMenuItemLine: false,
      isActive: false,
    },
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -162,
          y: -6,
        },
      },
      title: "Quy trình sản xuất",
      route: null,
      subMenu: {
        isOpen: false,
        style: {
          top: "0px",
          left: "0px",
        },
        subMenuItems: [
          {
            title: "Công đoạn",
            route: "/development/production-process/stage",
          },
          {
            title: "Quy trình sản xuất",
            route: "/development/production-process/production-process",
          },
        ],
      },
      isMenuItemLine: false,
      isActive: false,
    },
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -189,
          y: -6,
        },
      },
      title: "Năng lực sản xuất",
      route: null,
      subMenu: {
        isOpen: false,
        style: {
          top: "0px",
          left: "0px",
        },
        subMenuItems: [
          {
            title: "Tổ sản xuất",
            route: "/development/production-capacity/productionTeam",
          },
          {
            title: "Máy móc",
            route: "/development/production-capacity/productionEquipment",
          },
          {
            title: "Nhóm năng lực",
            route: "/development/production-capacity/productionCapacityGroup",
          },
          {
            title: "Khuôn",
            route: "/development/production-capacity/productionPattern",
          },
        ],
      },
      isMenuItemLine: false,
      isActive: false,
    },
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -240,
          y: -6,
        },
      },
      title: "Danh mục khác",
      route: null,
      popupMenuOutside: {
        isOpen: false,
        style: {
          top: "0px",
          left: "0px",
        },
        popupMenuItems: [
          {
            popupMenuItemsHeader: "Đối tượng",
            popupMenuItemsList: [
              {
                title: "Khách hàng",
                route: "/development/dictionary/customer",
              },
              {
                title: "Nhân viên",
                route: "/development/dictionary/employee",
              },
              {
                title: "Đối tượng tập hợp chi phí",
                route: "/development/dictionary/job",
              },
            ],
          },
          {
            popupMenuItemsHeader: "Lịch làm việc",
            popupMenuItemsList: [
              {
                title: "Ca làm việc",
                route: "/development/dictionary/shift",
              },
              {
                title: "Ngày nghỉ",
                route: "/development/dictionary/holiday-schedule",
              },
              {
                title: "Lịch làm việc",
                route: "/development/dictionary/work-schedule",
              },
            ],
          },
          {
            popupMenuItemsHeader: "Khác",
            popupMenuItemsList: [
              {
                title: "Cơ cấu tổ chức",
                route: "/development/dictionary/organization",
              },
              {
                title: "Kho",
                route: "/development/dictionary/stock",
              },
              {
                title: "Đơn vị tính",
                route: "/development/dictionary/unit",
              },
              {
                title: "Lý do dừng công việc",
                route: "/development/dictionary/reason",
              },
            ],
          },
        ],
      },
      subMenu: null,
      isMenuItemLine: false,
      isActive: false,
    },
    {
      icon: {
        url: "/src/assets/icons/pas.qtsx_icon-e5768799.svg",
        position: {
          x: -266,
          y: -6,
        },
      },
      title: "Thiết lập",
      route: null,
      popupMenuOutside: {
        isOpen: false,
        style: {
          top: "0px",
          left: "0px",
        },
        popupMenuItems: [
          {
            popupMenuItemsHeader: "Thiết lập",
            popupMenuItemsList: [
              {
                title: "Thông tin công ty",
                route: "/development/system/optionsgeneral",
              },
              {
                title: "Người dùng, vai trò",
                route: "/development/system/user",
              },
              {
                title: "Tùy chọn",
                route: "/development/system/option-inventoryitem",
              },
              {
                title: "Kết nối ứng dụng",
                route: "/development/system/app-connection",
              },
            ],
          },
          {
            popupMenuItemsHeader: "Tiện tích",
            popupMenuItemsList: [
              {
                title: "Nhật ký truy cập",
                route: "/development/system/AuditingLog",
              },
            ],
          },
        ],
      },
      subMenu: null,
      isMenuItemLine: false,
      isActive: false,
    },
  ]);

  /**
   * Đảo trạng thái thu gọn/ mở rộng sidebar và lưu vào localStorage.
   */
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
    localStorage.setItem("sidebarCollapsed", sidebarCollapsed.value.toString());
  }

  // Định nghĩa bảng ca làm việc
  const tableHeaders = ref([
    {
      key: "shiftId",
      title: "Id ca",
      type: "text",
      sortable: true,
      hiding: true,

      realPos: 0,
    },
    {
      key: "shiftCode",
      title: "Mã ca",
      type: "text",
      width: "120px",
      sortable: true,

      filterable: true,
      filterType: "text",
      filterOptions: CONSTANTS.FilterOptionsType.Text,

      textAlign: "left",

      realPos: 1,
    },
    {
      key: "shiftName",
      title: "Tên ca",
      type: "text",
      width: "250px",
      sortable: true,

      filterable: true,
      filterType: "text",
      filterOptions: CONSTANTS.FilterOptionsType.Text,

      textAlign: "left",

      realPos: 2,
    },
    {
      key: "shiftBeginTime",
      title: "Giờ vào ca",
      type: "time",
      width: "150px",
      sortable: true,

      filterable: true,
      filterType: "text",
      filterOptions: CONSTANTS.FilterOptionsType.Text,

      textAlign: "left",
      render: (rowData: string | number) => {
        return rowData ? rowData.toString().slice(0, 5) : "--";
      },

      realPos: 3,
    },
    {
      key: "shiftEndTime",
      title: "Giờ hết ca",
      type: "time",
      width: "150px",
      sortable: true,

      filterable: true,
      filterType: "text",
      filterOptions: CONSTANTS.FilterOptionsType.Text,

      textAlign: "left",
      render: (rowData: string | number) => {
        return rowData ? rowData.toString().slice(0, 5) : "--";
      },

      realPos: 4,
    },
    {
      key: "shiftBeginBreakTime",
      title: "Bắt đầu nghỉ giữa ca",
      type: "time",
      width: "220px",
      sortable: true,

      filterable: true,
      filterType: "text",
      filterOptions: CONSTANTS.FilterOptionsType.Text,

      textAlign: "left",
      render: (rowData: string | number) => {
        return rowData ? rowData.toString().slice(0, 5) : "--";
      },

      realPos: 5,
    },
    {
      key: "shiftEndBreakTime",
      title: "Kết thúc",
      type: "time",
      width: "220px",
      sortable: true,

      filterable: true,
      filterType: "text",
      filterOptions: CONSTANTS.FilterOptionsType.Text,

      textAlign: "left",
      render: (rowData: string | number) => {
        return rowData ? rowData.toString().slice(0, 5) : "--";
      },

      realPos: 6,
    },
    {
      key: "shiftWorkingTime",
      title: "Thời gian làm việc (giờ)",
      type: "number",
      width: "250px",
      sortable: true,

      filterable: true,
      filterType: "text",
      filterOptions: CONSTANTS.FilterOptionsType.Text,

      textAlign: "right",
      render: (rowData: string | number) => {
        return rowData ? Number(rowData).toFixed(2).toString() : "0,00";
      },

      realPos: 7,
    },
    {
      key: "shiftBreakingTime",
      title: "Thời gian nghỉ giữa ca (giờ)",
      type: "number",
      width: "250px",
      sortable: true,

      filterable: true,
      filterType: "text",
      filterOptions: CONSTANTS.FilterOptionsType.Text,

      textAlign: "right",
      render: (rowData: string | number) => {
        return rowData ? Number(rowData).toFixed(2).toString() : "0,00";
      },

      realPos: 8,
    },
    {
      key: "shiftStatus",
      title: "Trạng thái",
      type: "boolean",
      width: "200px",
      sortable: false,

      filterable: true,
      filterType: "text",
      filterOptions: CONSTANTS.FilterOptionsType.Text,

      textAlign: "left",
      render: (rowData: string | number) => {
        return rowData === 1 ? "Đang sử dụng" : "Ngừng sử dụng";
      },

      realPos: 9,
    },
    {
      key: "createdBy",
      title: "Người tạo",
      type: "text",
      width: "160px",
      sortable: true,

      filterable: true,
      filterType: "text",
      filterOptions: CONSTANTS.FilterOptionsType.Text,

      textAlign: "left",

      realPos: 10,
    },
    {
      key: "createdDate",
      title: "Ngày tạo",
      type: "date",
      width: "160px",
      sortable: true,

      filterable: true,
      filterType: "date",
      filterOptions: CONSTANTS.FilterOptionsType.Date,

      textAlign: "left",
      render: (rowData: string | number) => {
        const date = new Date(rowData as string);
        return date
          ? date.toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "--";
      },

      realPos: 11,
    },
    {
      key: "modifiedBy",
      title: "Người sửa",
      type: "text",
      width: "160px",
      sortable: true,

      filterable: true,
      filterType: "text",
      filterOptions: CONSTANTS.FilterOptionsType.Text,

      textAlign: "left",
      render: (rowData: string | number) => {
        return rowData ? rowData.toString() : "--";
      },

      realPos: 12,
    },
    {
      key: "modifiedDate",
      title: "Ngày sửa",
      type: "date",
      width: "160px",
      sortable: true,

      filterable: true,
      filterType: "date",
      filterOptions: CONSTANTS.FilterOptionsType.Date,

      textAlign: "left",
      render: (rowData: string | number) => {
        const date = new Date(rowData as string);
        return date
          ? date.toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "--";
      },

      realPos: 13,
    },
  ]);

  return {
    sidebarCollapsed,
    sidebarItems,
    toggleSidebar,
    tableHeaders,
  };
});
