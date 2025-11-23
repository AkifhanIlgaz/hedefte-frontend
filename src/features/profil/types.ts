export type ExamInfo = {
  exam: string;
  university: string;
  department: string;
  field: Field | string;
};

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
};

export type Field = "Sayısal" | "Eşit Ağırlık";
