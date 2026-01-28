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
      maxLength?: number;
      isDisabled?: boolean;
      errorMessage?: string;
      checkItems?: Array<{
        text: string;
        isChecked: boolean;
      }>;
      value: string | number | null;
    }>;
  }>;
}
