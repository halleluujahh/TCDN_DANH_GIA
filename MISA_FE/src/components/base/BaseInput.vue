<script setup>
import { autoComplete } from "prism-code-editor/autocomplete";
import { CONSTANTS } from "../../commons/constants";
import {
  formatFixed2Number,
  formatTime,
  formatTimeAlwaysValid,
  formatDateInput,
  formatDateInputAlwaysValid,
} from "../../utils/format";
import { onMounted, watch } from "vue";
import BaseCombobox from "./BaseCombobox.vue";

const models = defineModel({
  type: [String, Number],
  default: "",
});

const props = defineProps({
  errorMessage: {
    type: String,
    default: "",
  },
  isValueNegative: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
  autoComplete: {
    type: String,
    default: "off",
  },
  maxLength: {
    type: Number,
    default: null,
  },
  // search, ic-time
  icon: {
    type: String,
    default: "",
  },
  // icon size: icon16, icon20, icon24
  iconSize: {
    type: String,
    default: "icon16",
  },
  // text, float-num, textarea, checkbox, time-picker, date
  type: {
    type: String,
    default: "text",
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 3,
  },
  isPointer: {
    type: Boolean,
    default: true,
  },
  checkItems: {
    type: Array,
    default: () => [],
  },
  action: {
    type: Function,
    default: null,
  },
  indexModalInputFields: {
    type: Number,
    default: null,
  },
  indexFieldItems: {
    type: Number,
    default: null,
  },
});

function handleValidAndCalculateTime(event) {
  if (event === "input") {
    models.value = formatTime(models.value);
  } else if (event === "blur") {
    models.value = formatTimeAlwaysValid(models.value);
  }
  props.action();
}

function handleValidAndCalculateDate(event) {
  if (event === "input") {
    models.value = formatDateInput(models.value);
  } else if (event === "blur") {
    models.value = formatDateInputAlwaysValid(models.value);
  }
}

onMounted(() => {
  if (
    (models.value || models.value === 0) &&
    props.type === CONSTANTS.BASE_INPUT_TYPE.FLOAT_NUM
  ) {
    models.value = formatFixed2Number(models.value);
    if (typeof props.action === "function") {
      props.action();
    }
  }
  if (models.value && props.type === CONSTANTS.BASE_INPUT_TYPE.TIME_PICKER) {
    models.value = formatTime(models.value);
  }
});
</script>

<template>
  <div
    :class="[
      'flex-1',
      'flex',
      'items-center',
      props.type === CONSTANTS.BASE_INPUT_TYPE.CHECKBOX ? 'flex-row' : '',
      props.type === CONSTANTS.BASE_INPUT_TYPE.TEXTAREA
        ? ''
        : 'input-container',
      props.errorMessage ? 'error' : '',
      props.type === CONSTANTS.BASE_INPUT_TYPE.CHECKBOX ? '' : 'border',
      props.isPointer ? 'pointer' : '',
      props.type === CONSTANTS.BASE_INPUT_TYPE.TIME_PICKER ||
      props.type === CONSTANTS.BASE_INPUT_TYPE.DATE
        ? 'ms-container--timepicker flex-row'
        : '',
      props.isDisabled ? 'disabled' : '',
    ]"
    v-tooltip="
      props.type !== CONSTANTS.BASE_INPUT_TYPE.CHECKBOX &&
      (props.errorMessage || models)
    "
  >
    <!-- Input type text -->
    <div
      v-if="type === CONSTANTS.BASE_INPUT_TYPE.TEXT"
      :class="['flex-1', 'flex']"
    >
      <div
        :class="[
          props.iconSize,
          props.icon,
          'icon',
          'left',
          props.icon ? '' : 'd-none',
        ]"
      ></div>
      <input
        type="text"
        :autocomplete="props.autoComplete"
        :maxlength="props.maxLength"
        :placeholder="props.placeholder"
        class="ms-input-item flex w-100"
        v-model="models"
      />
    </div>
    <!-- Input type time-picker -->
    <div
      v-else-if="type === CONSTANTS.BASE_INPUT_TYPE.TIME_PICKER"
      :class="['flex-1', 'flex']"
    >
      <input
        type="text"
        placeholder="HH:MM"
        class="ms-input--timepicker flex"
        v-model="models"
        @input="handleValidAndCalculateTime('input')"
        @blur="handleValidAndCalculateTime('blur')"
      />
      <div
        :class="[props.iconSize, props.icon, props.icon ? '' : 'd-none']"
      ></div>
    </div>
    <!-- Input type float num -->
    <div
      v-else-if="type === CONSTANTS.BASE_INPUT_TYPE.FLOAT_NUM"
      :class="['flex-1', 'flex']"
    >
      <input
        step="1"
        :class="[
          'ms-number-item',
          'w-100',
          props.isValueNegative ? 'color-red' : '',
        ]"
        :disabled="props.isDisabled"
        v-model="models"
      />
    </div>
    <!-- Text Area -->
    <div
      v-else-if="type === CONSTANTS.BASE_INPUT_TYPE.TEXTAREA"
      :class="['flex-1', 'flex', 'w-full']"
    >
      <textarea
        :maxlength="props.maxLength"
        :rows="props.rows"
        :placeholder="props.placeholder"
        :disabled="props.isDisabled"
        class="ms-textarea-item flex w-full outline-none"
        v-model="models"
      ></textarea>
    </div>
    <!-- Input type checkbox -->
    <label
      v-else-if="type === CONSTANTS.BASE_INPUT_TYPE.CHECKBOX"
      class="ms-radio mr-4"
      v-for="(item, index) in props.checkItems"
      :key="index"
      @click="
        props.action(index, props.indexModalInputFields, props.indexFieldItems)
      "
    >
      <input
        type="radio"
        :disabled="props.isDisabled"
        :checked="item.isChecked"
        :tabindex="item.isChecked ? 0 : -1"
        v-model="models"
      />
      <div class="checkmark"></div>
      <div class="flex-column ms-radio-content">
        <div class="ms-radio--text">{{ item.text }}</div>
      </div>
    </label>
    <!-- Input type date -->
    <div
      v-else-if="type === CONSTANTS.BASE_INPUT_TYPE.DATE"
      :class="['flex-1', 'flex']"
    >
      <input
        type="text"
        placeholder="__/__/____"
        class="ms-input--timepicker flex border-none"
        v-model="models"
        @input="handleValidAndCalculateDate('input')"
        @blur="handleValidAndCalculateDate('blur')"
      />
      <div
        :class="[props.iconSize, props.icon, props.icon ? '' : 'd-none']"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.search {
  mask-image: url("/src/assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  background-color: #4b5563;
  mask-position: 0px 0px;
}
.ic-time {
  mask-image: url("/src/assets/icon/pas.ic_time-af72a219.svg");
  mask-repeat: no-repeat;
  background-color: #4b5563;
}
.left {
  margin: 0 8px 0 0;
}
input[type="radio"]:focus-visible ~ .checkmark {
  outline: 1px solid #009b71;
  outline-offset: 3px;
}
</style>
