import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import './tbl.css';

const ManageOrder = () => {
  const { register, handleSubmit, setValue, watch, control, getValues } =
    useForm();

  const [colorOptions, setColorOptions] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [shapeOptions, setShapeOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [initialSizeOptions, setInitialSizeOptions] = useState([]);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [msize, setmsize] = useState([]);
  const [rmsize, setrmsize] = useState([]);
  const [sizeOptions1, setsizeOptions1] = useState([]);

  // const sizeOptions1 = ["Small", "Medium", "Large"];

  const [sections, setSections] = useState([
    {
      size: "",
      totalAmount: 0,
      totalCT: 0,
      rows: [{ grade: "", ct: "", rs: "", amount: "", average: "" }],
      selectedGrades: [], // Track selected grades for each section
    },
  ]);
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

  useEffect(() => {
    // Fetch data for size and grade options
    axios
      .get("http://localhost:8080/getallsizes")
      .then((response) => {
        const sizes = response.data.data.map((size) => ({
          value: size.size_id,
          label: size.size_name,
        }));
        const sizes1 = response.data.data.map((size) => ({
          value: size.size_name,
          label: size.size_name,
        }));

        setSizeOptions(sizes);
        setInitialSizeOptions(sizes);
        setsizeOptions1(sizes1); 
        // Store initial size options
      })
      .catch((error) => {
        console.error("There was an error fetching the sizes!", error);
      });

    axios
      .get("http://localhost:8080/getallgrade")
      .then((response) => {
        const options = response.data.data.map((grade) => ({
          value: grade.grade_name,
          label: grade.grade_name,
        }));

        setGradeOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching grade options:", error);
      });

    // Fetch data for color options
    axios
      .get("http://localhost:8080/getallcolor")
      .then((response) => {
        const colors = response.data.data.map((color) => ({
          value: color.color_id,
          label: color.color_name,
        }));
        setColorOptions(colors);
      })
      .catch((error) => {
        console.error("There was an error fetching the colors!", error);
      });

    // Fetch data for shape options
    axios
      .get("http://localhost:8080/getallshape")
      .then((response) => {
        const shapes = response.data.data.map((shape) => ({
          value: shape.shape_id,
          label: shape.shape_name,
        }));
        setShapeOptions(shapes);
      })
      .catch((error) => {
        console.error("There was an error fetching the shapes!", error);
      });
  }, []);

  const handleSectionChange = (sectionIndex, field, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex][field] = value;
    setSections(updatedSections);
  };

  const handleRowChange = (sectionIndex, rowIndex, field, value) => {
    const updatedSections = [...sections];
    const currentSection = updatedSections[sectionIndex];
    const currentRow = currentSection.rows[rowIndex];

    if (field === "grade") {
      const prevGrade = currentRow.grade;
      if (prevGrade) {
        currentSection.selectedGrades = currentSection.selectedGrades.filter(
          (g) => g !== prevGrade
        );
      }
      if (value) {
        currentSection.selectedGrades.push(value);
      }
    }

    currentRow[field] = value;

    if (field === "ct" || field === "rs") {
      currentRow.amount = (
        parseFloat(currentRow.ct || 0) * parseFloat(currentRow.rs || 0)
      ).toFixed(2);
      currentSection.totalAmount = calculateTotalAmount(currentSection);

      console.log("==", currentSection);
      console.log("CT", calculateTotalCT(currentSection));
      console.log("Total Amount", currentSection.totalAmount);

      const totalCT = calculateTotalCT(currentSection);
      console.log("CT CT", totalCT);
      currentRow.average = (
        parseFloat(currentSection.totalAmount) / totalCT
      ).toFixed(2);

      setValue(
        `sections[${sectionIndex}].rows[${rowIndex}].amount`,
        currentRow.amount
      );
      console.log(
        `sections[${sectionIndex}].rows[${rowIndex}].average`,
        currentRow.average
      );
      setValue(`sections[${sectionIndex}].rows[0].average`, currentRow.average);
    }

    currentSection.totalCT = calculateTotalCT(currentSection);
    setSections(updatedSections);

    const grandTotal = calculateGrandTotal(updatedSections);
    updateGrandTotal(grandTotal);
    updateTotalCT(currentSection.totalCT);
  };

  const addRow = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].rows.push({
      grade: "",
      ct: "",
      rs: "",
      amount: "",
      average: "",
    });
    updatedSections[sectionIndex].totalAmount = calculateTotalAmount(
      updatedSections[sectionIndex]
    );
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

  // const calculateTotalCT = () => {
  //   let totalCT = 0;
  //   for (const section of sections) {
  //     if(section.rows.length > 0 )
  //       {

  //         section.rows.forEach((row) => {
  //           totalCT += parseFloat(row.ct || 0);
  //         }
  //         );
  //       }
  // }
  //   return totalCT.toFixed(2);
  // };

  const calculateTotalCT = (section) => {
    let totalCT = 0;
    console.log("fun", section);
    if (section.rows) {
      for (const row of section.rows) {
        if (section.rows.length > 0) {
          console.log("-----", row);
          totalCT += parseFloat(row.ct || 0);
          console.log("infor= ct", totalCT);
        }
      }
    }
    console.log("return= ct", totalCT);
    return totalCT.toFixed(2);
  };

  const updateTotalCT = (value) => {
    console.log("section", sections);

    const totalCT = sections.reduce((sum, section) => sum + parseFloat(section.totalCT), 0);

console.log(`Total CT: ${totalCT}`);

    document.getElementById("cart-ct").value = totalCT;
    setValue("Sample Weight", totalCT);

    let grandtotal=document.getElementById("cart-grandtotal").value? document.getElementById("cart-grandtotal").value: 1;
    document.getElementById('total-avg').value= (parseFloat(grandtotal) / parseFloat(totalCT)).toFixed(2);
    
    setValue("TotalAverage",document.getElementById('total-avg').value)
  };

  const updateGrandTotal = (value) => {
    document.getElementById("cart-grandtotal").value = value;
    setValue("GrandTotal", value);

    let totalct=document.getElementById("cart-ct").value = value? document.getElementById("cart-ct").value = value: 1;
    document.getElementById('total-avg').value= (parseFloat(value) / parseFloat(totalct)).toFixed(2);
    
    setValue("TotalAverage",document.getElementById('total-avg').value)
  };

  let updatedMSize;
  const handleSizeSelect = (selectedOption, sectionIndex) => {
    console.log("handleSizeSelect ", selectedOption, sectionIndex);

    console.log(msize.length);

    // Find the index of the item in msize if it exists
    const msizeIndex = msize.findIndex((size) => size.section === sectionIndex);

    if (msizeIndex !== -1) {
      console.log("okoko");
      // Update the item in msize
      updatedMSize = [...msize];
      updatedMSize[msizeIndex] = {
        value: selectedOption.value,
        label: selectedOption.label,
        section: sectionIndex,
      };
      console.log(updatedMSize);
      setmsize(updatedMSize);
      console.log(updatedMSize);
      setrmsize(updatedMSize);

      const uniqueFromInitialSizeOptions = [];
      initialSizeOptions.forEach((inisize) => {
        // Check if the inisize value exists in updatedMSize
        const existsInUpdated = updatedMSize.some(
          (size) => size.value === inisize.value
        );
        // If the inisize value doesn't exist in updatedMSize, add it to uniqueFromInitialSizeOptions
        if (!existsInUpdated) {
          uniqueFromInitialSizeOptions.push(inisize);
        }
      });

      // Print unique items from initialSizeOptions
      console.log("Unique items from initialSizeOptions:");
      console.log(uniqueFromInitialSizeOptions);
      setSizeOptions(uniqueFromInitialSizeOptions);
    } else {
      // Add the new item to msize
      setmsize([
        ...msize,
        {
          value: selectedOption.value,
          label: selectedOption.label,
          section: sectionIndex,
        },
      ]);

      updatedMSize = [
        ...msize,
        {
          value: selectedOption.value,
          label: selectedOption.label,
          section: sectionIndex,
        },
      ];
      console.log(updatedMSize);

      console.log("mm=", msize);
      const updatedSizeOptions = sizeOptions.filter(
        (option) => option.value !== selectedOption.value
      );
      setSizeOptions(updatedSizeOptions);
      setrmsize(updatedMSize);
    }
  };

  const removeRow = (sectionIndex, rowIndex) => {
    const updatedSections = [...sections];

    // Check if the sectionIndex is valid and the section exists
    if (sectionIndex < 0 || sectionIndex >= updatedSections.length) {
      console.error("Invalid section index:", sectionIndex);
      return;
    }

    const section = updatedSections[sectionIndex];

    // Check if the rowIndex is valid and the rows array exists
    if (!section.rows || rowIndex < 0 || rowIndex >= section.rows.length) {
      console.error("Invalid row index or rows array is undefined:", rowIndex);
      return;
    }

    const removedGrade = section.rows[rowIndex].grade;
    section.rows.splice(rowIndex, 1);

    // Update selectedGrades if a grade was removed
    if (removedGrade) {
      section.selectedGrades = section.selectedGrades.filter(
        (g) => g !== removedGrade
      );
    }

    // Update the section's total amounts
    section.totalAmount = calculateTotalAmount(section);

    section.totalCT = calculateTotalCT(section);
    setSections(updatedSections);

    // Update grand totals
    const grandTotal = calculateGrandTotal(updatedSections);
    updateGrandTotal(grandTotal);

    updateTotalCT(section.totalCT);

    console.log("CT CT", section.totalCT);
    let average = (parseFloat(section.totalAmount) / section.totalCT).toFixed(
      2
    );

    // Update form values
    const sections1 = getValues("sections");

    // Check if sections1 exists and the sectionIndex is valid
    if (!sections1 || sectionIndex < 0 || sectionIndex >= sections1.length) {
      console.error("Invalid sections array or section index:", sectionIndex);
      return;
    }

    const currentSection = sections1[sectionIndex];

    // Check if the rows array exists
    if (!currentSection.rows) {
      console.error(
        "Rows array is undefined in form values for section:",
        sectionIndex
      );
      return;
    }

    currentSection.rows.splice(rowIndex, 1);
    currentSection.totalAmount = calculateTotalAmount(currentSection);

    setValue(`sections[${sectionIndex}].rows`, currentSection.rows);
    setValue(
      `sections[${sectionIndex}].totalAmount`,
      currentSection.totalAmount
    );
    console.log(average);
    setValue(`sections[${sectionIndex}].rows[0].average`, average);
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        size: "",
        totalAmount: 0,
        totalCT: 0,
        rows: [{ grade: "", ct: "", rs: "", amount: "", average: "" }],
        selectedGrades: [],
      },
    ]);
  };
  const removeSection = (sectionIndex) => {
    // Filter out the section to be removed
    const updatedSections = sections.filter(
      (_, index) => index !== sectionIndex
    );
    setSections(updatedSections);

    console.log("upppp", rmsize);
    const updatedMSizesec = (rmsize ?? []).filter(
      (item) => item.section !== sectionIndex
    );
    console.log("====", updatedMSizesec);

    const uniqueFromInitialSizeOptions = [];
    initialSizeOptions.forEach((inisize) => {
      // Check if the inisize value exists in updatedMSizesec
      const existsInUpdated = updatedMSizesec.some(
        (size) => size.value === inisize.value
      );
      // If the inisize value doesn't exist in updatedMSizesec, add it to uniqueFromInitialSizeOptions
      if (!existsInUpdated) {
        uniqueFromInitialSizeOptions.push(inisize);
      }
    });

    // Print unique items from initialSizeOptions
    console.log("Unique items from initialSizeOptions:");
    console.log(uniqueFromInitialSizeOptions);
    setSizeOptions(uniqueFromInitialSizeOptions);

    // Update form values
    const sectionsForm = getValues("sections");

    // Ensure the sectionIndex is within bounds
    if (sectionIndex >= 0 && sectionIndex < sectionsForm.length) {
      sectionsForm.splice(sectionIndex, 1);
      setValue("sections", sectionsForm);
    } else {
      console.error("Invalid section index:", sectionIndex);
      return;
    }

    // Update the remaining sections' total amounts and CT
    updatedSections.forEach((section, index) => {
      section.totalAmount = calculateTotalAmount(section);
      section.totalCT = calculateTotalCT(section);
    });

    setSections(updatedSections);

    // Update grand totals
    const grandTotal = calculateGrandTotal(updatedSections);
    updateGrandTotal(grandTotal);
    const totalCT = calculateTotalCT(updatedSections);
    updateTotalCT(totalCT);
  };

  const onSubmit = (data) => {
    console.log("data", data); // Access the form data here

    let submitdata = transformDataForBackend(data);
    console.log(submitdata);

    axios.post("http://localhost:8080/addorder", submitdata).then((response) => {
        console.log(response);
        if (response.data.success ) {
            toast.success("Invoice added successfully!");
            // wait for 3 second then redirect to the displayorder page
            setTimeout(() => {

                window.location.href = "/displayorder";
            }, 3000);

            // reset the form 
            document.getElementById("invoice_form").reset();
        } else {
            toast.error("Failed to add invoice!");
        }
        }
    ).catch((error) => {
        console.error("Error adding invoice:", error);
        toast.error("Failed to add invoice!");
    }
    );

  };

  const handlePrintFormData = () => {
    console.log("data");
    console.log(watch());
 

   
    let data = watch();
    console.log(data);

    
    
    



  };
  const transformDataForBackend = (frontendData) => {
    // Helper function to check if a value is valid
    const isValidValue = (value) => {
      return value !== undefined && value !== null && value !== "";
    };
  
    // Transform sections and rows
    const transformSections = (sections) => {
      return sections.map(section => ({
        size: section.size || "", // Assuming size ID maps to size name directly
        row: section.rows
          .filter(row => isValidValue(row.grade) && isValidValue(row.ct) && isValidValue(row.rs) && isValidValue(row.amount)) // Filter out rows with missing values
          .map(row => ({
            grade: row.grade || "", // Assuming grade ID maps to grade name directly
            ct: parseFloat(row.ct) || 0, // Default to 0 if value is missing or invalid
            rs: parseFloat(row.rs) || 0,
            amount: parseFloat(row.amount) || 0,
            av: row.average ? row.average  : 0 // Assuming 'average' field indicates availability
          }))
      }));
    };
  
    // Transform fullPackage (rows in frontend)
    const transformFullPackage = (rows) => {
      return rows
        .filter(row => isValidValue(row.size) && isValidValue(row.width) && isValidValue(row.percentage)) // Filter out rows with missing values
        .map(row => ({
          size: row.size || "", // Assuming size ID maps to size name directly
          weight: parseFloat(row.width) || 0, // Default to 0 if value is missing or invalid
          percentage: parseFloat(row.percentage) || 0
        }));
    };
  
    // Transform remaining fields with validation and default values
    const partyName = isValidValue(frontendData.partyname) ? frontendData.partyname : "";
    const brokerName = isValidValue(frontendData.brokername) ? frontendData.brokername : "";
    const packageWeight = parseFloat(frontendData.PackageWeight) || 0;
    const sellLimit = parseFloat(frontendData.sellLimit) || 0;
    const sampleWeight = parseFloat(frontendData["Sample Weight"]) || 0;
    const colorName = frontendData.Color || "";
    const shapeName = frontendData.Shape || "";
    const outPercentage = parseFloat(frontendData.OutPercentage) || 0;
    const outWeight = parseFloat(frontendData.oWeight) || 0;
    const finalPurchaseWeight = parseFloat(frontendData.pWeight) || 0;
    const remarks = frontendData.remark || "";
    const outRemarks = frontendData.lastremark || "";
    const seal = [parseInt(frontendData.Seal1) || 0, parseInt(frontendData.Seal2) || 0];
    const discount1Amount = parseFloat(frontendData.discountamount1) || 0;
    const discount1percentage = frontendData["Discount 1"] ? parseFloat(parseFloat(frontendData["Discount 1"].label) *parseFloat(-1)).toFixed(2) : "";
    const discount2Amount = parseFloat(frontendData.discountamount2) || 0;
    const discount2percentage = frontendData["Discount 2"] ? parseFloat(parseFloat(frontendData["Discount 2"].label) *parseFloat(-1)).toFixed(2) : "";
    const costPrice = parseFloat(frontendData.GrandTotal) || 0;
    const finalPrice = costPrice - discount1Amount - discount2Amount;
    const averageTotal = parseFloat(frontendData.TotalAverage) || 0;
    const datetime = new Date().toISOString(); // Assuming current date and time
    const createdBy = "currentUser"; // Replace with actual user info
    const modifiedBy = "currentUser"; // Replace with actual user info
    const createdDateTime = new Date().toISOString();
    const lastModifiedDateTime = new Date().toISOString();
  
    return {
      partyName,
      brokerName,
      packageWeight,
      sellLimit,
      sampleWeight,
      colorName,
      shapeName,
      outPercentage,
      outWeight,
      finalPurchaseWeight,
      remarks,
      outRemarks,
      section: transformSections(frontendData.sections || []),
      fullPackate: transformFullPackage(frontendData.rows || []),
      seal,
      averageTotal,
      discount1Amount,
      discount1percentage,
      discount2Amount,
      discount2percentage,
      costPrice,
      finalPrice,
      datetime,
      createdBy,
      modifiedBy,
      createdDateTime,
      lastModifiedDateTime
    };
  };
  

  // akhu packet
  const [rows, setRows] = useState([{ size: "", width: "", percentage: "" }]);
  const [showTable, setShowTable] = useState(false);
  const [selectedSizes1, setSelectedSizes1] = useState([]);

  // const sizeOptions1 = [
  //   { value: '000', label: '000' },
  //   { value: 'newsizee', label: 'newsizee' },
  //   { value: 'A', label: 'A' },
  //   { value: 'B', label: 'B' },
  // ];
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  });

  // Define your size options here

  const addRow1 = () => {
    if (fields.length < 5) {
      append({ size: "", width: "", percentage: "" });
    }
  };

  const removeRow1 = (index) => {
    const removedSize = getValues(`rows[${index}].size`);
    remove(index);
    if (removedSize) {
      setSelectedSizes1((prevSelectedSizes1) =>
        prevSelectedSizes1.filter((size) => size !== removedSize)
      );
    }
  };

  const handleChange = (index, field, value) => {
    const updatedRows = fields.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setValue(`rows[${index}][${field}]`, value);

    if (field === "size") {
      setSelectedSizes1((prevSelectedSizes1) => {
        const newSelectedSizes1 = [...prevSelectedSizes1];
        const prevValue = watch(`rows[${index}].size`);
        if (prevValue) {
          const prevIndex = newSelectedSizes1.indexOf(prevValue);
          if (prevIndex > -1) {
            newSelectedSizes1.splice(prevIndex, 1);
          }
        }
        if (value) {
          newSelectedSizes1.push(value);
        }
        return newSelectedSizes1;
      });
    }

    if (field === "width") {
      const weight = parseFloat(value) || 0;
      console.log("Weight ", weight);

      // console.log("Percentage ", ((weight / sellLimit) * 100).toFixed(2))
      let newPackgeWeight = packageWeight ? packageWeight : 0;
      updatedRows[index]["percentage"] = (
        (weight / newPackgeWeight) *
        100
      ).toFixed(2);
      setValue(`rows[${index}].percentage`, updatedRows[index]["percentage"]);
    }
  };

  const toggleTable = () => {
    setShowTable(!showTable);
  };

  const getFilteredOptions = (currentSize) => {
    const filtered = sizeOptions1.filter(
      (option) => !selectedSizes1.includes(option.value)
    );
    if (currentSize) {
      filtered.push(
        sizeOptions1.find((option) => option.value === currentSize)
      );
    }
    return filtered;
  };

  // discount code
  const [discountData, setDiscountData] = useState({
    discount1: "",
    discount1Amount: "",
  });

  const discountOptions = Array.from({ length: 100 }, (_, i) => {
    const value = -i - 1;
    return { value, label: `${value}%` };
  });
  const calculateDiscountAmount = (sellLimit, discount1, discount2) => {
    const sellLimitNumber = parseFloat(sellLimit) || 0;
    const discount1Number = parseFloat(discount1) || 0;
    const discount2Number = parseFloat(discount2) || 0;

    let calculatedDiscount1Amount = (
      sellLimitNumber +
      (discount1Number * sellLimitNumber) / 100
    ).toFixed(2);
    const calculatedDiscount2Amount = (
      sellLimitNumber +
      (discount2Number * sellLimitNumber) / 100
    ).toFixed(2);

    const discountAmount1Element = document.getElementById("discountamount1");
    const discountAmount2Element = document.getElementById("discountamount2");

    if (discountAmount1Element) {
      discountAmount1Element.value = calculatedDiscount1Amount;
      setValue("discountamount1", calculatedDiscount1Amount);
    }
    if (discountAmount2Element) {
      discountAmount2Element.value = calculatedDiscount2Amount;
      setValue("discountamount2", calculatedDiscount2Amount);
    }

    console.log("Discount 1 calculated:", calculatedDiscount1Amount);
    console.log("Discount 2 calculated:", calculatedDiscount2Amount);
  };

  const handleDiscountChange = (selectedOption, discountType, sellLimit) => {
    const discountValue = selectedOption ? selectedOption.value : "";
    const updatedDiscountData = { ...discountData };

    if (discountType === 1) {
      updatedDiscountData.discount1 = discountValue;
      updatedDiscountData.discount1Amount = `${discountValue}%`;
    } else if (discountType === 2) {
      updatedDiscountData.discount2 = discountValue;
      updatedDiscountData.discount2Amount = `${discountValue}%`;
    }

    setDiscountData(updatedDiscountData);
    const discount1 =
      discountType === 1 ? discountValue : updatedDiscountData.discount1;
    const discount2 =
      discountType === 2 ? discountValue : updatedDiscountData.discount2;

    calculateDiscountAmount(sellLimit, discount1, discount2);
  };

  const handleSellLimitChange = (event) => {
    const sellLimit = event.target.value;
    const discount1 = discountData.discount1;
    const discount2 = discountData.discount2;
    setValue("sellLimit", sellLimit);
    calculateDiscountAmount(sellLimit, discount1, discount2);
  };

  //out
  const [packageWeight, setPackageWeight] = useState("");
  const [outPercentage, setOutPercentage] = useState("");
  const [outWeight, setOutWeight] = useState(0);
  const [finalPurchaseWeight, setFinalPurchaseWeight] = useState(0);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const pkgWeight = parseFloat(packageWeight) || 0;
    const outPct = parseFloat(outPercentage) || 0;
    const calculatedOutWeight = (pkgWeight * outPct) / 100;
    setOutWeight(calculatedOutWeight);
    setValue("oWeight",calculatedOutWeight);
    const calculatedFinalPurchaseWeight = pkgWeight - calculatedOutWeight;
    setFinalPurchaseWeight(calculatedFinalPurchaseWeight);
    setValue("pWeight", calculatedFinalPurchaseWeight.toFixed(2));
  }, [packageWeight, outPercentage]);

  const handlePackageWeightChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setPackageWeight(value);
      setValue("PackageWeight", value);
    }
  };

  const handleOutPercentageChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setOutPercentage(value);
      setValue("OutPercentage", value);
    }
  };

  const options = sizeOptions.map((option) => ({
    value: option,
    label: option,
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: "150px",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  const customStyles1 = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // Ensure dropdown is above other elements
    }),
  };

  const filteredSizeOptions = sizeOptions.filter(
    (option) => !selectedSizes.includes(option.value)
  );

  // New component for dynamic table with size_name and textbox
  const DynamicSizeTable = () => {
    return (
      <div>
        <table className="table table-borderless table-centered mb-0">
          <thead className="table-light">
            <tr>
              <th>Size Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {selectedSizes.map((size, index) => (
              <tr key={index}>
                <td>{size.label}</td>
                <td>
                  <input
                    type="number"
                    className="form-control bg-light border-0"
                    defaultValue={1}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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
            <form
              className="needs-validation"
              onSubmit={handleSubmit(onSubmit)}
              noValidate=""
              id="invoice_form"
            >
              <div className="card-body border-bottom border-bottom-dashed p-4">
                <div className="row">
                  <div className="col-lg-4">
                    <div className="profile-user mx-auto mb-3">
                      <div className="mb-2">
                        <label htmlFor="packageWeight">
                          Package weight (in ct)
                        </label>
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          id="packageWeight"
                          placeholder="Package Weight"
                          value={packageWeight}
                          onChange={handlePackageWeightChange}
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter a package weight, Ex., 10.05
                        </div>
                      </div>

                      <div className="mb-2">
                        <label htmlFor="outPercentage">Out percentage</label>
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          id="outPercentage"
                          placeholder="Out Percentage %"
                          value={outPercentage}
                          onChange={handleOutPercentageChange}
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter an out percentage, Ex., 10.05
                        </div>
                      </div>

                      <div className="mb-2">
                        <label htmlFor="outWeight">Out Weight</label>
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          id="outWeight"
                          placeholder="Out Weight"
                          value={outWeight.toFixed(2)}
                          readOnly
                          required
                          name="outWeight"
                          {...register("outWeight")}
                        />
                        <div className="invalid-feedback">
                          Please enter an out weight, Ex., 10.05
                        </div>
                      </div>

                      <div className="mb-2">
                        <label htmlFor="outRemarks">Remarks</label>
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          id="outRemarks"
                          placeholder="Out Remarks"
                          value={remarks}
                          onChange={(e) => {
                            setRemarks(e.target.value);
                            setValue("remark", e.target.value);
                          }}
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter remarks, Ex., Sample Remarks
                        </div>
                      </div>

                      <div className="mb-2">
                        <label htmlFor="finalPurchaseWeight">
                          Final Purchase Weight
                        </label>
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          id="finalPurchaseWeight"
                          placeholder="Final Purchase Weight"
                          value={finalPurchaseWeight.toFixed(2)}
                          name="finalPurchaseWeight"
                          {...register("finalPurchaseWeight")}
                          readOnly
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter a final purchase weight, Ex., 10.05
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 ms-auto">
                    <label htmlFor="invoicenoInput">Party Name</label>

                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control bg-light border-0"
                        id="partyName"
                        placeholder="Party Name"
                        {...register("partyname")}
                      />
                      <div className="invalid-feedback">
                        Please enter a PartyName
                      </div>
                    </div>
                    <div className="mb-2">
                      <label htmlFor="invoicenoInput">Broker Name</label>

                      <input
                        type="text"
                        className="form-control bg-light border-0"
                        id="brokerName"
                        placeholder="Broker Name"
                        {...register("brokername")}
                        required=""
                      />
                      <div className="invalid-feedback">
                        Please enter a valid BrokerName, Ex., example@gamil.com
                      </div>
                    </div>
                    <div className="mb-2">
                      <label htmlFor="invoicenoInput">Sell Limit</label>
                      <input
                        type="text"
                        className="form-control bg-light border-0"
                        id="sellLimit"
                        placeholder="Sell Limit"
                        onChange={handleSellLimitChange}
                      />
                      <div className="invalid-feedback">
                        Please enter a valid Sell Limit
                      </div>
                    </div>

                    
                  </div>
                </div>
              </div>

              <div className="card-body p-4  border-bottom border-bottom-dashed">
              <div className="row g-3 border-bottom-dashed border-bottom p-2">
                  <div className="col-lg-3 col-sm-6">
                    <label htmlFor="choices-color">Color</label>
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
                            id="choices-color"
                            required=""
                            tabIndex={-1}
                            data-choice="active"
                            onChange={(selectedOption)=>{
                                console.log("color", selectedOption);
                                setValue("Color", selectedOption.target.value);   

                            }
                                
                            }
                          >
                            <option value="">Select Color</option>
                            {colorOptions.map((color, index) => (
                              <option key={color.label} value={color.label}>
                                {color.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-sm-6">
                    <label htmlFor="choices-shape">Shape</label>
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
                            id="choices-shape"
                            required=""
                            tabIndex={-1}
                            data-choice="active"
                            onChange={(selectedOption)=>{
                                
                                setValue("Shape", selectedOption.target.value);

                            }
                                
                            }
                          >
                            <option value="">Select Shape</option>
                            {shapeOptions.map((shape, index) => (
                              <option key={index} value={shape.label}>
                                {shape.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h4>Full Packate Table </h4>
                <Container>
                  <Row>
                    <Col>
                      <Button
                        variant="primary"
                        onClick={() => setShowTable(!showTable)}
                      >
                        {showTable ? "Hide Table" : "Show Table"}
                      </Button>
                    </Col>
                  </Row>
                  {showTable && (
                    <Row>
                      <Col>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                          <div className="table-responsive">
                            <table className="table table-borderless table-centered mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th>Size</th>
                                  <th>Weight</th>
                                  <th>Percentage</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {fields.map((field, index) => (
                                  <tr key={field.id}>
                                    <td>
                                      <div style={{ minWidth: "150px" }}>
                                        <Select
                                          value={sizeOptions1.find(
                                            (option) =>
                                              option.value ===
                                              watch(`rows[${index}].size`)
                                          )}
                                          onChange={(selectedOption) =>
                                            handleChange(
                                              index,
                                              "size",
                                              selectedOption
                                                ? selectedOption.value
                                                : ""
                                            )
                                          }
                                          options={getFilteredOptions(
                                            watch(`rows[${index}].size`)
                                          )}
                                          placeholder="Select"
                                          classNamePrefix="select"
                                          styles={customStyles}
                                          menuPortalTarget={document.body}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        {...register(`rows[${index}].width`)}
                                        className="form-control bg-light"
                                        placeholder="Width"
                                        onChange={(e) =>
                                          handleChange(
                                            index,
                                            "width",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        {...register(
                                          `rows[${index}].percentage`
                                        )}
                                        className="form-control bg-light"
                                        placeholder="Percentage"
                                        // value={field.percentage}
                                        onChange={(e) =>
                                          handleChange(
                                            index,
                                            "percentage",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <Button
                                        variant="danger"
                                        onClick={() => removeRow1(index)}
                                      >
                                        Remove Row
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <Button
                            variant="success"
                            onClick={addRow1}
                            disabled={fields.length >= 5}
                          >
                            Add Row
                          </Button>
                        </Form>
                      </Col>
                    </Row>
                  )}
                </Container>
                
              </div>
              <div className="card-body p-4 border-bottom border-bottom-dashed">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <Container>
                        <Row>
                          <Col>
                            <Form>
                              
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
        <tbody>
          {sections.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              <tr>
                <td>
                  <Controller
                    name={`sections[${sectionIndex}].size`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={sizeOptions}
                        value={sizeOptions.find((option) => option.value === field.value)}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption.value);
                          handleSizeSelect(selectedOption, sectionIndex);
                          setValue(`sections[${sectionIndex}].size`, selectedOption ? selectedOption.label : "");
                        }}
                        className="select bg-light"
                        classNamePrefix="select"
                        styles={customStyles1}
                        menuPortalTarget={document.body}
                      />
                    )}
                  />
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <Button variant="danger" onClick={() => removeSection(sectionIndex)}>
                    Remove Section
                  </Button>
                </td>
              </tr>
              {section.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td></td>
                  <td>
                    <Controller
                      name={`sections[${sectionIndex}].rows[${rowIndex}].grade`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={gradeOptions.filter((option) => !section.selectedGrades.includes(option.value))}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption ? selectedOption.value : ""); // Trigger the field's onChange
                            handleRowChange(sectionIndex, rowIndex, "grade", selectedOption ? selectedOption.value : ""); // Handle additional change logic
                          }}
                          className="select bg-light"
                          classNamePrefix="select"
                          styles={customStyles1}
                          menuPortalTarget={document.body}
                          value={gradeOptions.find((option) => option.value === field.value) || null} // Ensure value is correctly set
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`sections[${sectionIndex}].rows[${rowIndex}].ct`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <input
                          type="number"
                          className="form-control bg-light"
                          placeholder="CT"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value); // Update the form state
                            handleRowChange(sectionIndex, rowIndex, "ct", e.target.value); // Call your custom change handler
                          }}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`sections[${sectionIndex}].rows[${rowIndex}].rs`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <input
                          type="number"
                          className="form-control bg-light"
                          placeholder="RS"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value); // Update the form state
                            handleRowChange(sectionIndex, rowIndex, "rs", e.target.value); // Call your custom change handler
                          }}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`sections[${sectionIndex}].rows[${rowIndex}].amount`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="number"
                          {...field}
                          className="form-control bg-light"
                          placeholder="Amount"
                          onChange={(e) => {
                            field.onChange(e.target.value); // Update form state
                            handleRowChange(sectionIndex, rowIndex, "amount", e.target.value); // Custom handler
                          }}
                          readOnly
                        />
                      )}
                    />
                  </td>
                  {rowIndex === 0 && (
                    <td rowSpan={section.rows.length}>
                      <Controller
                        name={`sections[${sectionIndex}].rows[${rowIndex}].average`}
                        control={control}
                        render={({ field }) => (
                          <input
                            type="number"
                            className="form-control bg-light"
                            placeholder="Average"
                            {...field}
                            value={field.value || ""}
                            readOnly
                          />
                        )}
                      />
                    </td>
                  )}
                  <td>
                    <Button variant="danger" onClick={() => removeRow(sectionIndex, rowIndex)}>
                      Remove Row
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="7" className="border-bottom border-bottom-dashed">
                  <Button variant="success" onClick={() => addRow(sectionIndex)}>
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
      </table>
      <div style={{ display: "flex" }}>
        <table className="table table-borderless table-centered mb-0" style={{ marginLeft: "auto" }}>
          
        </table>
                              </div>
                            </Form>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                  </div>
                </div>
              </div>

              {/* New table */}
              <div style={{ display: "flex" }}>
                <table
                  className="table table-borderless table-centered mb-0"
                  style={{ marginLeft: "auto" }}
                >
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
                      <th scope="row">Sample Weight </th>
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
                      <th scope="row"> Total Average </th>
                      <td>
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          id="total-avg"
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
                    {/* Dashed */}
                    {/* <tr className="border-top border-top-dashed">
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
                    </tr> */}
                  </tbody>
                </table>
              </div>

              <div className="card-body p-4  border-bottom border-bottom-dashed border-top border-top-dashed">
                <div className="row g-1">
                  <div className="col-lg-2 col-sm-6">
                    <label htmlFor="invoicenoInput">Seal 1</label>
                    <input
                      type="number"
                      className="form-control bg-light border-0"
                      id="invoicenoInput"
                      placeholder="0.00"
                      
                      {...register("Seal1")}
                      min={0}
                    />
                  </div>
                  <div className="col-lg-2 col-sm-6">
                    <label htmlFor="choices-payment-status">Seal 2</label>
                    <input
                      type="number"
                      className="form-control bg-light border-0"
                      id="invoicenoInput1"
                      placeholder="0.00"
                      
                      {...register("Seal2")}
                      min={0}
                    />
                  </div>
                  <div className="col-lg-4 col-sm-6">
                  <div className="d-flex">
                      <div className="mb-2">
                        <label htmlFor="invoicenoInput">Discount 1(%)</label>
                        <div className="input-light">
                          <Select
                            options={discountOptions}
                            onChange={(selectedOption) => {
                              handleDiscountChange(
                                selectedOption,
                                1,
                                document.getElementById("total-avg").value
                              );
                              setValue("Discount 1", selectedOption);
                            }}
                            className="bg-light"
                            classNamePrefix="select"
                            data-discount="1"
                          />
                        </div>
                        <div className="invalid-feedback">
                          Please enter a valid Discount
                        </div>
                      </div>
                      <div className="mb-2">
                        <label htmlFor="invoicenoInput">
                          Discount 1 Amount
                        </label>
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          id="discountamount1"
                          placeholder="Discount 1"
                          readOnly
                        />
                        <div className="invalid-feedback">
                          Please enter a valid Discount
                        </div>
                      </div>
                    </div>
                   
                  </div>
                  <div className="col-lg-4 col-sm-6">
                  <div className="d-flex">
                      <div className="mb-2">
                        <label htmlFor="invoicenoInput">Discount 2(%)</label>
                        <div className="input-light">
                          <Select
                            options={discountOptions}
                            onChange={(selectedOption) => {
                              handleDiscountChange(
                                selectedOption,
                                2,
                                document.getElementById("total-avg").value
                              );
                              setValue("Discount 2", selectedOption);
                            }}
                            className="bg-light"
                            classNamePrefix="select"
                            data-discount="2"
                          />
                        </div>
                        <div className="invalid-feedback">
                          Please enter a valid Discount
                        </div>
                      </div>
                      <div className="mb-2">
                        <label htmlFor="invoicenoInput">
                          Discount 2 Amount
                        </label>
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          id="discountamount2"
                          placeholder="Discount 2"
                          readOnly
                        />
                        <div className="invalid-feedback">
                          Please enter a valid Discount
                        </div>
                      </div>
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
                        onChange={(e) => {
                          setFormData({ ...formData, remarks: e.target.value });
                          setValue("lastremark", e.target.value);
                        }}
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
                    {/* <button type="button" onClick={handlePrintFormData}>
                      Print Form Data
                    </button> */}
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
