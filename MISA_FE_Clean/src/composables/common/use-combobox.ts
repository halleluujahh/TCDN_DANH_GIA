import { CONSTANTS } from "../../constants/common";

/**
 * Lấy text hiển thị cho item dựa vào kiểu filter
 * Dịch status shift, filter date/text sang text hiển thị
 * @param {Object} item - Item object
 * @returns {String} Text hiển thị
 * Created By hanv 20/01/2026
 */
export const getItemDisplayText = (
  typeFilter: string,
  value: number | string,
): string | number => {
  if (value === "" || value === undefined || value === null) return "";
  if (typeFilter === "boolean") {
    return CONSTANTS.STATUS_SHIFT[
      Number(value) as keyof typeof CONSTANTS.STATUS_SHIFT
    ];
  }

  // Filter theo cột date
  if (typeFilter === CONSTANTS.BASE_INPUT_TYPE.DATE) {
    const dateFilterTypes = [
      CONSTANTS.DateFilterColumnType.Different,
      CONSTANTS.DateFilterColumnType.Equal,
      CONSTANTS.DateFilterColumnType.Less,
      CONSTANTS.DateFilterColumnType.LessOrEqual,
      CONSTANTS.DateFilterColumnType.Greater,
      CONSTANTS.DateFilterColumnType.GreaterOrEqual,
      CONSTANTS.DateFilterColumnType.Empty,
      CONSTANTS.DateFilterColumnType.NotEmpty,
    ];

    if (dateFilterTypes.includes(Number(value))) {
      return CONSTANTS.DATE_FILTER_COLUMN_TYPE_TEXT[
        Number(value) as keyof typeof CONSTANTS.DATE_FILTER_COLUMN_TYPE_TEXT
      ];
    }
    return value;
  }

  // Filter theo text
  const textFilterTypes = [
    CONSTANTS.FilterColumnType.Difference,
    CONSTANTS.FilterColumnType.Contains,
    CONSTANTS.FilterColumnType.NotContains,
    CONSTANTS.FilterColumnType.StartsWith,
    CONSTANTS.FilterColumnType.EndsWith,
  ];

  if (textFilterTypes.includes(Number(value))) {
    return CONSTANTS.FILTER_COLUMN_TYPE_TEXT[
      Number(value) as keyof typeof CONSTANTS.FILTER_COLUMN_TYPE_TEXT
    ];
  }

  return value;
};
