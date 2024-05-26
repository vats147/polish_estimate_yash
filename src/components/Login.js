import React, { useState } from 'react';
import { useAuth } from './Auths';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginschema } from '../schema/login';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for toastify
import Spinner from 'react-bootstrap/Spinner';   // Import Spinner component

const Login = ({ onClickHandler }) => {
    const auth = useAuth();
    const [open, setOpen] = useState(false);
    const [erropen, errsetOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);  // Loading state

    console.log("open", open);

    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(loginschema),
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = async (data, event) => {
        setLoading(true);  // Set loading to true
        console.log("reg");
        console.log(data);

        try {
            const res = await axios.post('https://polish-estimate-backend.vercel.app/login', {
                email: data.email,
                password: data.password,
            });

            console.log("success", res.data[0]);

            if (res.data[0].role === "Admin" && res.data[0].user_status === "A10") {
                localStorage.setItem('roled', res.data[0].user_status);
                localStorage.setItem('useremail', res.data[0].user_email);
                localStorage.setItem('role', res.data[0].role);
                auth.login(res.data[0]._id);
                console.log("admin");
                setOpen(true);
                onClickHandler();
                navigate('/managecolor');
            } else {
                console.log("success");
                console.log("emp");
                localStorage.setItem('roled', res.data[0].user_status);
                localStorage.setItem('useremail', res.data[0].user_email);
                localStorage.setItem('role', res.data[0].role);
                auth.login(res.data[0]._id);
                onClickHandler();
                navigate('/managecolor');
            }
        } catch (error) {
            console.log("error", error, "this is catch");
            event.preventDefault();
            toast.error("Please enter Valid username and password");
        } finally {
            setLoading(false);  // Set loading to false
        }

        // reset();
    };

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

            <div
                className="page-wrapper"
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
                                            <img
                                                src="../assets/images/logos/dark-logo.svg"
                                                width={180}
                                                alt=""
                                            />
                                        </a>
                                        <p className="text-center">Your Social Campaigns</p>
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
                                                    name='email'
                                                    {...register('email')}
                                                />
                                                {errors.email && (<div id="emailHelp" style={{ color: 'red' }} className="form-text">
                                                    {errors.email.message}
                                                </div>)}
                                            </div>

                                            <div className="mb-4">
                                                <label
                                                    htmlFor="exampleInputPassword1"
                                                    className="form-label"
                                                >
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="exampleInputPassword1"
                                                    name='password'
                                                    {...register('password')}
                                                />
                                                {errors.password && (<div id="emailHelp" style={{ color: 'red' }} className="form-text">
                                                    {errors.password.message}
                                                </div>)}
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between mb-4">
                                                {/* <div className="form-check">
                                                    <input
                                                        className="form-check-input primary"
                                                        type="checkbox"
                                                        defaultValue=""
                                                        id="flexCheckChecked"
                                                        defaultChecked=""
                                                    />
                                                    <label
                                                        className="form-check-label text-dark"
                                                        htmlFor="flexCheckChecked"
                                                    >
                                                        Remember this Device
                                                    </label>
                                                </div> */}
                                                <NavLink to="/email"><a className="text-primary fw-bold" href="">
                                                    Forgot Password?
                                                </a></NavLink>
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2" disabled={loading}>
                                                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Submit"}
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
    );
};

export default Login;
