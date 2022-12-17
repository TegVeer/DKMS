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

import { customersData, customersGrid } from "../data/dummy";
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

const transcationType = [
  { label: "IN", value: "IN" },
  { label: "OUT", value: "OUT" },
];

let selectedItems = [];

const Transactions = () => {
  const { inventoryData } = useStateContext();
  const [inventoryOptions, setInventoryOptions] = useState([]);
  // let inventoryOptions = inventoryData;
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

  useEffect(() => {}, []);
  useEffect(() => {
    console.info("set called");
    setListItems();
  }, [rowsData]);
  function setListItems() {
    console.log("Data object", rowsData.data);
    let removedItems = rowsData.data.map((item) => item.name);
    console.log("Removable Items", removedItems);
    let itemList = inventoryData.map((item) => item.ItemName);
    console.log("Total Items", itemList);
    itemList = itemList.filter((item) => {
      return !removedItems.includes(item);
    });
    console.log("Removed Items", itemList);
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
        dataSource={[]}
        enableHover={false}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionsettings}
        toolbar={["Search"]}
        allowSorting
      >
        <ColumnsDirective>
          {customersGrid.map((item, index) => (
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
                  console.log(e.target.value);
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
                          console.log(e);
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
                console.log(rowsData);
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
                // setEditModal(false);
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
