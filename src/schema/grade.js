import * as Yup from "yup";

export const gradeSchema = Yup.object({
    grade_name: Yup.string().required('Grade name is required'),
});
