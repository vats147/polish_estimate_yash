import * as Yup from "yup";

export const loginschema = Yup.object({
    email:Yup.string().email().required('email is required').matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Invalid email address')
    .required('Email is required'),
    password:Yup.string().required('Password is required').matches(/^[a-zA-Z0-9]{5,9}$/,'Invalid password')
})