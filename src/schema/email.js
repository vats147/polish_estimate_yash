import * as Yup from "yup";

export const emailschema = Yup.object({
    email:Yup.string().email().required('email is required').matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Invalid email address')
    .required('Email is required'),
    
})