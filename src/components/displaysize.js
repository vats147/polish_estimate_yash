  import React, { useState, useEffect, useRef } from "react";
  import { AgGridReact } from "ag-grid-react";
  import "ag-grid-community/styles/ag-grid.css";
  import "ag-grid-community/styles/ag-theme-alpine.css";
  import "ag-grid-community/styles/ag-theme-quartz.css";
  import axios from "axios";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { Modal, Button } from "react-bootstrap";
  import { useForm } from 'react-hook-form';
  import { yupResolver } from '@hookform/resolvers/yup';
  import { sizeSchema as size_name_schema } from '../schema/size';

  const ManageSize = ({ onClose, initialValue, mode }) => {
    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm({
      resolver: yupResolver(size_name_schema),
      defaultValues: { size_name: initialValue ? initialValue.size_name : '' }
    });

    useEffect(() => {
      console.log("ini" + initialValue);
      if (initialValue) {
        reset({ size_name: initialValue.size_name });
      }
    }, [initialValue, reset]);

    const onSubmit = async (data) => {
      try {
        if (mode === "edit") {
          const response = await axios.put('http://polish-estimate-backend.vercel.app/updatesize', { size_id: initialValue.size_id, ...data });
          console.log(response.data);
          toast.success('Size updated successfully!');
        } else {
          const response = await axios.post('http://polish-estimate-backend.vercel.app/addsize', data);
          console.log(response.data);
          toast.success('Size added successfully!');
        }
        reset();
        onClose();
        
      } catch (error) {
        if (error.response) {
          console.error('Server error:', error.response.message);
          toast.error(error.response.data.message);
          setError('size_name', {
            type: 'server',
            message: error.response.data.message
          });
        } else {
          console.error('Error:', error.message);
          toast.error('Error adding/updating size. Please check your network connection.');
        }
      }
      

    };

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
        <ToastContainer />
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-4">{mode === "edit" ? "Edit Size" : "Add Size"}</h5>
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label htmlFor="size_name" className="form-label">Size</label>
                      <input
                        type="text"
                        className={`form-control ${errors.size_name && 'is-invalid'}`}
                        id="size_name"
                        name="size_name"
                        {...register('size_name')}
                      />
                      {errors.size_name && (
                        <div className="invalid-feedback">
                          {errors.size_name.message}
                        </div>
                      )}
                    </div>
                    <button type="submit" style={buttonStyle} className="btn btn-primary">Submit</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const SizeList = () => {
    const [rowData, setRowData] = useState([]);
    const [filterText, setFilterText] = useState("");
    const gridRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
      fetchSizes();
    }, []);

    const fetchSizes = async () => {
      try {
        const response = await axios.get("http://polish-estimate-backend.vercel.app/getallsizes");
        setRowData(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching sizes:", error.message);
        toast.error("Error fetching sizes. Please try again.");
      }
    };

    const deleteSize = async (id) => {
      try {
        setModalType("delete");
        const size = rowData.find(size => size.size_id === id);
        setSelectedSize(size);
        setShowModal(true);
      } catch (error) {
        console.error("Error deleting size:", error.message);
        toast.error("Error deleting size. Please try again.");
      }
    };
    const editSize = async (id, size_name) => {
      try {
        // Find the selected size from rowData using id
        const selectedSize = rowData.find(size => size.size_id === id);
        // Open the modal and pass the selectedSize as initialValue
        setShowModal(true);
        setModalType("edit");
        setSelectedSize(selectedSize);
        
      } catch (error) {
        console.error("Error editing size:", error.message);
        toast.error("Error editing size. Please try again.");
      }
    };
    
   
    const handleConfirmAction = async () => {
      if (modalType === "delete") {
        try {
          await axios.delete(`http://polish-estimate-backend.vercel.app/deletesize`, {
            data: { size_id: selectedSize.size_id },
          });
          console.log("Deleted");
          toast.success("Size deleted successfully!");
          console.log("Deleted");

        } catch (error) {
          console.error("Error deleting size:", error.message);
          toast.error("Error deleting size. Please try again.");
        }
      }
      
      setShowModal(false);
      fetchSizes();
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setModalType(null);
      setSelectedSize(null);
      fetchSizes();

    };

    const handleSearch = (event) => {
      setFilterText(event.target.value);
      const filteredData = rowData.filter((item) =>
        item.size_name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      gridRef.current.api.setRowData(filteredData);
    };

    const handleAddSize = () => {
      setShowModal(true);
      setModalType("add");
      setSelectedSize(null); // Reset selected size
    };

    const columnDefs = [
      { field: "size_name", headerName: "Size", filter: true, flex: 1, editable: true },
      {
        headerName: "Actions",
        cellRenderer: ({ data }) => (
          <div style={{marginTop:"-2px"}}>
            <button className="btn btn-outline-primary" style={{ marginRight: "10px" }} onClick={() => editSize(data.size_id,data.size_name)}>Edit</button>
            <button className="btn btn-outline-danger" onClick={() => deleteSize(data.size_id)}>Delete</button>
          </div>
        ),
        flex: 1,
      },
    ];

    return (
      <>
        <ToastContainer autoClose={3000} onClose={() => toast.dismiss()} />
        <div className="container-fluid d-flex flex-column" style={{ height: "650px", width: "100%" }}>
          <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              placeholder="Search..."
            
              value={filterText}
              onChange={handleSearch}
              className="form-control"
            />
            <button className="btn btn-primary" onClick={handleAddSize}>Add Size</button>
          </div>
          <div className="ag-theme-quartz" style={{ flexGrow: 1 }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              ref={gridRef}
              pagination={true}
              paginationPageSize={10}
              
              onSelectionChanged={() => console.log(gridRef.current.api.getSelectedNodes())}
            />
          </div>
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === "delete" ? "Delete Size" : modalType === "edit" ? "Edit Size" : "Add Size"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType === "delete" ? (
              <p>Are you sure you want to delete this size?</p>
            ) : modalType === "edit" ? (
              <ManageSize
                onClose={handleCloseModal}
                initialValue={selectedSize}
                mode="edit"
              />
            ) : (
              <ManageSize onClose={handleCloseModal} mode="add" />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            {modalType === "delete" && <Button variant="danger" onClick={handleConfirmAction}>Delete</Button>}
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  export default SizeList;
