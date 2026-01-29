<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  ref,
  Transition,
  defineProps,
  defineModel,
} from "vue";

/**
 * BaseCombobox Component - Dropdown/Combobox tái sử dụng
 * Hỗ trợ filter theo date, text, và hiển thị status
 * Tự động tính toán vị trí dropdown để tránh tràn màn hình
 * Created By hanv 20/01/2026
 */
interface ComboboxProps {
  comboboxItems: Array<any>;
  textDisplay: string;
}
const modelValue = defineModel<string | number>({ required: true });
const props = defineProps<ComboboxProps>();

const isOpenCombobox = ref(false);
const styleComboboxItems = ref({
  top: "0px",
  left: "0px",
  minWidth: "80px",
  maxWidth: "80px",
});

/**
 * Mở/đóng dropdown và tính toán vị trí tránh tràn màn hình
 * @param {Event} e - Click event
 * Created By hanv 20/01/2026
 */
function openCombobox(e: Event) {
  if (!e?.currentTarget) return;

  isOpenCombobox.value = !isOpenCombobox.value;

  const rect = e.currentTarget.getBoundingClientRect();

  const MARGIN = 8;
  const GAP = 8;
  const POPUP_HEIGHT = 140;

  // Tính vị trí
  let top = rect.bottom + GAP;
  let left = rect.left;

  // Không tràn đáy
  if (top + POPUP_HEIGHT > window.innerHeight) {
    top = rect.top - POPUP_HEIGHT - GAP;
  }

  // Không tràn trên
  top = Math.max(top, MARGIN);

  styleComboboxItems.value = {
    top: `${top}px`,
    left: `${left}px`,
    minWidth: `${rect.width}px`,
    maxWidth: `${rect.width}px`,
  };
}

/**
 * Đóng dropdown khi click bên ngoài
 * @param {Event} event - Click event
 * Created By hanv 20/01/2026
 */
function onClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement | null;
  if (!target) return;

  const comboboxElement = target.closest(".ms-combobox");
  const dropdownElement = target.closest(".combo-dropdown-panel");

  if (!comboboxElement && !dropdownElement) {
    isOpenCombobox.value = false;
  }
}

/**
 * Xử lý thay đổi giá trị combobox
 * @param {Number} value - Giá trị được chọn
 * Created By hanv 20/01/2026
 */
function handleChange(value: number) {
  modelValue.value = value;
  isOpenCombobox.value = false;
}

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});
</script>

<template>
  <div>
    <div
      v-tooltip="props.textDisplay"
      class="ms-combobox ms-editor ms-validate flex items-center gap-4 border-color-list"
      @click="openCombobox"
    >
      <div class="flex flex-1">
        <div class="flex-row combo-box-input input-container flex-1 border">
          <input type="input flex" readonly :value="props.textDisplay" />
          <div class="editor-icon-container">
            <div
              :class="[
                'icon16 angle-down icon-combo--dropdown-arrow',
                isOpenCombobox ? 'expand' : '',
              ]"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <Transition name="fade">
      <div
        v-show="isOpenCombobox"
        :style="styleComboboxItems"
        class="combo-dropdown-panel"
      >
        <div class="dropdown-body-container" style="max-height: 140px">
          <ul class="dropdown-items">
            <div v-for="(item, index) in props.comboboxItems" :key="index">
              <li
                :class="[
                  'combobox-item',
                  'single',
                  'ms-combobox-item--highlight',
                  {
                    checked: item.value === modelValue,
                  },
                ]"
                @click="handleChange(item.value)"
              >
                <div class="combobox-item-con view-text">
                  <div class="combobox-item--text" v-tooltip="item.text">
                    <div class="combobox-item--text">
                      {{ item.text }}
                    </div>
                  </div>
                </div>
                <div
                  v-show="item.value === modelValue"
                  class="select-checked select-checked-not-col"
                ></div>
              </li>
              <div v-if="item.isHasMenuBorder" class="menu-border"></div>
            </div>
          </ul>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.combobox-item {
  cursor: pointer;
  height: 28px;
  line-height: 28px;
  white-space: nowrap;
  border-radius: 2px;
  padding: 12px;
}
.combobox-item {
  position: relative;
}
.combobox-item.single {
  display: flex;
  align-items: center;
}
.combobox-item.checked {
  color: #009b71;
  background-color: #d0fbe7;
}
.combobox-item .combobox-item-con {
  display: flex;
  flex: 1;
  width: 100%;
}
.combobox-item .view-text {
  width: calc(100% - 16px);
}
.combobox-item .combobox-item--text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
}
.combobox-item .combobox-item--text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
}
.combobox-item.checked .select-checked {
  display: block;
}
.ms-combobox {
  width: 100%;
  background-color: transparent;
}
.ms-combobox .border {
  background: #fff;
}
.ms-combobox input {
  border: 0;
  text-overflow: ellipsis;
  height: 16px;
  outline: none;
  font-family: Inter;
  padding: 0;
  flex: 1;
  width: 100%;
  text-align: left;
}
.ms-editor .border {
  border: 1px solid #d1d5db;
  border-radius: 4px;
}
.ms-editor .input-container {
  background-color: #fff;
  padding: 5px 8px 5px 12px;
  column-gap: 0px;
}
.editor-icon-container {
  cursor: pointer;
  position: relative;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon16.angle-down {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  background-color: #4b5563;
  mask-position: -202px -18px;
}
.icon-combo--dropdown-arrow {
  transition: all 0.2s ease;
}
.icon-combo--dropdown-arrow.expand {
  transform: rotate(-180deg);
}
.combobox-item.single {
  display: flex;
  align-items: center;
}

.combobox-item.single:not(.checked):hover {
  background-color: #f3f4f6;
}

.menu-border {
  position: relative;
  display: flex;
  margin: 8px 12px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  height: 1px;
  background: #d1d5db;
}
</style>
