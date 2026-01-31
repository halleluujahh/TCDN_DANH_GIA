export interface FormData {
  modalInputFields: Array<{
    isFlex: boolean;
    isCheckboxGroup?: boolean;
    formItems: Array<{
      type: string;
      label: string;
      field: string;
      placeholder?: string;
      isRequired: boolean;
      autoComplete?: string;
      icon?: string;
      iconSize?: string | "icon16";
      maxLength?: number;
      isDisabled?: boolean;
      pointer?: boolean;
      errorMessage?: string;
      checkItems?: Array<{
        text: string;
        value: string | number;
        isChecked: boolean;
      }>;
      rows?: number;
      value: string | number | null;

      isHideTooltip?: boolean;

      action?: (value: string | number) => string | number;
    }>;
  }>;
}
