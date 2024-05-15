import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'

const Verifyotp = () => {

    const navigate = useNavigate();

    const [timeLeft, setTimeLeft] = useState(90);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (timeLeft > 0) {
                setTimeLeft((prevTime) => prevTime - 1);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);


    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { otp: '' }
    });

    const onsubmit = (data) => {
        console.log("reg");
        console.log(data);

        console.log(data.otp);


        const userenterotp = data.otp;
        const chekotp = sessionStorage.getItem('otp');
        console.log(chekotp);

        if (userenterotp == chekotp) {
            console.log("otp is match");
            navigate('/forget');
        }
        else {
            console.log("otp is not match");
        }

    };
    const resetTimer = () => {
        setTimeLeft(90);
    };

    const resend = (event) => {
        console.log("resend");

        let emailotp = localStorage.getItem('emailotp');

        axios.post('http://localhost:8080/sendotp', {
            email: emailotp,

        }).then((res) => {

            console.log("success", res.data.otp);
            let otp = res.data.otp;
            let otpemail = emailotp;
            sessionStorage.setItem('otp', otp);
            sessionStorage.setItem('otpemail', otpemail);
            console.log("success")


            event.preventDefault();
            toast.success("otp sent ");
            resetTimer();


        }).catch((error) => {
            console.log("error", error, "this is actch");
            event.preventDefault();
            toast.error("Please enter correct email");


        });

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

                                        <form onSubmit={handleSubmit(onsubmit)}>
                                            <div className="mb-3">
                                                <label htmlFor="exampleInputEmail1" className="form-label">
                                                    Enter the otp
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="exampleInputEmail1"
                                                    aria-describedby="emailHelp"
                                                    {...register('otp')}
                                                />

                                            </div>

                                            <button type="submit" className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2">
                                                Submit
                                            </button>

                                        </form>

                                        <center><p>Time left: {timeLeft} seconds</p><div class="text-sm text-slate-500 mt-4">Didn't receive code? <a class="font-medium text-indigo-500 hover:text-indigo-600" onClick={resend} style={{ cursor: 'pointer' }}>Resend</a></div></center>
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

export default Verifyotp