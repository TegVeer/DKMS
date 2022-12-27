import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Selection,
  Inject,
  Edit,
  Toolbar,
  Sort,
  Filter,
} from "@syncfusion/ej2-react-grids";
import service from "../utils/service";
import { Header } from "../components";
import {
  Button,
  DialogTitle,
  Dialog,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Stack,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import TxnTypeSymbol from "../bitsComponents/tnxTypeSymbol";
const transactionsGrid = [
  { field: "txnId", headerText: "Txn ID", width: "100", textAlign: "Center" },
  {
    headerText: "Txn Type",
    width: "150",
    template: TxnTypeSymbol,
    textAlign: "Center",
  },
  {
    field: "desc",
    headerText: "Description",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "txnBy",
    headerText: "Txn By",
    width: "130",
    textAlign: "Center",
  },
  {
    field: "date",
    headerText: "Date",
    width: "100",
    textAlign: "Center",
  },
  {
    field: "totalPrice",
    headerText: "Total Price",
    width: "100",
    textAlign: "Center",
  },
];

// const transcationType = [
//   { label: "IN", value: "IN" },
//   { label: "OUT", value: "OUT" },
// ];

// let selectedItems = [];

const Transactions = () => {
  const { inventoryData } = useStateContext();
  const [inventoryOptions, setInventoryOptions] = useState([]);
  const selectionsettings = { persistSelection: true };
  const [modalStatus, setModalStatus] = useState(false);
  const [rowsData, setRowsData] = useState({
    rowNumber: 1,
    data: [
      {
        id: 1,
        name: "",
        qty: "",
        price: "",
      },
    ],
  });
  const [childData, setChildData] = useState([]);
  const [parentData, setParentData] = useState([]);

  useEffect(() => {
    service.getInventoryTnx().then((res) => {
      console.log("Response from Transactions API:", res.data);
      if (res.data && res.data.length > 0) {
        let datalist = res.data;
        let txnlist = datalist.map((item) => {
          addChildrecords(item.attributes.txn_data, item.id);
          return {
            txnId: item?.id,
            txnType: item?.attributes?.txn_type,
            desc: item?.attributes?.desc,
            txnBy: item?.attributes?.txn_by,
            date: item?.attributes?.date,
            totalPrice: calcTotalPrice(item?.attributes?.txn_data),
          };
        });
        console.log("txn list:", txnlist);
        setParentData(txnlist);
      }
    });
  }, []);
  useEffect(() => {
    setListItems();
  }, [rowsData]);

  function addChildrecords(records, txnId) {
    // console.log("%cRecords and data", "color:red", records, tnxId);
    if (records.length > 0) {
      records.forEach((item) => {
        let price = parseInt(item.price);
        let quantity = parseInt(item.quantity);
        setChildData((prev) => [
          ...prev,
          {
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: item.quantity,
            price: item.price,
            sumPrice: price * quantity,
            txnId,
          },
        ]);
      });
    }
  }

  function calcTotalPrice(data = []) {
    if (data.length > 0) {
      let sum = 0;
      data.forEach((item) => {
        let price = parseInt(item.price);
        let qty = parseInt(item.quantity);
        sum = sum + price * qty;
      });
      return sum;
    } else {
      return 0;
    }
  }
  function setListItems() {
    let removedItems = rowsData.data.map((item) => item.name);
    let itemList = inventoryData.map((item) => item.ItemName);
    itemList = itemList.filter((item) => {
      return !removedItems.includes(item);
    });
    setInventoryOptions(itemList);
  }

  function addRow() {
    let newData = rowsData.data;
    newData.push({
      id: "",
      name: "",
      qty: "",
      price: "",
    });
    setRowsData({ rowNumber: rowsData.rowNumber + 1, data: newData });
  }
  function removeRow(index) {
    let newData = rowsData.data;
    newData.splice(index, 1);
    setRowsData({ rowNumber: rowsData.rowNumber - 1, data: newData });
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Transactions" />
      <Button
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          marginRight: "10px",
        }}
        variant="contained"
        color="info"
        onClick={() => {
          setModalStatus(true);
          setInventoryOptions((prev) => {
            let list = inventoryData.map((item) => item.ItemName);
            return list;
          });
        }}
      >
        Create Transaction
      </Button>
      <GridComponent
        dataSource={parentData} //TODO
        enableHover={false}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionsettings}
        toolbar={["Search"]}
        allowSorting
        childGrid={{
          columns: [
            {
              field: "itemId",
              headerText: "ID",
              textAlign: "Center",
              width: "50",
            },
            {
              field: "itemName",
              headerText: "Item Name",
              textAlign: "Center",
              width: "100",
            },
            {
              field: "quantity",
              headerText: "Quantity",
              width: "80",
            },
            { field: "price", headerText: "Unit Price", width: "80" },
            { field: "sumPrice", headerText: "Sum Price", width: "100" },
          ],
          queryString: "txnId",
          dataSource: childData,
        }}
      >
        <ColumnsDirective>
          {transactionsGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
      </GridComponent>

      {/* Model for creating Transaction */}
      <Dialog
        open={modalStatus}
        onClose={() => {
          setModalStatus(false);
        }}
      >
        <div
          style={{
            paddingTop: "10px",
            paddingLeft: "20px",
            paddingBottom: "20px",
            paddingRight: "20px",
          }}
        >
          <DialogTitle align="center">Create Transaction</DialogTitle>
          <div style={{ width: "500px" }}></div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p>Enter transaction details below.</p>
            <br></br>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                Transaction Type
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                row
                name="radio-buttons-group"
                onChange={(e) => {
                  // console.log(e.target.value);
                }}
              >
                <FormControlLabel
                  value="In"
                  control={<Radio />}
                  label="Stock In"
                />
                <FormControlLabel
                  value="Out"
                  control={<Radio />}
                  label="Stock Out"
                />
              </RadioGroup>
            </FormControl>
            <br />
            <TextField
              id="desc"
              required
              error={false}
              helperText={""}
              label="Desciption"
              margin="dense"
              value={""}
              onChange={(e) => {}}
            />
            {rowsData.data.map((item, index) => {
              if (index === 0) {
                return (
                  // Todo:
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Stack
                      spacing={2}
                      width="100%"
                      style={{ paddingRight: "5px" }}
                    >
                      <Autocomplete
                        options={inventoryOptions}
                        renderInput={(params) => (
                          <TextField {...params} label="Items" />
                        )}
                        value={rowsData.data[index].name}
                        onClick={(e) => {
                          // console.log(e);
                        }}
                        onChange={(e, value) => {
                          // console.table(inventoryOptions);
                          let matchedRecord = inventoryData.find((item) => {
                            if (item.ItemName === value) return item;
                          });
                          let newOptions = inventoryOptions.find((item) => {
                            if (item !== value) return item;
                          });
                          let newData = rowsData.data;
                          newData[index].name = value;
                          newData[index].id = matchedRecord?.Id;
                          setRowsData({
                            rowNumber: rowsData.rowNumber,
                            data: newData,
                          });
                        }}
                      />
                    </Stack>
                    <TextField
                      id="qty"
                      required
                      style={{ paddingRight: "5px" }}
                      error={false}
                      helperText={""}
                      label="Quantity"
                      margin="dense"
                      value={""}
                      onChange={(e) => {}}
                    />
                    <TextField
                      id="price"
                      required
                      style={{ paddingRight: "5px" }}
                      error={false}
                      helperText={""}
                      label="Unit Price"
                      margin="dense"
                      value={""}
                      onChange={(e) => {}}
                    />

                    <IconButton
                      color="primary"
                      aria-label="add to shopping cart"
                      onClick={addRow}
                    >
                      <AddIcon />
                    </IconButton>
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Stack
                    spacing={2}
                    width="100%"
                    style={{ paddingRight: "5px" }}
                  >
                    <Autocomplete
                      options={inventoryOptions}
                      renderInput={(params) => (
                        <TextField {...params} label="Items" />
                      )}
                      value={rowsData.data[index].name}
                      onChange={(e, value) => {
                        let matchedRecord = inventoryData.find((e) => {
                          if (e.ItemName === value) return e;
                        });
                        let newData = rowsData.data;
                        newData[index].name = value;
                        newData[index].id = matchedRecord?.Id;
                        setRowsData({
                          rowNumber: rowsData.rowNumber,
                          data: newData,
                        });
                      }}
                    />
                  </Stack>
                  <TextField
                    id="qty"
                    required
                    style={{ paddingRight: "5px" }}
                    error={false}
                    helperText={""}
                    label="Quantity"
                    margin="dense"
                    value={""}
                    onChange={(e) => {}}
                  />
                  <TextField
                    id="price"
                    required
                    style={{ paddingRight: "5px" }}
                    error={false}
                    helperText={""}
                    label="Unit Price"
                    margin="dense"
                    value={""}
                    onChange={(e) => {}}
                  />

                  <IconButton
                    color="primary"
                    aria-label="add to shopping cart"
                    onClick={() => {
                      removeRow(index);
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </div>
              );
            })}
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // console.log(rowsData);
              }}
            >
              Update
            </Button>
            <Button
              variant="contained"
              width="100%"
              style={{
                background: "#808080",
                color: "#fff",
                marginTop: "10px",
              }}
              onClick={() => {
                setModalStatus(false);
                // clearStates();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Transactions;
