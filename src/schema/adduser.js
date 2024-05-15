import * as Yup from "yup";

export const adduserschema = Yup.object({
    name:Yup.string().required('name  is required').matches(/^[A-Za-z]+(\s[A-Za-z'-]+)+$/, 'full name sapreat with sapce'),
    email:Yup.string().email().required('email is required').matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Invalid email address'),
    phone:Yup.string().required('phone number  is required').matches(/^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/, 'Invalid phone number'),
    password:Yup.string().required('Password is required').matches(/^[a-zA-Z0-9]{5,9}$/,'Invalid password')
})