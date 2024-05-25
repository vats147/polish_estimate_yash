import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useState } from 'react'
import { useAuth } from './Auths';
import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { adduserschema } from '../schema/adduser';
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';

const Adduser = () => {

    const buttonStyle = {
        display: 'inline-block',
        width: '100%',
        height: '43px',
        backgroundColor: '#151111',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '0.8rem',
        fontSize: '0.8rem',
        marginBottom: '2rem',
        transition: '0.3s',
    };

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(adduserschema),
        defaultValues: { name:'', phone:'', address:'' ,email: '', password: '' }
    });


    const onSubmit = (data,event)=>{
        console.log(data);
        
        axios.post('https://polish-estimate-backend.vercel.app/adduser', {
            name:data.name,
            number:data.phone,
            Address:data.address,
            email: data.email,
            password: data.password,
        }).then((res) => {

            console.log("success", res.data[0]);


            event.preventDefault();
            toast.success("user add succesfull ");


        }).catch((error) => {
            console.log("error", error, "this is actch");

            event.preventDefault();
            toast.error("Please enter Valid username and password");

        });
    }


   
    return (

        
        <div className="container-fluid">
            <div className="container-fluid">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title fw-semibold mb-4">Add user</h5>
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            aria-describedby="emailHelp"
                                            name='name'
                                            {...register('name')}
                                        />
                                        {errors.name && (<div id="emailHelp" style={{ color: 'red' }} className="form-text">
                                                    {errors.name.message}
                                                </div>)}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                            Email address
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
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            aria-describedby="emailHelp"
                                            name='phone'
                                            {...register('phone')}
                                        />
                                        {errors.phone && (<div id="emailHelp" style={{ color: 'red' }} className="form-text">
                                                    {errors.phone.message}
                                                </div>)}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            aria-describedby="emailHelp"
                                            name='address'
                                            {...register('address')}
                                        />
                                        {errors.address && (<div id="emailHelp" style={{ color: 'red' }} className="form-text">
                                                    {errors.address.message}
                                                </div>)}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputPassword1" className="form-label">
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

                                    <button type="submit" style={buttonStyle}  className="btn btn-primary">
                                        Submit
                                    </button>
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


                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Adduser