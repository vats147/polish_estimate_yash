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

const gradeSchema = yup.object().shape({
  grade_name: yup.string().required("Grade name is required"),
});

const ManageGrade = ({ onClose, initialValue, mode }) => {
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm({
    resolver: yupResolver(gradeSchema),
    defaultValues: { grade_name: initialValue ? initialValue.grade_name : '' }
  });

  useEffect(() => {
    if (initialValue) {
      reset({ grade_name: initialValue.grade_name });
    }
  }, [initialValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (mode === "edit") {
        const response = await axios.put('https://polish-estimate-backend.vercel.app/updategrade', { grade_id: initialValue.grade_id, ...data });
        toast.success('Grade updated successfully!');
      } else {
        const response = await axios.post('https://polish-estimate-backend.vercel.app/addgrade', data);
        toast.success('Grade added successfully!');
      }
      reset();
      onClose();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
        setError('grade_name', {
          type: 'server',
          message: error.response.data.message
        });
      } else {
        toast.error('Error adding/updating grade. Please check your network connection.');
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
            <h5 className="card-title fw-semibold mb-4">{mode === "edit" ? "Edit Grade" : "Add Grade"}</h5>
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="grade_name" className="form-label">Grade</label>
                    <input
                      type="text"
                      className={`form-control ${errors.grade_name && 'is-invalid'}`}
                      id="grade_name"
                      name="grade_name"
                      {...register('grade_name')}
                    />
                    {errors.grade_name && (
                      <div className="invalid-feedback">
                        {errors.grade_name.message}
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

const GradeList = () => {
  const [rowData, setRowData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const gridRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await axios.get("https://polish-estimate-backend.vercel.app/getallgrade");
      setRowData(response.data.data);
    } catch (error) {
      toast.error("Error fetching grades. Please try again.");
    }
  };

  const deleteGrade = async (id) => {
    try {
      setModalType("delete");
      const grade = rowData.find(grade => grade.grade_id === id);
      setSelectedGrade(grade);
      setShowModal(true);
    } catch (error) {
      toast.error("Error deleting grade. Please try again.");
    }
  };

  const editGrade = async (id) => {
    try {
      const selectedGrade = rowData.find(grade => grade.grade_id === id);
      setShowModal(true);
      setModalType("edit");
      setSelectedGrade(selectedGrade);
    } catch (error) {
      toast.error("Error editing grade. Please try again.");
    }
  };

  const handleConfirmAction = async () => {
    if (modalType === "delete") {
      try {
        await axios.delete(`https://polish-estimate-backend.vercel.app/deletegrade`, {
          data: { grade_id: selectedGrade.grade_id },
        });
        toast.success("Grade deleted successfully!");
      } catch (error) {
        toast.error("Error deleting grade. Please try again.");
      }
    }
    setShowModal(false);
    fetchGrades();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedGrade(null);
    fetchGrades();
  };

  const handleSearch = (event) => {
    setFilterText(event.target.value);
    const filteredData = rowData.filter((item) =>
      item.grade_name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    gridRef.current.api.setRowData(filteredData);
  };

  const handleAddGrade = () => {
    setShowModal(true);
    setModalType("add");
    setSelectedGrade(null);
  };

  const columnDefs = [
    { field: "grade_name", headerName: "Grade", filter: true, flex: 1 },
    {
      headerName: "Actions",
      cellRenderer: ({ data }) => (
        <div style={{ marginTop: "-2px" }}>
          <button className="btn btn-outline-primary" style={{ marginRight: "10px" }} onClick={() => editGrade(data.grade_id)}>Edit</button>
          <button className="btn btn-outline-danger" onClick={() => deleteGrade(data.grade_id)}>Delete</button>
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
          <button className="btn btn-primary" onClick={handleAddGrade}>Add Grade</button>
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
            {modalType === "delete" ? "Delete Grade" : modalType === "edit" ? "Edit Grade" : "Add Grade"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "delete" ? (
            <p>Are you sure you want to delete this grade?</p>
          ) : (
            <ManageGrade onClose={handleCloseModal} initialValue={selectedGrade} mode={modalType} />
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

export default GradeList;
