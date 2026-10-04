export type SignUpFormData = {
  // Screen 1
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Screen 2
  firstName: string;
  lastName: string;
  middleInitial: string;
  gender: string;
  birthday: string;
  course: string;
  section: string;
  // Extra, for the club-registration use case (not part of the base activity)
  club: string;
};

export const initialFormData: SignUpFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  middleInitial: "",
  gender: "",
  birthday: "",
  course: "",
  section: "",
  club: "",
};

// What the server stores and the admin dashboard lists — same shape minus
// the password, plus server-assigned id/timestamp.
export type MemberRecord = Omit<SignUpFormData, "password" | "confirmPassword"> & {
  id: number;
  registeredAt: string;
};
