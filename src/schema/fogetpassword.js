import * as Yup from "yup";

export const Forgetpss_schema = Yup.object({

    password: Yup.string().required('Password is required').matches(
        /^[a-zA-Z0-9]{5,9}$/,
        'Invalid password format'
    ),
    confirm_password: Yup.string().required("Confirm Password Necessary").oneOf([Yup.ref('password'), null], "PassWord Must Match"),


})