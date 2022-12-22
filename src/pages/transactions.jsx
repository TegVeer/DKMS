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
import TnxTypeSymbol from "../bitsComponents/tnxTypeSymbol";
const transactionsGrid = [
  { field: "tnxId", headerText: "Tnx ID", width: "100", textAlign: "Center" },
  {
    headerText: "Tnx Type",
    width: "150",
    template: TnxTypeSymbol,
    textAlign: "Center",
  },
  {
    field: "desc",
    headerText: "Description",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "by",
    headerText: "Tnx By",
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

const transactionsData = [
  {
    tnxId: 1001,
    desc: "MorningPrasadam",
    type: "OUT",
    date: "20/12/2022",
    by: "Tegveer Singh",
    totalPrice: "Rs.500",
  },
  {
    tnxId: 1002,
    desc: "Ration Shopping",
    type: "IN",
    date: "20/12/2022",
    by: "Tegveer Singh",
    totalPrice: "Rs.4232",
  },
  {
    tnxId: 1003,
    desc: "Return from FFL",
    type: "IN",
    date: "20/12/2022",
    by: "Tegveer Singh",
    totalPrice: "Rs.5800",
  },
];

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
  const [tableData, setTableData] = useState([
    {
      type: "IN",
      desc: "Something here",
      tnxBy: "Tegveer",
      date: "Some date",
      totalPrice: "5000",
    },
  ]);

  useEffect(() => {
    service.getInventoryTnx();
  }, []);
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
        dataSource={transactionsData} //TODO
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
              field: "name",
              headerText: "Item Name",
              textAlign: "Center",
              width: "100",
            },
            {
              field: "qty",
              headerText: "Quantity",
              width: "80",
            },
            { field: "price", headerText: "Unit Price", width: "80" },
            { field: "sumPrice", headerText: "Sum Price", width: "100" },
          ],
          queryString: "tnxId",
          dataSource: [
            {
              tnxId: 1002,
              itemId: 1,
              name: "Rice",
              qty: "50",
              price: "40",
              sumPrice: 2000,
            },
          ],
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
