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
import { PDFDownloadLink } from '@react-pdf/renderer';
import { HiOutlineDownload } from 'react-icons/hi';
import Invoice from './Invoice';

const colorSchema = yup.object().shape({
  color_name: yup.string().required("Color name is required"),
});

const ManageColor = ({ onClose, initialValue, mode }) => {
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm({
    resolver: yupResolver(colorSchema),
    defaultValues: { color_name: initialValue ? initialValue.color_name : '' }
  });

  useEffect(() => {
    if (initialValue) {
      reset({ color_name: initialValue.color_name });
    }
  }, [initialValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (mode === "edit") {
        const response = await axios.put('https://diamonddemo-backend.vercel.app/updatecolor', { orderId: initialValue.orderId, ...data });
        toast.success('Color updated successfully!');
      } else {
        const response = await axios.post('https://diamonddemo-backend.vercel.app/addcolor', data);
        toast.success('Color added successfully!');
      }
      reset();
      onClose();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
        setError('color_name', {
          type: 'server',
          message: error.response.data.message
        });
      } else {
        toast.error('Error adding/updating color. Please check your network connection.');
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
            <h5 className="card-title fw-semibold mb-4">{mode === "edit" ? "Edit Color" : "Add Color"}</h5>
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="color_name" className="form-label">Color</label>
                    <input
                      type="text"
                      className={`form-control ${errors.color_name && 'is-invalid'}`}
                      id="color_name"
                      name="color_name"
                      {...register('color_name')}
                    />
                    {errors.color_name && (
                      <div className="invalid-feedback">
                        {errors.color_name.message}
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

const ColorList = () => {
  const [rowData, setRowData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const gridRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await axios.get("https://diamonddemo-backend.vercel.app/getallorder");
      setRowData(response.data.data);
      console.log(response.data.data)
    } catch (error) {
      toast.error("Error fetching colors. Please try again.");
    }
  };

  const deleteColor = async (id) => {
    try {
      setModalType("delete");
      const color = rowData.find(color => color.orderId === id);
      setSelectedColor(color);
      setShowModal(true);
    } catch (error) {
      toast.error("Error deleting color. Please try again.");
    }
  };

  const editColor = async (id) => {
    try {
      const selectedColor = rowData.find(color => color.orderId === id);
      setShowModal(true);
      setModalType("edit");
      setSelectedColor(selectedColor);
    } catch (error) {
      toast.error("Error editing color. Please try again.");
    }
  };

  const handleConfirmAction = async () => {
    if (modalType === "delete") {
      try {
        await axios.delete(`https://diamonddemo-backend.vercel.app/deletecolor`, {
          data: { orderId: selectedColor.orderId },
        });
        toast.success("Color deleted successfully!");
      } catch (error) {
        toast.error("Error deleting color. Please try again.");
      }
    }
    setShowModal(false);
    fetchColors();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedColor(null);
    fetchColors();
  };
  const handleSearch = (event) => {
    setFilterText(event.target.value);
    const filteredData = rowData.filter((item) =>
        
      item.partyName.toLowerCase().includes(event.target.value.toLowerCase()) ||
      item.brokerName.toLowerCase().includes(event.target.value.toLowerCase()) ||
      
      item.createdDateTime.toLowerCase().includes(event.target.value.toLowerCase())
    );
    gridRef.current.api.setRowData(filteredData);
  };

  const handleAddColor = () => {
    setShowModal(true);
    setModalType("add");
    setSelectedColor(null);
  };

  const columnDefs = [
    { field: "partyName", headerName: "Party Name", filter: true, flex: 1 },
    { field: "brokerName", headerName: "Broker Name", filter: true, flex: 1 },
    { field: "packageWeight", headerName: "Package Weight", filter: true, flex: 1 },
    { field: "createdDateTime", headerName: "Date", filter: true, flex: 1 },
  
    {
      headerName: "Actions",
      cellRenderer: ({ data }) => (
        <div style={{ marginTop: "-2px" }}>
          <button className="btn btn-outline-secondary" style={{ marginRight: "10px" }}>
            {console.log(data.orderId)} 
            <PDFDownloadLink 
              document={<Invoice orderId={data.orderId} rowData={rowData} data={data.orderId} />}
              fileName="invoice.pdf">
              {({ blob, url, loading, error }) => loading ? 'Loading...' : (
                <>
                  <HiOutlineDownload size={14} />
                  <span style={{ marginLeft: '5px' }}>Download</span>
                </>
              )}
            </PDFDownloadLink>
          </button>
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
          
        </div>
        <div className="ag-theme-quartz" style={{ flexGrow: 1 }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            ref={gridRef}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "delete" ? "Delete Color" : modalType === "edit" ? "Edit Color" : "Add Color"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "delete" ? (
            <p>Are you sure you want to delete this color?</p>
          ) : (
            <ManageColor onClose={handleCloseModal} initialValue={selectedColor} mode={modalType} />
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

export default ColorList;
