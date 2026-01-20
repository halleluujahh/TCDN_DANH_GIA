import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "../layouts/AppLayout.vue";

/**
 * Root router configuration mapping application modules to layout and views.
 * @type {import('vue-router').Router}
 */
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '',
                    redirect: "development/dashboard"
                },
                /////////////////////////// Dashboard //////////////////////////
                {
                    path: 'development/dashboard',
                    name: 'Dashboard',
                    props: { title: "Tổng quan" },
                    component: () => import('@/views/development-process/Index.vue')
                },
                ///////////////////////// Sale Order ////////////////////////////
                {
                    path: 'development/sale-order',
                    name: 'SaleOrder',
                    props: { title: "Đơn đặt hàng" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                ///////////////////////// Production Plan Folder //////////////////////////
                {
                    path: 'development/production-plan/overall-plan',
                    name: 'OverallPlan',
                    props: { title: "Kế hoạch tổng thể" },
                    component: () => import('@/views/development-process/Index.vue')
                },
                {
                    path: 'development/production-plan/detailed-plan',
                    name: 'DetailedPlan',
                    props: { title: "Kế hoạch chi tiết" },
                    component: () => import('@/views/development-process/Index.vue')
                },
                {
                    path: 'development/production-plan/materialplan',
                    name: 'MaterialPlan',
                    props: { title: "Kế hoạch nguyên vật liệu" },
                    component: () => import('@/views/development-process/Index.vue')
                },
                {
                    path: 'development/production-plan/materialPurchaseRequest',
                    name: 'MaterialPurchaseRequest',
                    props: { title: "Yêu cầu mua NVL" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                ///////////////////////// Production Execution Folder /////////////////////////
                {
                    path: 'development/production-execution/order',
                    name: 'Order',
                    props: { title: "Lệnh sản xuất" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-execution/schedule',
                    name: 'Schedule',
                    props: { title: "Lịch sản xuất" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-execution/material-request',
                    name: 'MaterialRequest',
                    props: { title: "Yêu cầu xuất vật tư" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-execution/statistics',
                    name: 'Statistics',
                    props: { title: "Thống kê sản xuất" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-execution/product-request',
                    name: 'ProductRequest',
                    props: { title: "Yêu cầu nhập thành phẩm, nguyên vật liệu thừa" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-execution/handover',
                    name: 'Handover',
                    props: { title: "Bàn giao" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-execution/handoverreturn',
                    name: 'HandoverReturn',
                    props: { title: "Trả lại" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-execution/handover-overview',
                    name: 'HandoverOverview',
                    props: { title: "Tình hình bàn giao sản xuất" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                ///////////////////////// Product Quality Folder //////////////////////////
                {
                    path: 'development/product-quality/quality-check-request',
                    name: 'QualityCheckRequest',
                    props: { title: "Yêu cầu kiểm tra" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/product-quality/inspection-voucher',
                    name: 'InspectionVoucher',
                    props: { title: "Phiếu kiểm tra" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/product-quality/criteria',
                    name: 'Criteria',
                    props: { title: "Tiêu chí chất lượng" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/product-quality/criteria-group',
                    name: 'CriteriaGroup',
                    props: { title: "Nhóm tiêu chí chất lượng" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/product-quality/sampling-method',
                    name: 'SamplingMethod',
                    props: { title: "Phương pháp chọn mẫu" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/product-quality/quality-standard',
                    name: 'QualityStandard',
                    props: { title: "Bộ tiêu chuẩn kiểm tra chất lượng" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/product-quality/quality-error',
                    name: 'QualityError',
                    props: { title: "Lỗi kiểm tra chất lượng" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/product-quality/quality-error-group',
                    name: 'QualityErrorGroup',
                    props: { title: "Nhóm lỗi kiểm tra chất lượng" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                ///////////////////////// Production Material Folder //////////////////////////
                {
                    path: 'development/production-material/request-material',
                    name: 'RequestMaterial',
                    props: { title: "Đề nghị kho cấp vật tư" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-material/factory-inward',
                    name: 'FactoryInward',
                    props: { title: "Nhập kho" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-material/export-material',
                    name: 'ExportMaterial',
                    props: { title: "Xuất kho" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-material/transfer-material',
                    name: 'TransferMaterial',
                    props: { title: "Điều chuyển" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-material/opn-inventory-stock',
                    name: 'OpnInventoryStock',
                    props: { title: "Tồn kho đầu kỳ" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                ///////////////////////// Production Work Folder //////////////////////////
                {
                    path: 'development/production-work/work-order',
                    name: 'WorkOrder',
                    props: { title: "Phiếu giao việc công đoạn" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-work/work-order-situation',
                    name: 'WorkOrderSituation',
                    props: { title: "Tình hình giao việc" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                ///////////////////////// Production Traceability Folder //////////////////////////
                {
                    path: 'development/production-traceability',
                    name: 'ProductionTraceability',
                    props: { title: "Truy xuất nguồn gốc" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                ///////////////////////// Reportlist Folder //////////////////////////
                {
                    path: 'development/reportlist',
                    name: 'ReportList',
                    props: { title: "Báo cáo" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                ///////////////////////// Dictionary Folder //////////////////////////
                {
                    path: 'development/dictionary/inventoryitem',
                    name: 'InventoryItem',
                    props: { title: "Vật tư hàng hóa" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/dictionary/inventoryitemgroup',
                    name: 'InventoryItemGroup',
                    props: { title: "Nhóm vật tư hàng hóa" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/dictionary/billOfMaterials',
                    name: 'BillOfMaterials',
                    props: { title: "Định mức nguyên vật liệu" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/dictionary/alternativeMaterialList',
                    name: 'AlternativeMaterialList',
                    props: { title: "Nguyên vật liệu thay thế" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                ///////////////////////// Production Process Folder //////////////////////////
                {
                    path: 'development/production-process/stage',
                    name: 'Stage',
                    props: { title: "Công đoạn" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-process/production-process',
                    name: 'ProductionProcess',
                    props: { title: "Quy trình sản xuất" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                ///////////////////////// Production Capacity Folder //////////////////////////
                {
                    path: 'development/production-capacity/productionTeam',
                    name: 'ProductionTeam',
                    props: { title: "Tổ sản xuất" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-capacity/productionEquipment',
                    name: 'ProductionEquipment',
                    props: { title: "Máy móc" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-capacity/productionCapacityGroup',
                    name: 'ProductionCapacityGroup',
                    props: { title: "Nhóm năng lực" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/production-capacity/productionPattern',
                    name: 'ProductionPattern',
                    props: { title: "Khuôn" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                ///////////////////////// Production Category Folder //////////////////////////
                {
                    path: 'development/dictionary/customer',
                    name: 'Customer',
                    props: { title: "Khách hàng" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/dictionary/employee',
                    name: 'Employee',
                    props: { title: "Nhân viên" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/dictionary/job',
                    name: 'Job',
                    props: { title: "Đối tượng tập hợp chi phí" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/dictionary/shift',
                    name: 'Shift',
                    component: () => import('@/views/production-category/shift/ShiftManagement.vue')
                }
                ,
                {
                    path: 'development/dictionary/holiday-schedule',
                    name: 'HolidaySchedule',
                    props: { title: "Ngày nghỉ" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/dictionary/work-schedule',
                    name: 'WorkSchedule',
                    props: { title: "Lịch làm việc" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/dictionary/organization',
                    name: 'Organization',
                    props: { title: "Cơ cấu tổ chức" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/dictionary/stock',
                    name: 'Stock',
                    props: { title: "Kho" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/dictionary/unit',
                    name: 'Unit',
                    props: { title: "Đơn vị tính" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/dictionary/reason',
                    name: 'Reason',
                    props: { title: "Lý do dừng công việc" },
                    component: () => import('@/views/development-process/Index.vue')
                },
                ///////////////////////// System Folder //////////////////////////
                {
                    path: 'development/system/optionsgeneral',
                    name: 'OptionsGeneral',
                    props: { title: "Thông tin công ty" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/system/user',
                    name: 'User',
                    props: { title: "Người dùng, vai trò" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/system/option-inventoryitem',
                    name: 'OptionInventoryItem',
                    props: { title: "Tùy chọn" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/system/app-connection',
                    name: 'AppConnection',
                    props: { title: "Kết nối ứng dụng" },
                    component: () => import('@/views/development-process/Index.vue')
                }
                ,
                {
                    path: 'development/system/AuditingLog',
                    name: 'AuditingLog',
                    props: { title: "Nhật ký truy cập" },
                    component: () => import('@/views/development-process/Index.vue')
                }
            ]
        },
    ]
})

export default router;