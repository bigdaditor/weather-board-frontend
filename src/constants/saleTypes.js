const SALE_TYPES = [
  { value: "card", label: "카드" },
  { value: "cash", label: "현금" },
  { value: "online", label: "온라인" },
  { value: "transfer", label: "이체" },
  { value: "etc", label: "기타" },
];

const SALE_TYPE_LABELS = SALE_TYPES.reduce((acc, type) => {
  acc[type.value] = type.label;
  return acc;
}, {});

const DEFAULT_SALE_TYPE_VALUES = SALE_TYPES.map((type) => type.value);

export { SALE_TYPES, SALE_TYPE_LABELS, DEFAULT_SALE_TYPE_VALUES };
