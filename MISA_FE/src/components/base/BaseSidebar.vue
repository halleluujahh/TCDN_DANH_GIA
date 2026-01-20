<script setup>
import { cloneDeep } from "lodash";
import { useAppStore } from "../../stores/appStore";
import { ref } from "vue";

/**
 * BaseSidebar Component - Sidebar menu với nested submenu hỗ trợ popup
 * Hỗ trợ menu items với submenu, popup menu ngoài sidebar
 * Tự động quản lý trạng thái mở/đóng menu và positioning popup
 * Created By hanv 20/01/2026
 */

/**
 * @typedef {Object} MenuItem
 * @property {{ url: string, position: { x: number, y: number } }} icon
 * @property {string} title
 * @property {string|null} route
 * @property {SubMenu|null} subMenu
 * @property {boolean} isMenuItemLine
 * @property {boolean} isActive
 * @property {PopupMenuOutside=} popupMenuOutside
 *
 *
 * Popup menu hiển thị ngoài sidebar
 * @typedef {Object} PopupMenuOutside
 * Trạng thái mở / đóng popup
 * @property {boolean} isOpen
 * Style position (top / left / bottom nếu cần)
 * @property {{ top: string, left: string }} style
 * Danh sách nhóm popup menu
 * @property {PopupMenuGroup[]} popupMenuItems
 *
 *
 * Sub menu cấp 1 của menu item
 * @typedef {Object} SubMenu
 * Trạng thái mở / đóng submenu
 * @property {boolean} isOpen
 * Style position (top / left / bottom nếu cần)
 * @property {{ top: string, left: string }} style
 * Danh sách item trong submenu
 * @property {SubMenuItem[]} subMenuItems
 *
 *
 * Item trong submenu
 * @typedef {Object} SubMenuItem
 * Tiêu đề hiển thị
 * @property {string} title
 * Route điều hướng
 * - null nếu item mở popup con
 * @property {string|null} route
 * Popup menu con (cấp 2)
 * @property {PopupMenu=} popupMenu
 *
 *
 * Popup menu (dùng cho submenu item)
 * @typedef {Object} PopupMenu
 * Trạng thái mở / đóng popup
 * @property {boolean} isOpen
 * Route đang được chọn trong popup
 * @property {string|null} popupMenuItemRouter
 * Style position của popup
 * @property {{ top: string, left: string }} style
 * Danh sách nhóm popup menu
 * @property {PopupMenuGroup[]} popupMenuItems
 *
 *
 * Nhóm popup menu
 * @typedef {Object} PopupMenuGroup
 * Tiêu đề nhóm
 * - null nếu không hiển thị header
 * @property {string|null} popupMenuItemsHeader
 * Danh sách item trong nhóm
 * @property {{
 *   title: string,
 *   route: string
 * }[]} popupMenuItemsList
 */
const props = defineProps({
  /**
   * Danh sách menu items
   * @type {Array<MenuItem>}
   */
  menuItems: {
    type: Array,
    required: true,
  },
});
const menuItemsClone = ref(cloneDeep(props.menuItems));

const appStore = useAppStore();

const closeTimer = ref({});
const closeTimersInside = ref({});
const oldIndex = ref(-1);
const oldSubIndex = ref(-1);

const currentItemChoosed = ref({
  index: -1,
  subindex: -1,
  route: null,
});

/**
 * Deactivate tất cả menu items và đóng submenu/popup
 * Created By hanv 20/01/2026
 */
function unactiveAllMenuItems() {
  // Đóng tất cả submenu item khác
  menuItemsClone.value.forEach((item, i) => {
    item.isActive = false;
    if (item.subMenu) {
      item.subMenu.isOpen = false;
    }
    if (item.popupMenuOutside) {
      item.popupMenuOutside.isOpen = false;
    }
  });
}

/**
 * Deactivate tất cả menu items trừ item tại index hiện tại
 * @param {Number} index - Index của menu item cần giữ active
 * Created By hanv 20/01/2026
 */
function unactiveAllMenuItemsExceptCurrent(index) {
  // Đóng tất cả menu item khác trừ cái submenu hiện tại
  menuItemsClone.value.forEach((item, i) => {
    if (i !== index) {
      item.isActive = false;
      if (item.subMenu) {
        item.subMenu.isOpen = false;
      }
    }
  });
}

/**
 * Đóng popup menu trước đó nếu có, cập nhật oldIndex và oldSubIndex
 * @param {Number} index - Index của menu item hiện tại
 * @param {Number} subIndex - Index của submenu item (default: -1)
 * Created By hanv 20/01/2026
 */
function closePopupBefore(index, subIndex = -1) {
  // Đóng popup menu trước nếu có
  if (oldIndex.value >= 1 && oldIndex.value !== index) {
    if (
      menuItemsClone.value[oldIndex.value]?.subMenu?.subMenuItems[
        oldSubIndex.value
      ]?.popupMenu !== undefined
    ) {
      menuItemsClone.value[oldIndex.value].subMenu.subMenuItems[
        oldSubIndex.value
      ].popupMenu.isOpen = false;
    }
    if (menuItemsClone.value[oldIndex.value]?.popupMenuOutside !== undefined) {
      menuItemsClone.value[oldIndex.value].popupMenuOutside.isOpen = false;
    }
    // Đóng submenu nếu sidebar đang thu gọn
    if (
      menuItemsClone.value[oldIndex.value]?.subMenu !== null &&
      menuItemsClone.value[oldIndex.value]?.subMenu !== undefined &&
      appStore.sidebarCollapsed
    ) {
      menuItemsClone.value[oldIndex.value].subMenu.isOpen = false;
    }
  }
  oldIndex.value = index;
  oldSubIndex.value = subIndex;
}

/**
 * Toggle submenu mở/đóng của menu item
 * @param {Number} index - Index của menu item
 * Created By hanv 20/01/2026
 */
function toggleSubMenuItem(index) {
  // Nếu có popupMenuOutside thì không làm gì cả
  if (menuItemsClone.value[index].popupMenuOutside !== undefined) {
    return;
  }

  if (
    menuItemsClone.value[index].subMenu !== undefined &&
    menuItemsClone.value[index].subMenu !== null
  ) {
    menuItemsClone.value[index].subMenu.isOpen =
      !menuItemsClone.value[index].subMenu.isOpen;
  }

  // Đóng tất cả menu item khác trừ cái hiện tại
  unactiveAllMenuItemsExceptCurrent(index);

  menuItemsClone.value[index].isActive = true;
}
function onMouseEnterSubMenu(e, index) {
  // Xóa timer đóng popup menu nếu có
  const key = `${index}`;

  if (closeTimer.value[key]) {
    clearTimeout(closeTimer.value[key]);
  }
  // Nếu không có submenu thì không làm gì cả
  if (
    menuItemsClone.value[index].subMenu === undefined ||
    menuItemsClone.value[index].subMenu === null
  )
    return;

  // Đóng popup menu trước nếu có
  closePopupBefore(index);

  // Mở submenu hiện tại
  menuItemsClone.value[index].subMenu.isOpen = true;

  // Kiểm tra nếu không phải menu-item-admin thì không tính toán vị trí
  if (!e.currentTarget.classList.contains("menu-item-admin")) {
    return;
  }

  // Lấy vị trí của phần tử hiện tại
  const rect = e.currentTarget.getBoundingClientRect();
  // Tính toán vị trí cho popup menu
  const margin = 8;
  const gap = 25;
  const popupHeight = 190;
  // Vị trí top và left ban đầu
  let top = rect.top;
  const left = rect.left + rect.width + gap;
  if (top + popupHeight > window.innerHeight) {
    top = window.innerHeight - popupHeight - margin;
  }
  menuItemsClone.value[index].subMenu.style = {
    top: `${top}px`,
    left: `${left}px`,
  };
}
function onMouseLeaveSubMenu(e, index) {
  // Thiết lập timer đóng outside popup menu
  const key = `${index}`;

  closeTimer.value[key] = setTimeout(() => {
    if (
      menuItemsClone.value[index].subMenu === undefined ||
      menuItemsClone.value[index].subMenu === null
    )
      return;
    menuItemsClone.value[index].subMenu.isOpen = false;
  }, 1000);
}
function onMouseEnterPopupMenuOutside(e, index) {
  // Xóa timer đóng popup menu nếu có
  const key = `${index}`;

  if (closeTimer.value[key]) {
    clearTimeout(closeTimer.value[key]);
  }

  if (menuItemsClone.value[index].popupMenuOutside === undefined) return;

  // Đóng popup menu trước nếu có
  closePopupBefore(index);

  //  Mở popup menu hiện tại
  menuItemsClone.value[index].popupMenuOutside.isOpen = true;

  // Kiểm tra nếu không phải menu-item-admin thì không tính toán vị trí
  if (!e.currentTarget.classList.contains("menu-item-admin")) {
    return;
  }
  // Lấy vị trí của phần tử hiện tại
  const rect = e.currentTarget.getBoundingClientRect();
  // Tính toán vị trí cho popup menu
  const margin = 8;
  const gap = 25;
  const popupHeight = 190;
  // Vị trí top và left ban đầu
  let top = rect.top;
  const left = rect.left + rect.width + gap;
  if (top + popupHeight > window.innerHeight) {
    top = window.innerHeight - popupHeight - margin;
  }
  menuItemsClone.value[index].popupMenuOutside.style = {
    top: `${top}px`,
    left: `${left}px`,
  };
}
function onMouseLeavePopupMenuOutside(e, index) {
  // Thiết lập timer đóng outside popup menu
  const key = `${index}`;

  closeTimer.value[key] = setTimeout(() => {
    if (menuItemsClone.value[index].popupMenuOutside === undefined) return;
    menuItemsClone.value[index].popupMenuOutside.isOpen = false;
  }, 1000);
}
function onMouseEnterPopupMenuInside(e, index, subIndex) {
  // Xóa timer đóng inside popup menu nếu có
  const key = `${index}-${subIndex}`;

  if (closeTimersInside[key]) {
    clearTimeout(closeTimersInside[key]);
  }

  if (
    menuItemsClone.value[index].subMenu.subMenuItems[subIndex].popupMenu ===
    undefined
  )
    return;

  // Đóng popup menu trước nếu có
  closePopupBefore(index, subIndex);

  // Mở popup menu hiện tại
  menuItemsClone.value[index].subMenu.subMenuItems[subIndex].popupMenu.isOpen =
    true;

  // Kiểm tra nếu không phải menu-item-admin thì không tính toán vị trí
  if (!e.currentTarget.classList.contains("menu-item-admin")) {
    return;
  }
  // Lấy vị trí của phần tử hiện tại
  const rect = e.currentTarget.getBoundingClientRect();

  // Tính toán vị trí cho popup menu
  const margin = 8;
  const gap = 25;
  const popupHeight = 190;

  const style = {
    left: `${rect.left + rect.width + gap}px`,
  };

  if (rect.top + popupHeight > window.innerHeight) {
    // dính sát đáy màn hình
    style.bottom = `${margin}px`;
    style.top = "auto";
  } else {
    style.top = `${rect.top}px`;
    style.bottom = "auto";
  }

  menuItemsClone.value[index].subMenu.subMenuItems[subIndex].popupMenu.style =
    style;
}
function onMouseLeavePopupMenuInside(e, index, subIndex) {
  // Thiết lập timer đóng inside popup menu
  const key = `${index}-${subIndex}`;

  closeTimersInside[key] = setTimeout(() => {
    if (
      menuItemsClone.value[index].subMenu.subMenuItems[subIndex].popupMenu ===
      undefined
    )
      return;
    menuItemsClone.value[index].subMenu.subMenuItems[
      subIndex
    ].popupMenu.isOpen = false;
  }, 1000);
}
function isActive(index, subIndex, route) {
  unactiveAllMenuItemsExceptCurrent(index);

  currentItemChoosed.value.index = index;
  currentItemChoosed.value.subindex = subIndex;
  currentItemChoosed.value.route = route;

  // Mở submenu nếu có
  if (
    menuItemsClone.value[index].subMenu !== null &&
    menuItemsClone.value[index].subMenu !== undefined
  ) {
    !appStore.sidebarCollapsed
      ? (menuItemsClone.value[index].subMenu.isOpen = true)
      : (menuItemsClone.value[index].subMenu.isOpen = false);
  }

  // Gán route cho menu item được active
  if (subIndex < 0) {
    menuItemsClone.value[index].isActive = true;
    return;
  }

  menuItemsClone.value[index].subMenu.subMenuItems[
    subIndex
  ].popupMenu.popupMenuItemRouter = route;
}
function toggleCollapse() {
  unactiveAllMenuItems();
  // Thay đổi trạng thái thu gọn sidebar
  appStore.toggleSidebar();
  // Cập nhật lại trạng thái isActive của menu items
  isActive(
    currentItemChoosed.value.index,
    currentItemChoosed.value.subindex,
    currentItemChoosed.value.route,
  );
}
</script>

<template>
  <div class="main-left">
    <div class="container flex-column">
      <div
        :class="[
          'left-container',
          'flex',
          appStore.sidebarCollapsed ? 'collapsed' : '',
        ]"
      >
        <div
          :class="['menu-container', appStore.sidebarCollapsed ? '' : 'w200']"
        >
          <div class="menu-item-wapper">
            <div
              :class="[
                'menu-item-container',
                appStore.sidebarCollapsed ? 'collapsed' : 'w200',
              ]"
            >
              <router-link
                :class="['w-full', 'block']"
                v-for="(item, index) in menuItemsClone"
                :key="index"
                :to="item.route === null ? $route.path : item.route"
                v-tooltip="appStore.sidebarCollapsed ? item.title : ''"
              >
                <div
                  :class="['menu-item-admin', item.isActive ? 'active' : '']"
                  v-on:mouseenter="
                    appStore.sidebarCollapsed &&
                    item.popupMenuOutside === undefined
                      ? onMouseEnterSubMenu($event, index)
                      : onMouseEnterPopupMenuOutside($event, index)
                  "
                  v-on:mouseleave="
                    appStore.sidebarCollapsed &&
                    item.popupMenuOutside === undefined
                      ? onMouseLeaveSubMenu($event, index)
                      : onMouseLeavePopupMenuOutside($event, index)
                  "
                  v-on:click="toggleSubMenuItem(index)"
                >
                  <div class="menu-item-icon">
                    <div
                      :class="[
                        'icon-menu',
                        'icon20',
                        item.isActive ? 'active' : '',
                      ]"
                      :style="{
                        maskImage: `url(${item.icon.url})`,
                        maskPosition: `${item.icon.position.x}px ${item.icon.position.y}px`,
                        maskRepeat: 'no-repeat',
                        backgroundColor: '#4b5563',
                      }"
                    ></div>
                  </div>
                  <div
                    v-if="!appStore.sidebarCollapsed"
                    class="menu-item-title"
                  >
                    {{ item.title }}
                  </div>
                  <div
                    v-if="!appStore.sidebarCollapsed"
                    class="flex flex-end flex-1 pr-8px"
                  >
                    <div
                      v-show="item.popupMenuOutside !== undefined"
                      :class="[
                        'icon-menu',
                        'icon20',
                        'icon-dropdown-right',
                        item.isActive ? 'active' : '',
                      ]"
                    ></div>
                    <div
                      v-show="
                        item.subMenu !== null && item.subMenu.isOpen === false
                      "
                      class="icon-menu icon20 icon-dropdown"
                    ></div>
                    <div
                      v-show="
                        item.subMenu !== null && item.subMenu.isOpen === true
                      "
                      :class="[
                        'icon-menu',
                        'icon20',
                        'icon-dropdown-up',
                        item.subMenu !== null && item.subMenu.isOpen === true
                          ? 'active'
                          : '',
                      ]"
                    ></div>
                  </div>
                </div>
                <!-- ========================= POPUP MENU WHEN COLLAPSED ==================== -->
                <div
                  v-if="
                    item.popupMenuOutside === undefined &&
                    appStore.sidebarCollapsed &&
                    item.subMenu !== null &&
                    item.subMenu.isOpen === true
                  "
                  class="sub-nav"
                  :style="item.subMenu !== undefined && item.subMenu.style"
                  v-on:mouseenter="onMouseEnterSubMenu($event, index)"
                  v-on:mouseleave="onMouseLeaveSubMenu($event, index)"
                >
                  <div class="w-1-2 width-full">
                    <div class="flex flex-column gap-4px sub-nav-col">
                      <router-link
                        :class="[
                          'sub-nav-item',
                          'flex-row',
                          {
                            active: subItem.route === $route.path,
                          },
                        ]"
                        v-for="(subItem, subIndex) in item.subMenu.subMenuItems"
                        :key="subIndex"
                        :to="subItem.route"
                        v-on:click="isActive(index, -1, subItem.route)"
                      >
                        <div class="sub-nav-item__text">
                          {{ subItem.title }}
                        </div>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- ========================= POPUP MENU OUTSIDE ==================== -->
                <div
                  v-if="
                    item.popupMenuOutside !== undefined &&
                    item.popupMenuOutside.isOpen === true
                  "
                  class="sub-nav"
                  :style="
                    item.popupMenuOutside !== undefined &&
                    item.popupMenuOutside.style
                  "
                  v-on:mouseenter="onMouseEnterPopupMenuOutside($event, index)"
                  v-on:mouseleave="onMouseLeavePopupMenuOutside($event, index)"
                >
                  <div
                    class="w-1-2"
                    v-for="(
                      itemPopupMenuOutside, indexItemPopupMenuOutside
                    ) in item.popupMenuOutside.popupMenuItems"
                    :key="indexItemPopupMenuOutside"
                  >
                    <div class="flex flex-column gap-4px sub-nav-col">
                      <div
                        v-if="
                          itemPopupMenuOutside.popupMenuItemsHeader !==
                            undefined &&
                          itemPopupMenuOutside.popupMenuItemsHeader !== null
                        "
                        class="sub-nav-group"
                      >
                        <span class="title-group">{{
                          itemPopupMenuOutside.popupMenuItemsHeader
                        }}</span>
                      </div>
                      <router-link
                        v-for="(
                          itemPopupMenuOutsideInner,
                          indexItemPopupMenuOutsideInner
                        ) in itemPopupMenuOutside.popupMenuItemsList"
                        :key="indexItemPopupMenuOutsideInner"
                        :to="itemPopupMenuOutsideInner.route"
                        v-on:click="
                          isActive(index, -1, itemPopupMenuOutsideInner.route)
                        "
                        :class="[
                          'sub-nav-item',
                          'flex-row',
                          {
                            active:
                              itemPopupMenuOutsideInner.route === $route.path,
                          },
                        ]"
                      >
                        <div class="sub-nav-item__text">
                          {{ itemPopupMenuOutsideInner.title }}
                        </div>
                      </router-link>
                    </div>
                  </div>
                </div>
                <Transition name="popup">
                  <div
                    v-if="
                      item.subMenu !== null &&
                      item.subMenu.isOpen === true &&
                      appStore.sidebarCollapsed === false
                    "
                    class="sub-menu-inside"
                  >
                    <div class="sub-menu-content">
                      <div
                        class="sub-menu-inside-item block w-full"
                        v-for="(subItem, subIndex) in item.subMenu.subMenuItems"
                        :key="subIndex"
                      >
                        <div
                          v-on:mouseenter="
                            onMouseEnterPopupMenuInside($event, index, subIndex)
                          "
                          v-on:mouseleave="
                            onMouseLeavePopupMenuInside($event, index, subIndex)
                          "
                          v-if="subItem.popupMenu !== undefined"
                          :class="[
                            'menu-item-admin',
                            'child',
                            'w-full',
                            'pointer-events-auto',
                            'text-left',
                            {
                              active:
                                subItem.popupMenu.popupMenuItemRouter !==
                                  undefined &&
                                subItem.popupMenu.popupMenuItemRouter !==
                                  null &&
                                $route.path ===
                                  subItem.popupMenu.popupMenuItemRouter,
                            },
                          ]"
                        >
                          <div class="menu-item-title pl-12px">
                            {{ subItem.title }}
                          </div>
                          <div class="flex flex-end flex-1 pr-8px">
                            <div
                              v-show="subItem.popupMenu !== undefined"
                              :class="[
                                'icon-menu',
                                'icon20',
                                'icon-dropdown-right',
                                {
                                  active:
                                    subItem.popupMenu.popupMenuItemRouter !==
                                      undefined &&
                                    subItem.popupMenu.popupMenuItemRouter !==
                                      null &&
                                    $route.path ===
                                      subItem.popupMenu.popupMenuItemRouter,
                                },
                              ]"
                            ></div>
                          </div>
                        </div>
                        <router-link
                          v-on:mouseenter="
                            onMouseEnterPopupMenuInside($event, index, subIndex)
                          "
                          v-on:mouseleave="
                            onMouseLeavePopupMenuInside($event, index, subIndex)
                          "
                          v-if="subItem.popupMenu === undefined"
                          :class="[
                            'menu-item-admin',
                            'child',
                            'w-full',
                            'pointer-events-auto',
                            'text-left',
                            { active: $route.path === subItem.route },
                          ]"
                          :to="subItem.route"
                          v-on:click="isActive(index, -1, subItem.route)"
                        >
                          <div class="menu-item-title pl-12px">
                            {{ subItem.title }}
                          </div>
                          <div class="flex flex-end flex-1 pr-8px">
                            <div
                              v-show="subItem.popupMenu !== undefined"
                              :class="[
                                'icon-menu',
                                'icon20',
                                'icon-dropdown-right',
                                { active: $route.path === subItem.route },
                              ]"
                            ></div>
                          </div>
                        </router-link>
                        <!-- ========================= POPUP MENU INSIDE ==================== -->
                        <div
                          v-if="
                            subItem.popupMenu !== undefined &&
                            subItem.popupMenu.isOpen === true
                          "
                          class="sub-nav"
                          v-on:mouseenter="
                            onMouseEnterPopupMenuInside($event, index, subIndex)
                          "
                          v-on:mouseleave="
                            onMouseLeavePopupMenuInside($event, index, subIndex)
                          "
                          :style="
                            subItem.popupMenu !== undefined &&
                            subItem.popupMenu.style
                          "
                        >
                          <div
                            v-for="(
                              itemPopupMenuInside, popupMenuInsideIndex
                            ) in subItem.popupMenu.popupMenuItems"
                            :key="popupMenuInsideIndex"
                            class="w-1-2 width-full"
                          >
                            <div class="flex flex-column gap-4px sub-nav-col">
                              <div
                                v-if="
                                  itemPopupMenuInside.popupMenuItemsHeader !==
                                    undefined &&
                                  itemPopupMenuInside.popupMenuItemsHeader !==
                                    null
                                "
                                class="sub-nav-group"
                              >
                                <span class="title-group">{{
                                  itemPopupMenuInside.popupMenuItemsHeader
                                }}</span>
                              </div>
                              <router-link
                                v-for="(
                                  itemPopupMenuInsideList,
                                  indexItemPopupMenuInsideList
                                ) in itemPopupMenuInside.popupMenuItemsList"
                                :key="indexItemPopupMenuInsideList"
                                :to="itemPopupMenuInsideList.route"
                                v-on:click="
                                  isActive(
                                    index,
                                    subIndex,
                                    itemPopupMenuInsideList.route,
                                  )
                                "
                                :class="[
                                  'sub-nav-item',
                                  'flex-row',
                                  {
                                    active:
                                      itemPopupMenuInsideList.route ===
                                      $route.path,
                                  },
                                ]"
                              >
                                <div class="sub-nav-item__text">
                                  {{ itemPopupMenuInsideList.title }}
                                </div>
                              </router-link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
                <div
                  v-if="item.isMenuItemLine === true"
                  :class="[
                    'menu-item-line',
                    appStore.sidebarCollapsed ? 'collapsed' : '',
                  ]"
                ></div>
              </router-link>
            </div>
            <div
              :class="[
                'btn-collapse-footer',
                appStore.sidebarCollapsed ? 'collapsed' : '',
              ]"
            >
              <div class="btn-collapse" v-on:click="toggleCollapse">
                <div
                  :class="[
                    appStore.sidebarCollapsed
                      ? 'expanded-icon'
                      : 'collapse-icon',
                    'icon20',
                  ]"
                ></div>
                <div class="ml-8px" v-if="!appStore.sidebarCollapsed">
                  Thu gọn
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-left {
  background: #393a3d;
  transition: width 0.2s;
  z-index: 12;
}
.main-left .container {
  height: 100%;
}
.main-left .container .left-container {
  display: block;
  float: left;
  height: 100%;
  min-height: 712px;
  overflow: hidden;
  background: #111827;
  min-height: calc(100vh - 45px);
}
.main-left .container .left-container.collapsed {
  width: 60px;
}
.main-left .container .left-container .menu-container {
  height: 100%;
  overflow: hidden;
  position: relative;
  color: #fff;
  visibility: visible;
  white-space: nowrap;
  background: #111827;
  min-height: 712px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
}
.main-left .container .left-container .menu-container::-webkit-scrollbar {
  width: 6px;
}
.main-left .container .left-container .menu-container::-webkit-scrollbar-track {
  background: white;
}
.main-left .container .left-container .menu-container::-webkit-scrollbar-thumb {
  background-color: #b8bcc3;
  border-radius: 6px;
}
.main-left
  .container
  .left-container
  .menu-container::-webkit-scrollbar-thumb:hover {
  background-color: #9b9b9b;
}
@media (max-height: 800px) {
  .main-left .container .left-container .menu-container {
    min-height: calc(100vh - 56px);
    display: inline-grid;
  }
}
.main-left .container .left-container .menu-container .menu-item-wapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container {
  display: flex;
  flex-direction: column;
  padding: 12px 12px 0;
  row-gap: 4px;
  overflow-y: overlay;
  flex: 1;
  min-height: 0;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container.collapsed {
  width: 60px;
  overflow: hidden;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-line {
  margin: 10px auto;
  width: 178px;
  border-bottom: 1px solid rgba(209, 213, 219, 0.3);
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-line.collapsed {
  width: 20px !important;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin {
  display: block;
  position: relative;
  padding: 9px 0;
  height: 36px;
  font-size: 13px;
  display: flex;
  align-items: center;
  -moz-column-gap: 8px;
  column-gap: 8px;
  width: 100%;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin:hover {
  cursor: pointer;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin:hover:before {
  content: "";
  background: rgba(156, 163, 175, 0.15);
  height: 36px;
  width: 100%;
  top: 0;
  position: absolute;
  border-radius: 4px;
}
.menu-item-admin.active {
  content: "";
  background: #009b71;
  height: 36px;
  width: 100%;
  top: 0;
  position: absolute;
  border-radius: 4px;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin.active {
  cursor: pointer;
  color: #fff;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin
  .menu-item-icon {
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
  justify-content: center;
  margin-left: 8px;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin
  .icon-menu {
  background-color: #9ca3af !important;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin
  .icon-menu.active {
  background-color: #fff !important;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin:hover
  .icon-menu {
  background-color: #fff !important;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin:hover
  .menu-item-title {
  color: #fff !important;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin
  .icon-dropdown {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -200px -16px;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin
  .icon-dropdown-up {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -180px -16px;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin
  .icon-dropdown-right {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -220px -16px;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin
  .icon-dropdown-right.active {
  background: #fff;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin
  .menu-item-title {
  z-index: 1;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 170px;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin.active
  .menu-item-title {
  color: #fff !important;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .sub-menu-inside {
  margin-left: 18px;
  padding-left: 5px;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .sub-menu-inside
  .sub-menu-content {
  overflow: visible;
  --submenu-duration: 0.2s;
  --submenu-max-height: 144px;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .sub-menu-inside
  .sub-menu-content
  .sub-menu-inside-item {
  margin-top: 4px;
  cursor: default;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .sub-menu-inside
  .sub-menu-content
  .sub-menu-inside-item
  .menu-item-admin {
  display: block;
  position: relative;
  padding: 9px 0;
  height: 36px;
  font-size: 13px;
  display: flex;
  align-items: center;
  -moz-column-gap: 8px;
  column-gap: 8px;
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  text-align: left;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .sub-menu-inside
  .sub-menu-content
  .sub-menu-inside-item
  .menu-item-admin:hover::before {
  content: "";
  background: rgba(156, 163, 175, 0.15);
  height: 36px;
  width: 100%;
  top: 0;
  position: absolute;
  border-radius: 4px;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .sub-menu-inside
  .sub-menu-content
  .sub-menu-inside-item
  .menu-item-admin.child:hover::before {
  background: rgba(156, 163, 175, 0.15);
  left: -23px;
  width: 113%;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .sub-menu-inside
  .sub-menu-content
  .sub-menu-inside-item
  .menu-item-admin.child:hover::after {
  content: "";
  position: absolute;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  mask-image: url("/src/assets/icon/pas.qtsx_icon-e5768799.svg");
  mask-repeat: no-repeat;
  mask-position: -58px -67px;
  background-color: #fff;
  z-index: 2;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .sub-menu-inside
  .sub-menu-content
  .sub-menu-inside-item
  .menu-item-admin.child {
  border: none;
  background: transparent;
  outline: none;
  text-align: left;
  width: 100%;
  padding: 9px 0;
  display: flex;
  align-items: center;
  -moz-column-gap: 8px;
  column-gap: 8px;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .sub-menu-inside
  .sub-menu-content
  .sub-menu-inside-item
  .menu-item-admin.child.active::before {
  content: "";
  background: #4b5563;
  height: 36px;
  width: 113%;
  top: 0;
  position: absolute;
  left: -23px;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .sub-menu-inside
  .sub-menu-content
  .sub-menu-inside-item
  .menu-item-admin.child.active::after {
  content: "";
  position: absolute;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  mask-image: url("/src/assets/icon/pas.qtsx_icon-e5768799.svg");
  mask-repeat: no-repeat;
  mask-position: -58px -67px;
  background-color: #fff;
  z-index: 2;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .menu-item-admin.child.active
  .icon-dropdown-right {
  background-color: #fff;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .menu-item-container
  .sub-menu-inside
  .sub-menu-content
  .sub-menu-inside-item
  .menu-item-admin
  .menu-item-title {
  z-index: 1;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 170px;
}
.sub-nav {
  display: flex;
  transition: all ease-in 0.3s;
  position: fixed;
  left: 240px;
  background: #111827;
  border: 1px solid #707070;
  border-radius: 4px;
  min-height: max-content;
  padding: 8px;
  -moz-column-gap: 8px;
  column-gap: 8px;
  cursor: default;
  z-index: 999999 !important;
}
.sub-nav::before {
  content: "";
  width: 20px;
  background-color: transparent;
  height: 100%;
  position: absolute;
  left: -20px;
  top: 0;
}
.sub-nav .w-1-2 {
  width: 50%;
}
.sub-nav .w-1-2 .sub-nav-group {
  height: 32px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  position: relative;
}
.sub-nav .w-1-2 .sub-nav-group .title-group {
  color: #4b5563;
  font-weight: 500;
  font-size: 13px;
  width: 100%;
  line-height: 14px;
}
.sub-nav .w-1-2 .sub-nav-item {
  justify-content: flex-start;
  color: #9ca3af;
  position: relative;
  padding: 0 32px;
  height: 32px;
  font-weight: 400;
  font-size: 13px;
  display: flex;
  align-items: center;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  text-align: left;
}
.sub-nav .w-1-2 .sub-nav-item .sub-nav-item__text {
  z-index: 1;
}
.sub-nav .w-1-2 .sub-nav-item.active {
  background: #4b5563;
  border-radius: 4px;
  color: #fff;
  font-weight: 500;
}
.sub-nav .w-1-2 .sub-nav-item.active::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  mask-image: url("/src/assets/icon/pas.qtsx_icon-e5768799.svg");
  mask-repeat: no-repeat;
  mask-position: -58px -67px;
  background-color: #fff;
  z-index: 2;
}
.sub-nav .w-1-2 .sub-nav-item:hover:after {
  content: "";
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  mask-image: url("/src/assets/icon/pas.qtsx_icon-e5768799.svg");
  mask-repeat: no-repeat;
  mask-position: -58px -67px;
  background-color: #fff;
  z-index: 2;
}
.sub-nav .w-1-2 .sub-nav-item:not(.active):hover {
  cursor: pointer;
  color: #fff;
  background: rgba(156, 163, 175, 0.15);
  border-radius: 4px;
}
/* Collapse Button Footer AppSidebar */
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .btn-collapse-footer {
  box-sizing: border-box;
  width: 226px;
  height: 56px;
  padding: 10px;
  display: flex;
  align-items: center;
  background: #111827;
  border-top: 1px solid rgba(209, 213, 219, 0.3);
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .btn-collapse-footer.collapsed {
  width: 60px;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .btn-collapse-footer
  .btn-collapse {
  width: 100%;
  height: 36px;
  border-radius: 4px;
  min-height: 36px;
  background: #111827;
  color: #9ca3af;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 5px;
  cursor: pointer;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .btn-collapse-footer
  .btn-collapse
  .collapse-icon {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -140px -16px;
  background-color: #9ca3af;
}
.main-left
  .container
  .left-container
  .menu-container
  .menu-item-wapper
  .btn-collapse-footer
  .btn-collapse
  .expanded-icon {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -160px -16px;
  background-color: #9ca3af;
}
.sub-nav .w-1-2.width-full {
  width: 100%;
}
</style>
