import React from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { colorSchema} from '../schema/color'


const Managecolor = () => {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(colorSchema),
        defaultValues: { color_name: '' }
    });
    const onsubmit = (data) => {
        console.log(data);
    }



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

    return (
        <>
            
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title fw-semibold mb-4">Forms</h5>
                            <div className="card">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit(onsubmit)}>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">
                                                color
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="exampleInputEmail1"
                                                aria-describedby="emailHelp"
                                                name='color_name'
                                                {...register('color_name')}
                                            />
                                            {errors.color_name&&(<div id="emailHelp" className="form-text">
                                            {errors.color_name.message}
                                            </div>)}
                                        </div>
                        
                                        <button type="submit" style={buttonStyle} className="btn btn-primary">
                                            Submit
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        
        </>
    )
}

export default Managecolor