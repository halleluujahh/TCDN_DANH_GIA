<script setup></script>

<template>
  <div class="header">
    <div class="nav-item left">
      <div class="nav-item-logo">
        <div class="logo-menu icon24" v-tooltip="'Tất cả ứng dụng'"></div>
        <RouterLink to="/" class="home">
          <div class="logo-item"></div>
          <div class="logo-text">Sản xuất</div>
        </RouterLink>
      </div>
    </div>
    <div class="nav-item right">
      <div class="nav-item-content">
        <div class="item-content nav-item-content-left">
          <div class="name-company-title relative">
            <div class="cursor-pointer flex items-center">
              <span
                class="name-company-title-text mr-1 name-company-truncate"
                v-tooltip="'Công ty cổ phần Misa 234'"
                >Công ty cổ phần Misa 234</span
              >
              <span class="angle-down-small icon16"></span>
            </div>
          </div>
        </div>
        <div class="item-content nav-item-content-right">
          <div class="icon-function-nav mr-[12px]" v-tooltip="'Xuất Excel'">
            <div class="download-status icon24"></div>
          </div>
          <div class="nav-separator"></div>
          <div class="icon-function-nav" v-tooltip="'Tra cứu tồn kho'">
            <div class="ic-package-2 icon24"></div>
          </div>
          <div class="icon-function-nav">
            <div class="ic-controlpanel icon24"></div>
          </div>
          <div class="icon-function-nav" v-tooltip="'Thông báo'">
            <div class="ic-bell icon24"></div>
          </div>
          <div class="icon-function-nav" v-tooltip="'Trợ giúp'">
            <div class="ic-question-circle icon24"></div>
          </div>
          <div class="icon-function-nav" v-tooltip="'Tính năng khác'">
            <div class="dot-circle-horizontal icon24"></div>
          </div>
          <div class="icon-function-nav" v-tooltip="'Kiến thức hữu ích'">
            <div class="ic-knowledge icon24"></div>
          </div>
          <div class="profile-icon w-32px h-32px rounded-full">
            <div class="avatar-account">
              <img
                src="https://amisplatform.misacdn.net/APIS/PlatformAPI/api/Avatar/2cd384a8-3d43-416b-ae40-00d766a611f6/sc57u7la.jpg?avatarID=ab068781-e60e-4aaa-8a35-2e8af29e82b8&amp;width=64&amp;height=64"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  width: 100%;
  height: 48px;
  background-color: #fff;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d1d5db;
  position: relative;
  font-family: Inter !important;
}
.header .nav-item {
  height: 100%;
}
/* Left Navigation Item Header */
.header .left {
  max-width: 200px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  margin-right: 16px;
}
.header .nav-item .nav-item-logo {
  display: flex;
  align-items: center;
}
.header .nav-item .nav-item-logo .logo-menu {
  mask-image: url("/src/assets/icons/pas.sprite_awh-bc818426.svg");
  mask-repeat: no-repeat;
  mask-position: 0px -35px;
  background-color: #4b5563;
  cursor: pointer;
}
.header .nav-item .nav-item-logo .home {
  margin-left: 16px;
  display: flex;
  align-items: center;
  width: 140px;
  cursor: pointer;
}
.header .nav-item .nav-item-logo .home .logo-item {
  background-image: url("/src/assets/icons/ic_production_100px.svg");
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-size: contain;
}
.header .nav-item .nav-item-logo .home .logo-text {
  font-size: 18px;
  margin-left: 12px;
  font-weight: 700;
  color: #262626;
  white-space: nowrap;
}
/* Right Navigation Item Header */
.header .right {
  flex: 1;
  padding: 0 16px 0 20px;
}
.header .nav-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}
/* Right Navigation Item Content Left */
.header .nav-item-content .nav-item-content-left {
  display: flex;
  align-items: center;
}
.header .nav-item-content .nav-item-content-left .name-company-title {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  margin-top: 2px;
}
.header
  .nav-item-content
  .nav-item-content-left
  .name-company-title
  .name-company-truncate {
  max-width: 440px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.header
  .nav-item-content
  .nav-item-content-left
  .name-company-title
  .angle-down-small {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  background-color: #4b5563;
  mask-position: -32px 0px;
}
/* Right Navigation Item Content Right */
.header .nav-item-content .nav-item-content-right {
  display: flex;
  height: 100%;
  align-items: center;
}
.header .nav-item-content .nav-item-content-right .icon-function-nav {
  cursor: pointer;
  position: relative;
}
.header
  .nav-item-content
  .nav-item-content-right
  .icon-function-nav:not(:first-child) {
  margin-left: 12px;
}
.header .nav-item-content .nav-item-content-right .nav-separator {
  width: 1px;
  height: 16px;
  background: #d1d5db;
  align-self: center;
  border-radius: 1px;
}
.header .nav-item-content .nav-item-content-right .download-status {
  mask-image: url("/src/assets/icons/pas.sprite_awh-bc818426.svg");
  mask-repeat: no-repeat;
  background-color: #4b5563;
  mask-position: -744px -36px;
}
.header .nav-item-content .nav-item-content-right .ic-package-2 {
  background: url("/src/assets/icons/pas.ic_package-e7cf3c47.svg") no-repeat;
}
.header .nav-item-content .nav-item-content-right .ic-controlpanel {
  background: url("/src/assets/icons/userpanel.svg");
  width: 32px;
  height: 32px;
  margin-top: 0 !important;
  border-radius: 16px;
  background-position: center;
  background-size: 24px;
  background-repeat: no-repeat;
  cursor: pointer;
}
.header .nav-item-content .nav-item-content-right .ic-bell {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -24px -36px;
  background-color: #4b5563;
}
.header .nav-item-content .nav-item-content-right .ic-question-circle {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -48px -36px;
  background-color: #4b5563;
}
.header .nav-item-content .nav-item-content-right .dot-circle-horizontal {
  mask-image: url("/src/assets/icons/pas.qtsx_icon-e5768799.svg");
  mask-repeat: no-repeat;
  background-color: #4b5563;
  mask-position: -8px -428px;
}
.header .nav-item-content .nav-item-content-right .ic-knowledge {
  background-image: url("/src/assets/icons/knowledge.svg");
  width: 32px;
  height: 32px;
  position: relative;
  border-radius: 16px;
  background-position: center;
  background-size: 24px;
  background-repeat: no-repeat;
  overflow: unset;
  cursor: pointer;
}
.header .nav-item-content .nav-item-content-right .profile-icon {
  margin-left: 16px;
  border: 1px solid #e0e0e0;
  position: relative;
  min-width: 32px;
  min-height: 32px;
}
.header
  .nav-item-content
  .nav-item-content-right
  .profile-icon
  .avatar-account {
  border-radius: 50%;
  cursor: pointer;
  width: 32px;
  height: 32px;
  overflow: hidden;
  border: none;
}
.header
  .nav-item-content
  .nav-item-content-right
  .profile-icon
  .avatar-account
  img {
  width: 100%;
  height: 100%;
  max-width: 32px;
  max-height: 32px;
}
</style>
