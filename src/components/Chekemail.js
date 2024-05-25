import React from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom';
import { emailschema } from '../schema/email';
import axios from 'axios'
import { useState } from 'react'
import { useAuth } from './Auths';
import { ToastContainer, toast } from 'react-toastify';


const Chekemail = () => {

    const auth = useAuth();
    const [open, setOpen] = React.useState(false);
    const [erropen, errsetOpen] = React.useState(false);
    const [username, setUsername] = useState('');

    console.log("open", open)

    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(emailschema),
        defaultValues: { email: '' }
    });



    const onSubmit = (data, event) => {
        console.log("reg");
        console.log(data);

        localStorage.setItem('emailotp', data.email);
        axios.post('http://polish-estimate-backend.vercel.app/sendotp', {
            email: data.email,

        }).then((res) => {

            console.log("success", res.data.otp);
            let otp = res.data.otp;
            let otpemail = data.email;
            sessionStorage.setItem('otp', otp);
            sessionStorage.setItem('otpemail', otpemail);
            console.log("success")



            navigate('/otp')


        }).catch((error) => {
            console.log("error", error, "this is actch");
            event.preventDefault();
            toast.error("Please enter correct email");


        });

        // reset();
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

    return (
        <>

            <ToastContainer
                position="top-right"
                autoClose={10000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"

            />

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

                                        <h1>password recovery</h1>

                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="mb-3">
                                                <label htmlFor="exampleInputEmail1" className="form-label">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="exampleInputEmail1"
                                                    aria-describedby="emailHelp"
                                                    {...register('email')}
                                                />
                                                {errors.email && (<div id="emailHelp" style={{ color: 'red' }} className="form-text">
                                                    {errors.email.message}
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

export default Chekemail