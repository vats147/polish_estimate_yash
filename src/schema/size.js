import * as Yup from "yup";

export const sizeSchema = Yup.object({
    size_name: Yup.string().required('Size name is required'),
});
