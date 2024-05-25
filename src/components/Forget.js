import React from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom';
import { Forgetpss_schema } from '../schema/fogetpassword';
import axios from 'axios'
import { useState } from 'react'
import { useAuth } from './Auths';


const Forget = () => {



    const auth = useAuth();
    const [open, setOpen] = React.useState(false);
    const [erropen, errsetOpen] = React.useState(false);
    const [username, setUsername] = useState('');

    console.log("open", open)

    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(Forgetpss_schema),
        defaultValues: { password: '', confirm_password: '' }
    });



    const onSubmit = (data) => {
        console.log("forgetpassword");
        console.log(data);

        let session_email = sessionStorage.getItem('otpemail');

        console.log(session_email, "===");
        if (session_email) {

            axios.post('http://polish-estimate-backend.vercel.app/fogotpassword', {
                email: session_email,
                password: data.password,
                chpassword: data.confirm_password
            }).then((res) => {

                console.log("success", res.data.up.modifiedCount);
                if (res.data.up.modifiedCount > 0) {
                    navigate('/login');
                }
                console.log("success")


            }).catch((error) => {
                console.log("error", error, "this is actch");


            });
        }


        reset();
    };






    const showicon = {
        display: 'flex',
        flexDirection: 'row',
        height: '1rem',
        color: 'red'
    }
    const mar = {
        margin: '0.1rem'
    }


    useEffect(() => {


        if (sessionStorage.getItem('otpemail')) {
            console.log("set email");
        }
        else {
            navigate('/login');
        }
    })




    return (
        <>
            {/*  Body Wrapper */}
            <div
                className="page-wrapper all-bck"
                id="main-wrapper"
                data-layout="vertical"
                data-navbarbg="skin6"
                data-sidebartype="full"
                data-sidebar-position="fixed"
                data-header-position="fixed"
            >
                <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="d-flex align-items-center justify-content-center w-100">
                        <div className="row justify-content-center w-100">
                            <div className="col-md-8 col-lg-6 col-xxl-3">
                                <div className="card mb-0">
                                    <div className="card-body">
                                        <a
                                            href="./index.html"
                                            className="text-nowrap logo-img text-center d-block py-3 w-100"
                                        >
                                            <div className='logo'>
                                                <img
                                                    src="../assets/images/logos/logo.png"
                                                    width={100}
                                                    alt=""
                                                />
                                                <h4>easyQuiz</h4>
                                            </div>
                                        </a>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="mb-3">
                                                <label htmlFor="exampleInputEmail1" className="form-label">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="exampleInputEmail1"
                                                    aria-describedby="emailHelp"
                                                    {...register('password')}
                                                />
                                                {errors.password && (<div id="emailHelp" style={{ color: 'red' }} className="form-text">
                                                    {errors.password.message}
                                                </div>)}
                                            </div>
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="exampleInputPassword1"
                                                    className="form-label"
                                                >
                                                    confirm Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="exampleInputPassword1"
                                                    {...register('confirm_password')}
                                                />
                                               {errors.confirm_password && (<div id="emailHelp" style={{ color: 'red' }} className="form-text">
                                                    {errors.confirm_password.message}
                                                </div>)}
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2">
                                                Submit
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Forget