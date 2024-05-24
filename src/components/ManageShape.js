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
import * as yup from 'yup';

// Validation schema
const shapeSchema = yup.object().shape({
  shape_name: yup.string().required('Shape name is required'),
});

const ManageShape = ({ onClose, initialValue, mode }) => {
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm({
    resolver: yupResolver(shapeSchema),
    defaultValues: { shape_name: initialValue ? initialValue.shape_name : '' }
  });

  useEffect(() => {
    if (initialValue) {
      reset({ shape_name: initialValue.shape_name });
    }
  }, [initialValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (mode === "edit") {
        const response = await axios.put('http://localhost:8080/updateshape', { shape_id: initialValue.shape_id, ...data });
        toast.success('Shape updated successfully!');
      } else {
        const response = await axios.post('http://localhost:8080/addshape', data);
        toast.success('Shape added successfully!');
      }
      reset();
      onClose();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
        setError('shape_name', {
          type: 'server',
          message: error.response.data.message
        });
      } else {
        toast.error('Error adding/updating shape. Please check your network connection.');
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-4">{mode === "edit" ? "Edit Shape" : "Add Shape"}</h5>
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="shape_name" className="form-label">Shape</label>
                    <input
                      type="text"
                      className={`form-control ${errors.shape_name && 'is-invalid'}`}
                      id="shape_name"
                      name="shape_name"
                      {...register('shape_name')}
                    />
                    {errors.shape_name && (
                      <div className="invalid-feedback">
                        {errors.shape_name.message}
                      </div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ShapeList = () => {
  const [rowData, setRowData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const gridRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);

  useEffect(() => {
    fetchShapes();
  }, []);

  const fetchShapes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/getallshape");
      setRowData(response.data.data);
    } catch (error) {
      toast.error("Error fetching shapes. Please try again.");
    }
  };

  const deleteShape = async (id) => {
    setModalType("delete");
    const shape = rowData.find(shape => shape.shape_id === id);
    setSelectedShape(shape);
    setShowModal(true);
  };

  const editShape = async (id) => {
    const selectedShape = rowData.find(shape => shape.shape_id === id);
    setShowModal(true);
    setModalType("edit");
    setSelectedShape(selectedShape);
  };

  const handleConfirmAction = async () => {
    if (modalType === "delete") {
      try {
        await axios.delete(`http://localhost:8080/deleteshape`, {
          data: { shape_id: selectedShape.shape_id },
        });
        toast.success("Shape deleted successfully!");
      } catch (error) {
        toast.error("Error deleting shape. Please try again.");
      }
    }
    setShowModal(false);
    fetchShapes();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedShape(null);
    fetchShapes();
  };

  const handleSearch = (event) => {
    setFilterText(event.target.value);
    const filteredData = rowData.filter((item) =>
      item.shape_name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    gridRef.current.api.setRowData(filteredData);
  };

  const handleAddShape = () => {
    setShowModal(true);
    setModalType("add");
    setSelectedShape(null);
  };

  const columnDefs = [
    { field: "shape_name", headerName: "Shape", filter: true, flex: 1, editable: true },
    {
      headerName: "Actions",
      cellRenderer: ({ data }) => (
        <div style={{ marginTop: "-2px" }}>
          <button className="btn btn-outline-primary" style={{ marginRight: "10px" }} onClick={() => editShape(data.shape_id)}>Edit</button>
          <button className="btn btn-outline-danger" onClick={() => deleteShape(data.shape_id)}>Delete</button>
        </div>
      ),
      flex: 1,
    },
  ];

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
      <div className="container-fluid d-flex flex-column" style={{ height: "650px", width: "100%" }}>
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            placeholder="Search..."
            value={filterText}
            onChange={handleSearch}
            className="form-control"
          />
          <button className="btn btn-primary" onClick={handleAddShape}>Add Shape</button>
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
            {modalType === "delete" ? "Delete Shape" : modalType === "edit" ? "Edit Shape" : "Add Shape"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "delete" ? (
            <p>Are you sure you want to delete this shape?</p>
          ) : (
            <ManageShape
              onClose={handleCloseModal}
              initialValue={selectedShape}
              mode={modalType === "edit" ? "edit" : "add"}
            />
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

export default ShapeList;
