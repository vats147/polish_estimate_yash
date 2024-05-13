import React from 'react'
import { ToastContainer, toast } from 'react-toastify';

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
    const notify = (event) =>{
        event.preventDefault();
        toast("Wow so easy !");
    } 
    return (
        <div className="container-fluid">
            <div className="container-fluid">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title fw-semibold mb-4">Add user</h5>
                        <div className="card">
                            <div className="card-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            aria-describedby="emailHelp"
                                        />
                                        <div id="emailHelp" className="form-text">
                                            We'll never share your email with anyone else.
                                        </div>
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
                                        />
                                        <div id="emailHelp" className="form-text">
                                            We'll never share your email with anyone else.
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                            Phone Number
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            aria-describedby="emailHelp"
                                        />
                                        <div id="emailHelp" className="form-text">
                                            We'll never share your email with anyone else.
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                            Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            aria-describedby="emailHelp"
                                        />
                                        <div id="emailHelp" className="form-text">
                                            We'll never share your email with anyone else.
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputPassword1" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="exampleInputPassword1"
                                        />
                                    </div>

                                    <button type="submit" style={buttonStyle} onClick={notify} className="btn btn-primary">
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