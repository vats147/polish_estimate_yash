import * as Yup from "yup";

export const shapeSchema = Yup.object({
    shape_name: Yup.string().required('Shape name is required'),
});
