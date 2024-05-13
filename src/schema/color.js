import * as Yup from "yup";

export const colorSchema = Yup.object({
    color_name: Yup.string().required('Color name is required'),
});
