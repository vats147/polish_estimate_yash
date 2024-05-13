import * as Yup from "yup";

export const color_name_schema = Yup.object({
    color_name:Yup.string().required('color is name is required'),
    
})