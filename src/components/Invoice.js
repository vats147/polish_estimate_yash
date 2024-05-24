import React, { Fragment, useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
// import logo from "./Logo.png";
import axios from "axios";
import Table from "react-bootstrap/Table";

const Invoice = ({orderId}) => {
  const [tempData, setTempData] = useState(null);

  const [totals, setTotals] = useState({ ct: 0, rs: 0, amount: 0, av: 0 });

  let totalCt = 0;
  let totalRs = 0;
  let totalAmount = 0;
  let totalAv = 0;
  console.log(orderId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/getoneorder", {
          params: {
            orderId: orderId,
          },
        });
        console.log(response.data);
        setTempData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const calculateDiscountedPrice = (price, discount) => {
    const discountAmount = (parseFloat(price) * parseFloat(discount)) / 100;
    return parseFloat(price) - discountAmount;
  };

  const calculateTotal = () => {
    totalCt = 0;
    totalRs = 0;
    totalAmount = 0;
    totalAv = 0;
  
    tempData?.data[0]?.section.map((section, index) =>
      section.row.map((row, rowIndex) => {
        totalCt += parseFloat(row.ct);
        totalRs += parseFloat(row.rs);
        totalAmount += parseFloat(row.amount);
      })
    );
    console.log(totalCt, totalRs, totalAmount, totalAv);
  };
  const fontSize = {
    page: 11,
    reportTitle: 16,
    addressTitle: 11,
    invoice: 20,
    invoiceNumber: 11,
    address: 10,
    theader: 10,
    tbody: 7,
    total: 7,
    sectionHeader: 16,
    sizeheader: 16,
  };

  const padding = {
    page: { paddingTop: 20, paddingLeft: 40, paddingRight: 40 },
    theader: { paddingTop: 4, paddingLeft: 7 },
    tbody: { paddingTop: 4, paddingLeft: 7 },
    total: { paddingTop: 4, paddingLeft: 7 },
    cell: { padding: 3 },
  };

  const styles = {
    page: {
      fontSize: fontSize.page,
      paddingTop: 20,
      paddingLeft: 40,
      paddingRight: 40,
      lineHeight: 1.5,
      flexDirection: "column",
    },
    spaceBetween: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      color: "#3E3E3E",
    },
    titleContainer: { flexDirection: "row", marginTop: 10 },
    logo: { width: 90 },
    reportTitle: { fontSize: fontSize.reportTitle, textAlign: "center" },
    addressTitle: { fontSize: fontSize.addressTitle, fontStyle: "bold" },
    invoice: { fontWeight: "bold", fontSize: fontSize.invoice },
    invoiceNumber: { fontSize: fontSize.invoiceNumber, fontWeight: "bold" },
    address: { fontWeight: 400, fontSize: fontSize.address },
    theader: {
      fontSize: fontSize.theader,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      height: 20,
      backgroundColor: "#DEDEDE",
      borderColor: "whitesmoke",
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },
    theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },
    tbody: {
      fontSize: fontSize.tbody,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      borderColor: "whitesmoke",
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },
    total: {
      fontSize: fontSize.total,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1.5,
      borderColor: "whitesmoke",
      borderBottomWidth: 1,
    },
    tbody2: { flex: 2, borderRightWidth: 1 },
    sectionHeader: {
      fontSize: fontSize.sectionHeader,
      fontWeight: "bold",
      marginBottom: 5,
    },
    grade: {
      flex: 1,
    },
    ct: {
      flex: 1,
    },
    rs: {
      flex: 1,
    },
    amount: {
      flex: 1,
    },
    av: {
      flex: 1,
    },
    headerRow: {
      flexDirection: "row",
      backgroundColor: "#f0f0f0",
      borderRadius: 5,
      marginBottom: 5,
    },
    headerCell: {
      flex: 1,
      padding: 5,
      textAlign: "center",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 3,
      borderRadius: 5,
    },
    cell: {
      flex: 1,
      textAlign: "left",
      padding: 3,
    },
    tablesizeheader: { fontWeight: "bold", fontSize: fontSize.sizeheader },
    tableContainer: {
      flexDirection: "column",
      borderWidth: 1,
      borderColor: "#000",
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
    },
    tableCell: {
      flex: 1,
      padding: 5,
      borderRightWidth: 1,
      borderRightColor: "#000",
    },
  };

  const InvoiceTitle = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        {/* <Image style={styles.logo} src={logo} /> */}
        <View>
        <Text style={styles.reportTitle}> J.Varshit
        
        </Text>
        <Text style={styles.addressTitle}> Rich Color Rere Heritage
        </Text>
        </View>
        <Text style={styles.address}>
          Created On:{" "}
          {tempData?.data[0]?.datetime
            ? new Date(tempData.data[0].datetime).toISOString().split("T")[0]
            : "N/A"}
        </Text>
      </View>
    </View>
  );

  const InvoicePartyTitle = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        {/* <Image style={styles.logo} src={logo} /> */}
        <Text style={styles.addressTitle}>
           Broker Name: {tempData?.data[0]?.brokerName || "N/A"}
        </Text>
        <Text style={styles.addressTitle}> Party Name: {tempData?.data[0]?.partyName || "N/A"}
        </Text>
      </View>
    </View>
  );

  const Address = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View>
          <Text style={styles.invoice}>Invoice </Text>
          <Text style={styles.addressTitle}>
            {" "}
            Party Name: {tempData?.data[0]?.partyName }
          </Text>
          <Text style={styles.addressTitle}>
            {" "}
            Broker Name: {tempData?.data[0]?.brokerName}
          </Text>
          <Text style={styles.addressTitle}>
            {" "}
            Package Weight: {tempData?.data[0]?.packageWeight}
          </Text>
          <Text style={styles.addressTitle}>
            {" "}
            Sample Weight: {tempData?.data[0]?.packageWeight}
          </Text>
          <Text style={styles.addressTitle}>
            {" "}
            Sell Limit: {tempData?.data[0]?.sellLimit}
          </Text>
          <Text style={styles.addressTitle}>
            {" "}
            Discount Terms: {tempData?.data[0]?.sampleWeight} %
          </Text>
        </View>
        <View>
          <Text style={styles.addressTitle}>
            Date:{" "}
            {tempData?.data[0]?.datetime
              ? new Date(tempData.data[0].datetime).toISOString().split("T")[0]
              : ""}
          </Text>
          <Text style={styles.addressTitle}>Invoice number:</Text>
          <Text style={styles.addressTitle}>{tempData?.data[0]?.orderId} </Text>

          {/* <Text style={styles.addressTitle}>7, Ademola Odede, </Text>
          <Text style={styles.addressTitle}>Ikeja,</Text>
          <Text style={styles.addressTitle}>Lagos, Nigeria.</Text> */}
        </View>
      </View>
    </View>
  );

  const UserAddress = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        {calculateTotal()}
        <View style={{ maxWidth: 200 }}>
          <Text style={styles.addressTitle}>Sample Weight</Text>
          <Text style={styles.address}>{totalCt} ct</Text>
        </View>
        <View style={{ maxWidth: 200 }}>
          <Text style={styles.addressTitle}>Sample Weight Percentage (%) </Text>
          <Text style={styles.address}>
            
            {parseFloat(
              (parseFloat(totalCt) * 100) /
                parseFloat(tempData?.data[0]?.packageWeight)
            ).toFixed(2)}{" "}
            %
          </Text>
        </View>

        <View style={{ maxWidth: 200 }}>
          
        </View>
        <Text style={styles.addressTitle}> </Text>
      </View>
    </View>
  );

  const TableHead = () => (
    <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
      <View style={[styles.theader, styles.theader2]}>
        <Text>Size</Text>
      </View>
      <View style={styles.theader}>
        <Text>Grade</Text>
      </View>
      <View style={styles.theader}>
        <Text>CT</Text>
      </View>
      <View style={styles.theader}>
        <Text>RS</Text>
      </View>
      <View style={styles.theader}>
        <Text>Amount</Text>
      </View>
      <View style={styles.theader}>
        <Text>AV</Text>
      </View>
    </View>
  );

  const TableBody = () => (
    <View style={styles.tableContainer}>
      {tempData?.data[0]?.section.map((section, index) => (
        <View key={index}>
          {section.row.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {rowIndex === 0 && section.size}
              </Text>
              <Text style={styles.tableCell}>{row.grade}</Text>
              <Text style={styles.tableCell}>{row.ct}</Text>
              <Text style={styles.tableCell}>{row.rs}</Text>
              <Text style={styles.tableCell}>{row.amount}</Text>
              <Text style={styles.tableCell}>{row.av.toString()}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const TableEnd = () => (
    <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
      {calculateTotal()}
      <View style={[styles.theader, styles.theader2]}>
        <Text>Total</Text>
      </View>
      <View style={styles.theader}>
        <Text>Grade</Text>
      </View>
      <View style={styles.theader}>
        <Text>{totalCt}</Text>
      </View>
      <View style={styles.theader}>
        <Text>{totalRs}</Text>
      </View>
      <View style={styles.theader}>
        <Text>{totalAmount}</Text>
      </View>
      <View style={styles.theader}>
        <Text>AV</Text>
      </View>
    </View>
  );
  const TableTotal = () => (
    <View style={{ width: "100%", flexDirection: "row" }}>
      <View style={styles.total}>
        <Text>{totals.rs}</Text>
      </View>
      <View style={styles.total}>
        <Text> </Text>
      </View>
      <View style={styles.tbody}>
        <Text>Total</Text>
      </View>
      <View style={styles.tbody}>
        <Text>dfsdf</Text>
      </View>
    </View>
  );

  const TableRemakrs = () => (
    <View style={{ width: "100%", flexDirection: "row" , margin:5}}>
      <View style={styles.total}>
        <Text>Remarks: {tempData?.data[0]?.outRemarks}</Text>
      </View>
      <View style={styles.total}>
        <Text> </Text>
      </View>
      <View style={styles.tbody}>{/* <Text>Total</Text> */}</View>
      <View style={styles.tbody}>
        <Text>createdBy : {tempData?.data[0]?.createdBy} Surat</Text>
      </View>
    </View>
  );
  const TableSizeHeader = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View>
          <Text style={styles.tablesizeheader}>Size Percentage Table </Text>
        </View>
        <View>
          <Text style={styles.tablesizeheader}>Full Packate Table </Text>
        </View>
      </View>
    </View>
  );

  const TableSize = () => (
    <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
      <View style={[styles.theader]}>
        <Text>Size Name</Text>
      </View>
      <View style={styles.theader}>
        <Text>Percentage (%) </Text>
      </View>
      <View>
        <Text>&nbsp;</Text>
      </View>
      <View style={styles.theader}>
        <Text> Size ( charni) </Text>
      </View>
      <View style={styles.theader}>
        <Text>Weight</Text>
      </View>
      <View style={styles.theader}>
        <Text>Percentage</Text>
      </View>
    </View>
  );

  const TableHR = () => {
    return (
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 1,
          marginVertical: 5,
          borderStyle: "dashed",
        }}
      />
    );
  };
  const TableSizeBody = () => (
    <View style={styles.tableContainer}>
      {tempData?.data[0]?.section.map((section, index) => {
        const totalCt = section.row.reduce(
          (sum, row) => sum + parseFloat(row.ct),
          0
        );
        const fullPackate = tempData?.data[0].fullPackate[index];
        const fullPackateSize = fullPackate ? fullPackate.size : "N/A";
        const fullPacketWeight = fullPackate ? fullPackate.weight : "N/A";
        const fullPacketPercentage = fullPackate
          ? fullPackate.percentage
          : "N/A";

        return (
          <View key={index} style={styles.tableRow}>
            <Text
              style={[
                styles.tableCell,
                { flex: 2, rowSpan: section.row.length },
              ]}
            >
              {section.size}
            </Text>
            <Text
              style={[
                styles.tableCell,
                { flex: 2, rowSpan: section.row.length },
              ]}
            >
              {parseFloat(
                (totalCt * 100) / parseFloat(tempData?.data[0].sampleWeight)
              ).toFixed(2)}
            </Text>

            <Text style={[styles.tableCell, { flex: 2 }]}>
              {fullPackateSize}
            </Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              {fullPacketWeight}
            </Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              {fullPacketPercentage}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const TableNewBorder = () => (
    <View style={{ flexDirection: "row", marginTop: 10 }}>
      <View style={{ flex: 1, borderStyle: "solid", padding: 1, paddingRight:10 }}>
        {/* <Text style={{fontWeight: 'bold', fontSize: 8, textAlign: 'center' }}>Full Packate Table</Text> */}
        <View
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            marginTop: 0,
            fontSize: 8,
            fontWeight: "bold",
          }}
        >
          
          
            
            <View
                
            style={{
              flexDirection: "row",
              borderBottomWidth:  1,
            }}
          >
            <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              sellLimit
              
            </Text>

            <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                
              }}
            >
              {tempData?.data[0]?.sellLimit ? tempData?.data[0]?.sellLimit  :"N/A"}
            </Text>

            
            
          </View>
            <View
                
            style={{
              flexDirection: "row",
              borderBottomWidth:  1,
            }}
          >
            <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              Package Weight
              
            </Text>

            <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                
              }}
            >
              {tempData?.data[0]?.packageWeight ? tempData?.data[0]?.packageWeight :"N/A"}
            </Text>

            
            
          </View>
            <View
                
            style={{
              flexDirection: "row",
              borderBottomWidth:  1,
            }}
          >
            <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              Out Percentage:
              
            </Text>

            <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                
              }}
            >
              

              {tempData?.data[0]?.outPercentage ? tempData?.data[0]?.outPercentage :"N/A"} %

            </Text>

            
            
          </View>
            <View
                
            style={{
              flexDirection: "row",
              borderBottomWidth:  1,
            }}
          >
            <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              Out Weight:
              
            </Text>

            <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                
              }}
            >
              

               {tempData?.data[0]?.outWeight ? tempData?.data[0]?.outWeight :"0"} ct
            </Text>

            
            
          </View>
            
            <View
                
            style={{
              flexDirection: "row",
              borderBottomWidth:  1,
            }}
          >
            <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              Remarks
              
            </Text>

            <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                
              }}
            >
              {tempData?.data[0]?.outRemarks ? tempData?.data[0]?.remarks :"N/A"}

            </Text>

            
            
          </View>

          <View
                
            style={{
              flexDirection: "row",
              
            }}
          >
            <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              Final Purchase Weight
              
            </Text>

            <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                
              }}
            >
              
              {tempData?.data[0]?.finalPurchaseWeight ? tempData?.data[0]?.finalPurchaseWeight :"N/A"} ct

            </Text>

            
            
          </View>

          
          
            
              
            
          

          {/* <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 1, textAlign: 'center', padding: 5, borderRightWidth: 1 }}>3</Text>
          <Text style={{ flex: 2, textAlign: 'center', padding: 5, borderRightWidth: 1 }}>Larry the Bird</Text>
          <Text style={{ flex: 2, textAlign: 'center', padding: 5 }}>@twitter</Text>
        </View> */}
        </View>
      </View>
      {/* <View style={{ flex: 1 }}>
        
        <View>
        
          
          
          <Text style={styles.addressTitle}>
            {" "}
            Sell Limit: {tempData?.data[0]?.sellLimit}
          </Text>
          <Text style={styles.addressTitle}>
            {" "}
            Package Weight: {tempData?.data[0]?.packageWeight}
          </Text>

          <Text style={styles.addressTitle}>
            {" "}
            Out Weight(%): 20 %
          </Text>
          <Text style={styles.addressTitle}>
            {" "}
            Out Weight: 10 ct
          </Text>
          <Text style={styles.addressTitle}>
            {" "}
            Final Purchase Weight : 40 ct
          </Text>
          <Text style={styles.addressTitle}>
            {" "}
            Remarks : Sample Remarks 
          </Text>
          


        </View>


      </View> */}
      <View style={{ flex: 0.5, borderStyle: "solid", padding: 1 }}>
        <View
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            marginTop: 0,
            fontSize: 8,
            fontWeight: "bold",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              padding: 0,
              margin: 0,
            }}
          >
            <Text style={{ flex: 1, textAlign: "center" }}>
              {tempData?.data[0]?.shapeName ? tempData?.data[0]?.shapeName:"N/A" }
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ flex: 1, textAlign: "center" }}>
              {tempData?.data[0]?.colorName ? tempData?.data[0]?.colorName :"N/A" }
            </Text>
          </View>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            marginTop: 5,
            fontSize: 8,
            fontWeight: "bold",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              padding: 0,
              margin: 0,
            }}
          >
            <Text style={{ flex: 1, textAlign: "center" }}>
              Discount 1- {tempData?.data[0]?.discount1percentage ? tempData?.data[0]?.discount1percentage : "N/A"} %
            </Text>
          </View>
          <View style={{ flexDirection: "row", borderBottomWidth: 1, }}>
            <Text style={{ flex: 1, textAlign: "center" }}>
              {calculateTotal()}
              {
                parseFloat(tempData?.data[0]?.sellLimit) - parseFloat(parseFloat(tempData?.data[0]?.sellLimit) * parseFloat(tempData?.data[0]?.discount1percentage) / 100).toFixed(2)
              }
            </Text>
          </View>
          <View style={{ flexDirection: "row", borderBottomWidth: 1, }}>
            <Text style={{ flex: 1, textAlign: "center" }}>
            Discount 2- {tempData?.data[0]?.discount2percentage ? parseFloat(parseFloat(tempData?.data[0]?.discount2percentage) + parseFloat(1)).toFixed(2) : "N/A"} %
            </Text>
          </View>
          
          <View style={{ flexDirection: "row" }}>
            <Text style={{ flex: 1, textAlign: "center" }}>
            {calculateTotal()}
              {
                parseFloat(tempData?.data[0]?.sellLimit) - parseFloat(parseFloat(tempData?.data[0]?.sellLimit) * parseFloat(tempData?.data[0]?.discount2percentage) / 100).toFixed(2)
              }
            </Text>
          </View>
        </View>
      </View>
      
      <View style={{ flex: 1, borderStyle: "solid", padding: 1 }}>
        {/* <Text style={{fontWeight: 'bold', fontSize: 8, textAlign: 'center' }}>Full Packate Table</Text> */}
        <View
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            marginTop: 0,
            fontSize: 8,
            fontWeight: "bold",
          }}
        >
          <View style={{ flexDirection: "row", borderBottomWidth: 1 }}>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              Size
            </Text>
            <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              Weight
            </Text>
            <Text style={{ flex: 2, textAlign: "center", padding: 1 }}>
              Percentage
            </Text>
            {/* <Text style={{ flex: 2, textAlign: 'center', padding: 1 }}>Username</Text> */}
          </View>
          {tempData?.data[0]?.fullPackate?.map((section, index) => {
  
  // console.log("INDEX",index);
  // const fullPackate = tempData?.data[0]?.fullPackate[index];
  // const fullPackateSize = fullPackate ? fullPackate.size : "N/A";
  // const fullPacketWeight = fullPackate ? fullPackate.weight : "N/A";
  // const fullPacketPercentage = fullPackate ? fullPackate.percentage : "N/A";
  const isLastIndex = index === tempData?.data[0]?.fullPackate?.length - 1;
  return (
    <View
      key={index}
      style={{
        flexDirection: "row",
        borderBottomWidth: isLastIndex ? 0 : 1,
      }}
    >
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          padding: 1,
          borderRightWidth: 1,
        }}
      >
        {section.size}
      </Text>

      <Text
        style={{
          flex: 2,
          textAlign: "center",
          padding: 1,
          borderRightWidth: 1,
        }}
      >
        {section.weight}
      </Text>
      <Text style={{ flex: 2, textAlign: "center", padding: 1 }}>
        {section.percentage}
      </Text>
    </View>
  );
})}


          {/* <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 1, textAlign: 'center', padding: 5, borderRightWidth: 1 }}>3</Text>
          <Text style={{ flex: 2, textAlign: 'center', padding: 5, borderRightWidth: 1 }}>Larry the Bird</Text>
          <Text style={{ flex: 2, textAlign: 'center', padding: 5 }}>@twitter</Text>
        </View> */}
        </View>
      </View>
    </View>
  );

  const TableTemp = () => (
    <View style={{ flexDirection: "row", marginTop: 0 }}>
      
      <View style={{ flex: 3, borderStyle: "solid", padding: 0 }}>
        <View
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            
            fontSize: 8,
            fontWeight: "bold",
            
          }}
        >
          <View style={{ flexDirection: "row", borderBottomWidth: 1, backgroundColor: '#333',
            color: 'white', }}>
          <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              Size
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              Grade
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              Ct
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              Rs
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              Amount
            </Text>
            <Text style={{ flex: 1, textAlign: "center", padding: 1 }}>Av</Text>
          </View>
          {tempData?.data[0]?.section.map((section, index) => (
            <View key={index}>

         
              {section.row.map((row, rowIndex) => (
                
                <View
                  key={rowIndex}
                  style={{ flexDirection: "row"}}
                >
                 
              <Text
                    style={{
                      flex: 2,
                      textAlign: "center",
                      padding: 1,
                      borderRightWidth: 1,
                      borderBottomWidth:rowIndex===section.row.length-1?1:0 ,
                      verticalAlign: 'middle',
                    }}
                  >
                    { rowIndex ===0 ?  section.size: ' '}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: 1,
                      borderRightWidth: 1,
                      borderBottomWidth:1,
                    }}
                  >
                    {row.grade}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: 1,
                      borderRightWidth: 1,
                      borderBottomWidth:1,
                    }}
                  >
                    {row.ct}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: 1,
                      borderRightWidth: 1,
                      borderBottomWidth:1,
                    }}
                  >
                    {row.rs}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: 1,
                      borderRightWidth: 1,
                      borderBottomWidth:1,
                    }}
                  >
                    {row.amount}
                  </Text>
                  <Text style={{ flex: 1, textAlign: "center", padding: 1, borderBottomWidth:rowIndex===section.row.length-1?1:0

                   }}>
                  { rowIndex ===0 ?  row.av.toString(): ' '}
                    
                  </Text>
                </View>
              ))}
            </View>
          ))}
{/* Total row */}
<View style={{ flexDirection: "row", borderBottomWidth: 1, backgroundColor: '#333',
            color: 'white', }}>
          <Text
              style={{
                flex: 2,
                textAlign: "center",
                padding: 1,
                
              }}
            >
              
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                padding: 1,
                
              }}
            >
               
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                padding: 1,
                
              }}
            >
              
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              Total
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                padding: 1,
                borderRightWidth: 1,
              }}
            >
              {/* {calculateTotal()} */}
              { totalAmount
              }
            </Text>
            
            <Text style={{ flex: 1, textAlign: "center", padding: 1 }}>{ tempData?.data[0]?.averageTotal ? tempData?.data[0]?.averageTotal : "0" }</Text>
          </View>
        </View>
      </View>
    </View>
  );
  const TableHeading = () => (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#ccc",
        paddingVertical: 0,
      }}
    >
      <Text
        style={{
          flex: 2,
          textAlign: "center",
          fontWeight: "bold",
          borderRightWidth: 1,
          borderRightColor: "#ccc",
        }}
      >
        Size
      </Text>
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          fontWeight: "bold",
          borderRightWidth: 1,
          borderRightColor: "#ccc",
        }}
      >
        Grade
      </Text>
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          fontWeight: "bold",
          borderRightWidth: 1,
          borderRightColor: "#ccc",
        }}
      >
        Ct
      </Text>
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          fontWeight: "bold",
          borderRightWidth: 1,
          borderRightColor: "#ccc",
        }}
      >
        Rs
      </Text>
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          fontWeight: "bold",
          borderRightWidth: 1,
          borderRightColor: "#ccc",
        }}
      >
        Amount
      </Text>
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Av
      </Text>
    </View>
  );
  
  const TableTempBody = () => (
    <View>
      {tempData?.data[0]?.section.map((section, index) => {
        const rowSpan = section.row.length;
        return (
          <View key={index}>
            {section.row.map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc',
                }}
              >
                {rowIndex === 0 && (
                  <Text
                    style={{
                      flex: 2,
                      textAlign: 'center',
                      paddingVertical: 8,
                      borderRightWidth: 1,
                      borderRightColor: '#ccc',
                      rowSpan: rowSpan,
                      verticalAlign: 'middle',
                      
                    }}
                    
                  >
                    {section.size}
                  </Text>
                )}
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    paddingVertical: 8,
                    borderRightWidth: 1,
                    borderRightColor: '#ccc',
                  }}
                >
                  {row.grade}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    paddingVertical: 8,
                    borderRightWidth: 1,
                    borderRightColor: '#ccc',
                  }}
                >
                  {row.ct}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    paddingVertical: 8,
                    borderRightWidth: 1,
                    borderRightColor: '#ccc',
                  }}
                >
                  {row.rs}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    paddingVertical: 8,
                    borderRightWidth: 1,
                    borderRightColor: '#ccc',
                  }}
                >
                  {row.amount}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    paddingVertical: 8,
                  }}
                >
                  {row.av.toString()}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );


  const TableSeal = () => (
    <View style={{margin:15}}>
      <View style={styles.spaceBetween}>
        
        
        <View style={{ maxWidth: 200 }}>
          <Text style={styles.address}>Seal 1: {tempData?.data[0]?.seal[0]}</Text>
          <Text style={styles.address}>Seal 2: {tempData?.data[0]?.seal[1]}</Text>
        </View>
        

        
        <Text style={styles.addressTitle}> </Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle />
        <InvoicePartyTitle/>
        <TableHR />

        {/* <TableSizeHeader /> */}
        {/* <Address /> */}
        <TableNewBorder />
        <UserAddress />
        <TableHR />
        {/* <TableSize />
        <TableSizeBody /> */}
        {/* <TableHead /> */}
        {/* <TableBody /> */}
        {/* <TableHeading /> */}
        {/* <TableTempBody/> */}
        <TableTemp />
        <TableHR />
        <TableSeal/>

        {/* <TableEnd /> */}
        {/* <TableTotal /> */}
       
        <TableRemakrs />
      </Page>
    </Document>
  );
};

export default Invoice;
