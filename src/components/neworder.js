import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
// import LogoImage from '../../public/assets/images/logos/dark-logo.svg';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ManageOrder = () => {
  const [colorOptions, setColorOptions] = useState([]);
  const [shapeOptions, setShapeOptions] = useState([]);
  
  const [selectedSizes, setSelectedSizes] = useState([]);
const [sizeOptions, setSizeOptions] = useState([]);

  
  const [formData, setFormData] = useState({
    orderId: "",
    partyName: "",
    brokerName: "",
    packageWeight: "",
    sellLimit: "",
    sampleWeight: "",
    colorName: "",
    sizeName: "",
    shapeName: "",
    costPrice: "",
    discount: "",
    finalPrice: "",
    remarks: "",
  });

  
  
  const [sections, setSections] = useState([
    {
      size: "",
      totalAmount: 0,
      rows: [{ grade: "", ct: "", rs: "", amount: "", average: "" }],
    },
  ]);
  const [gradeOptions, setGradeOptions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/getallcolor")
      .then((response) => {
        const options = response.data.data.map((color) => ({
          value: color.color_id,
          label: color.color_name,
        }));
        setColorOptions(options);
        console.log(options);
      })
      .catch((error) => {
        console.error("Error fetching color options:", error);
      });

    axios
      .get("http://localhost:8080/getallshape")
      .then((response) => {
        const options = response.data.data.map((shape) => ({
          value: shape.shape_id,
          label: shape.shape_name,
        }));
        setShapeOptions(options);
        console.log(options);
      })
      .catch((error) => {
        console.error("Error fetching shape options:", error);
      });

    axios
      .get("http://localhost:8080/getallsizes")
      .then((response) => {
        setSizeOptions(
          response.data.data.map((size) => ({
            value: size.size_id,
            label: size.size_name,
          }))
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the sizes!", error);
      });

    //   /getallgrade
    axios
      .get("http://localhost:8080/getallgrade") // Assuming this is the endpoint to fetch grades
      .then((response) => {
        const options = response.data.data.map((grade) => ({
          value: grade.grade_id,
          label: grade.grade_name,
        }));
        setGradeOptions(options);
        console.log(options);
      })
      .catch((error) => {
        console.error("Error fetching grade options:", error);
      });
  }, []);

  const handleSectionChange = (sectionIndex, field, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex][field] = value;
    setSections(updatedSections);
  };

  // Inside the handleRowChange function
    // Inside handleRowChange function

const handleRowChange = (sectionIndex, rowIndex, field, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].rows[rowIndex][field] = value;
    
  
    // Calculate amount and average if CT or RS is changed
    if (field === "ct" || field === "rs") {
      updatedSections[sectionIndex].totalAmount = calculateTotalAmount(updatedSections[sectionIndex]);
      updatedSections[sectionIndex].rows[rowIndex].amount = (
        parseFloat(updatedSections[sectionIndex].rows[rowIndex].ct || 0) *
        parseFloat(updatedSections[sectionIndex].rows[rowIndex].rs || 0)
      ).toFixed(2); // Round to 2 decimal places
      
      updatedSections[sectionIndex].rows[rowIndex].average = (
        updatedSections[sectionIndex].totalAmount / updatedSections[sectionIndex].rows.length
      ).toFixed(2); // Calculate average based on total amount and number of rows
    }
    updatedSections[sectionIndex].totalCT = calculateTotalCT(updatedSections[sectionIndex]);
    setSections(updatedSections);
    
    const grandTotal = calculateGrandTotal(updatedSections);
    updateGrandTotal(grandTotal);
    
    // totalCT
    updateTotalCT(updatedSections[sectionIndex].totalCT);
  };

  // Inside addRow function
const addRow = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].rows.push({
      grade: "", 
      ct: "", 
      rs: "", 
      amount: "", 
      average: "", 
    });
    // Initialize amount and average for the new row
    updatedSections[sectionIndex].totalAmount = calculateTotalAmount(updatedSections[sectionIndex]);
    setSections(updatedSections);
    
  };
  
  const calculateTotalAmount = (section) => {
    let totalAmount = 0;
    for (const row of section.rows) {
        totalAmount += parseFloat(row.ct || 0) * parseFloat(row.rs || 0);
    }
    return totalAmount.toFixed(2);
};

const calculateGrandTotal = (sections) => {
    let grandTotal = 0;
    for (const section of sections) {
        grandTotal += parseFloat(section.totalAmount || 0);
    }
    return grandTotal.toFixed(2);
};

const calculateTotalCT = (section) => {
    let totalCT = 0;
    for (const row of section.rows) {
        totalCT += parseFloat(row.ct || 0);
    }
    return totalCT.toFixed(2);
};

const updateTotalCT = (value) => {
    document.getElementById('cart-ct').value = value;
};

const updateGrandTotal = (value) => {
    document.getElementById('cart-grandtotal').value = value;
};

  
  
// Handler for selecting size// Handler for selecting size
const handleSizeSelect = (selectedOption, index) => {
    const updatedSelectedSizes = [...selectedSizes];
    updatedSelectedSizes[index] = selectedOption;
    setSelectedSizes(updatedSelectedSizes);
  
    // Remove selected size from sizeOptions for the current index
    const updatedSizeOptions = [...sizeOptions];
    updatedSizeOptions[index] = updatedSizeOptions[index].filter(option => option.value !== selectedOption.value);
    setSizeOptions(updatedSizeOptions);
  };

  
  const removeRow = (sectionIndex, rowIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].rows.splice(rowIndex, 1);
    setSections(updatedSections);
    const grandTotal = calculateGrandTotal(updatedSections);
    updateGrandTotal(grandTotal);
    
    // totalCT
    updateTotalCT(updatedSections[sectionIndex].totalCT);


  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        size: "",
        rows: [{ grade: "", ct: "", rs: "", amount: "", average: "" }],
      },
    ]);
  };

  const removeSection = (sectionIndex) => {
    setSections(sections.filter((_, index) => index !== sectionIndex));
  };

  return (
    <div className="container-fluid" style={{ width: "100%" }}>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between bg-transparent">
            <h4 className="mb-sm-0">Create Invoice</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="javascript: void(0);">Invoices</a>
                </li>
                <li className="breadcrumb-item active">Create Invoice</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-xxl-12">
          <div className="card">
            <form className="needs-validation" noValidate="" id="invoice_form">
              <div className="card-body border-bottom border-bottom-dashed p-4">
                <div className="row">
                  <div className="col-lg-4">
                    <div className="profile-user mx-auto  mb-3">
                      <input
                        id="profile-img-file-input"
                        type="file"
                        className="profile-img-file-input"
                      />
                      <label
                        htmlFor="profile-img-file-input"
                        className="d-block"
                        tabIndex={0}
                      >
                        <span
                          className="overflow-hidden border border-dashed d-flex align-items-center justify-content-center rounded"
                          style={{ height: 60, width: 256 }}
                        >
                          <img
                            src="../../assets/images/logos/dark-logo.svg"
                            className="card-logo card-logo-dark user-profile-image img-fluid"
                            alt="logo dark"
                          />
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 ms-auto">
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control bg-light border-0"
                        id="partyName"
                        placeholder="Party Name"
                      />
                      <div className="invalid-feedback">
                        Please enter a PartyName
                      </div>
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control bg-light border-0"
                        id="brokerName"
                        placeholder="Broker Name"
                        required=""
                      />
                      <div className="invalid-feedback">
                        Please enter a valid BrokerName, Ex., example@gamil.com
                      </div>
                    </div>
                    <div className="mb-2">
                      <input
                        type="number"
                        className="form-control bg-light border-0"
                        id="packageWeight"
                        placeholder="Package Weight"
                        required=""
                      />
                      <div className="invalid-feedback">
                        Please enter a packageWeight, Ex., 10.05
                      </div>
                    </div>
                    <div className="mb-2">
                      <input
                        type="number"
                        className="form-control bg-light border-0"
                        id="sellLimit"
                        placeholder="Sell Limit"
                        required=""
                      />
                      <div className="invalid-feedback">
                        Please enter a Sell Limit
                      </div>
                    </div>
                    <div>
                      <input
                        type="number"
                        className="form-control bg-light border-0"
                        id="discount"
                        placeholder="Discount (%)"
                        required=""
                      />
                      <div className="invalid-feedback">
                        Please enter a Discount
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body p-4  border-bottom border-bottom-dashed">
                <div className="row g-3">
                  <div className="col-lg-3 col-sm-6">
                    <label htmlFor="invoicenoInput">Invoice No</label>
                    <input
                      type="text"
                      className="form-control bg-light border-0"
                      id="invoicenoInput"
                      placeholder="Invoice No"
                      defaultValue="#VL25000355"
                      readOnly="readonly"
                    />
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <label htmlFor="choices-payment-status">Color</label>
                    <div className="input-light">
                      <div
                        className="choices"
                        data-type="select-one"
                        tabIndex={0}
                        role="listbox"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <div className="choices__inner">
                          <select
                            className="form-control bg-light border-0 choices__input"
                            data-choices=""
                            data-choices-search-false=""
                            id="choices-payment-status"
                            required=""
                            tabIndex={-1}
                            data-choice="active"
                          >
                            <option value="">Select Color</option>
                            {colorOptions.map((color, index) => (
                              <option key={index} value={color.value}>
                                {color.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <label htmlFor="choices-payment-status">Shape</label>
                    <div className="input-light">
                      <div
                        className="choices"
                        data-type="select-one"
                        tabIndex={0}
                        role="listbox"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <div className="choices__inner">
                          <select
                            className="form-control bg-light border-0 choices__input"
                            data-choices=""
                            data-choices-search-false=""
                            id="choices-payment-status"
                            required=""
                            tabIndex={-1}
                            data-choice="active"
                          >
                            <option value="">Select Shape</option>
                            {shapeOptions.map((shape, index) => (
                              <option key={index} value={shape.value}>
                                {shape.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <label htmlFor="invoicedateInput">Invoice Date</label>
                    <input
                      type="date"
                      className="form-control bg-light border-0"
                      id="invoicedateInput"
                      data-provider="flatpickr"
                      data-date-format="d M, Y"
                      required=""
                      defaultValue="2023-12-14"
                    />
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <label htmlFor="duedateInput">Due Date</label>
                    <input
                      type="date"
                      className="form-control bg-light border-0"
                      id="duedateInput"
                      data-provider="flatpickr"
                      data-date-format="d M, Y"
                      required=""
                      defaultValue="2023-12-14"
                    />
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <label htmlFor="size">Size</label>
                    <div className="input-light">
                      <Select
                        options={sizeOptions}
                        
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            sizeName: selectedOption
                              ? selectedOption.value
                              : "",
                          })
                        }
                        className="bg-light"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <label htmlFor="costPrice">Cost Price</label>
                    <input
                      type="number"
                      className="form-control bg-light border-0"
                      id="costPrice"
                      placeholder="Cost Price"
                      value={formData.costPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, costPrice: e.target.value })
                      }
                      required=""
                    />
                    <div className="invalid-feedback">
                      Please enter Cost Price
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <label htmlFor="finalPrice">Final Price</label>
                    <input
                      type="number"
                      className="form-control bg-light border-0"
                      id="finalPrice"
                      placeholder="Final Price"
                      value={formData.finalPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, finalPrice: e.target.value })
                      }
                      required=""
                    />
                    <div className="invalid-feedback">
                      Please enter Final Price
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body p-4 border-bottom border-bottom-dashed">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-borderless table-centered mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Size</th>
                            <th>Grade</th>
                            <th>CT</th>
                            <th>RS</th>
                            <th>Amount</th>
                            <th>Average</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody >
  {sections.map((section, sectionIndex) => (
    <React.Fragment key={sectionIndex}>
      <tr>
        {/* Size column with rowspan */}
        { (
          <td >
            <Select
              options={sizeOptions}
              onChange={(selectedOption) =>
                handleSectionChange(
                  sectionIndex,
                  "size",
                  selectedOption ? selectedOption.value : ""
                )
              }
              className="bg-light"
              classNamePrefix="select"
              value={
                sizeOptions.find(
                  (option) => option.value === section.size
                ) || ""
              }
            />
          </td>
        )}
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <Button
            variant="danger"
            onClick={() => removeSection(sectionIndex)}
          >
            Remove Section
          </Button>
        </td>
      </tr>
      {section.rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          <td></td>
          <td>
            <Select
              options={gradeOptions}
              onChange={(selectedOption) =>
                handleRowChange(
                  sectionIndex,
                  rowIndex,
                  "grade",
                  selectedOption ? selectedOption.value : ""
                )
              }
              className="bg-light"
              classNamePrefix="select"
              value={
                gradeOptions.find(
                  (option) => option.value === row.grade
                ) || ""
              }
            />
          </td>
          <td>
            <input
              type="number"
              className="form-control bg-light border-0"
              placeholder="CT"
              min={0}
              value={row.ct}
              onChange={(e) =>
                handleRowChange(
                  sectionIndex,
                  rowIndex,
                  "ct",
                  e.target.value
                )
              }
              required=""
            />
          </td>
          <td>
            <input
              type="number"
              className="form-control bg-light border-0"
              placeholder="RS"
              value={row.rs}
              onChange={(e) =>
                handleRowChange(
                  sectionIndex,
                  rowIndex,
                  "rs",
                  e.target.value
                )
              }
              required=""
            />
          </td>
          <td>
            <input
              type="number"
              className="form-control bg-light border-0"
              placeholder="Amount"
              value={row.amount}
              onChange={(e) =>
                handleRowChange(
                  sectionIndex,
                  rowIndex,
                  "amount",
                  e.target.value
                )
              }
              readOnly
            />
          </td>
          <td>
            <input
              type="number"
              className="form-control bg-light border-0"
              placeholder="Average"
              value={row.average}
              readOnly
            />
          </td>
          <td>
            <Button
              variant="danger"
              onClick={() =>
                removeRow(sectionIndex, rowIndex)
              }
            >
              Remove Row
            </Button>
          </td>
        </tr>
      ))}
      <tr>
        <td colSpan="7" className="border-bottom border-bottom-dashed">
          <Button
            variant="success"
            onClick={() => addRow(sectionIndex)}
          >
            Add Row
          </Button>
        </td>
      </tr>
    </React.Fragment>
  ))}
  <tr>
    <td colSpan="7">
      <Button variant="primary" onClick={addSection}>
        Add Section
      </Button>
    </td>
  </tr>
</tbody>

                        <tbody>
                          <tr className="border-top border-top-dashed mt-2">
                            <th scope="row">Grand Total</th>
                            <td style={{ width: 150 }}>
                              <input
                                type="text"
                                className="form-control bg-light border-0"
                                id="cart-grandtotal"
                                placeholder="0.00"
                                readOnly="readOnly"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">Total CT </th>
                            <td>
                              <input
                                type="text"
                                className="form-control bg-light border-0"
                                id="cart-ct"
                                placeholder="0.00"
                                readOnly="readOnly"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              Cost Price{" "}
                              <small className="text-muted">(VELZON15)</small>
                            </th>
                            <td>
                              <input
                                type="text"
                                className="form-control bg-light border-0"
                                id="cart-costprice"
                                placeholder="0.00"
                                readOnly="readOnly"
                              />
                            </td>
                          </tr>
                          {/* <tr>
                            <th scope="row">Shipping Charge</th>
                            <td>
                              <input
                                type="text"
                                className="form-control bg-light border-0"
                                id="cart-shipping"
                                placeholder="0.00"
                                readOnly=""
                              />
                            </td>
                          </tr> */}
                          <tr className="border-top border-top-dashed">
                            <th scope="row">Final Price </th>
                            <td>
                              <input
                                type="text"
                                className="form-control bg-light border-0"
                                id="cart-finalprice"
                                placeholder="0.00"
                                readOnly="readOnly"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body p-4">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-2">
                      <textarea
                        className="form-control bg-light border-0"
                        id="remarks"
                        placeholder="Remarks"
                        value={formData.remarks}
                        onChange={(e) =>
                          setFormData({ ...formData, remarks: e.target.value })
                        }
                      />
                      <div className="invalid-feedback">
                        Please enter a remark.
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 text-end">
                    <Button variant="primary" type="submit">
                      Save Invoice
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ManageOrder;
