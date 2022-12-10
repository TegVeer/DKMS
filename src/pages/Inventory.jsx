import React, { useEffect, useState } from "react";
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
import "../styles/inventory.css";
import { inventoryData, inventoryGrid } from "../data/dummy";
import { Header } from "../components";
import {
  MenuItem,
  TextField,
  DialogTitle,
  Dialog,
  Button,
  Stack,
  Autocomplete,
  Alert,
  AlertTitle,
} from "@mui/material";

const qtyUnits = [
  { value: "pkt", label: "pkt" },
  { value: "kg", label: "kg" },
  { value: "gm", label: "gm" },
  { value: "ltr", label: "ltr" },
  { value: "carton", label: "carton" },
  { value: "bag", label: "bag" },
  { value: "box", label: "box" },
];

let alertData = { title: "", msg: "" };
const Inventory = () => {
  const [data, setData] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [alertStatus, setAlertStatus] = useState({
    visible: false,
    type: "success",
    msg: "Item added to the record.",
    title: "Success!",
  });
  const [addItemData, setAddItemData] = useState({
    name: "",
    unit: "",
    stock_qty: "",
    min_qty: "",
    expiry: " ",
    vendor: "",
  });
  const [addModalErrors, setAddModalErrors] = useState({
    nameError: "",
    nameErrorStatus: false,
    unitError: "",
    unitErrorStatus: false,
    stockError: "",
    stockErrorStatus: false,
  });
  const [editItemData, setEditItemData] = useState({
    id: "",
    name: "",
    unit: "",
    stock_qty: "",
    min_qty: "",
    expiry: " ",
    vendor: "",
  });
  const [editModalErrors, setEditModalErrors] = useState({
    nameError: "",
    nameErrorStatus: false,
    unitError: "",
    unitErrorStatus: false,
    stockError: "",
    stockErrorStatus: false,
  });
  const [deletItemData, setDeletItemData] = useState({
    dataObj: {},
    deleteField: "",
    disabled: true,
  });
  const [editSelectItems, setEditSelectItems] = useState("");
  const [deleteSelectItems, setDeleteSelectItems] = useState("");
  const selectionsettings = { persistSelection: true };
  const toolbarOptions = ["Search"];

  function getTodayDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    return today;
  }

  function clearStates() {
    setAddItemData({
      name: "",
      unit: "",
      stock_qty: "",
      min_qty: "",
      expiry: " ",
      vendor: "",
    });
    setAddModalErrors({
      nameError: "",
      nameErrorStatus: false,
      unitError: "",
      unitErrorStatus: false,
      stockError: "",
      stockErrorStatus: false,
    });
    setEditItemData({
      id: "",
      name: "",
      unit: "",
      stock_qty: "",
      min_qty: "",
      expiry: " ",
      vendor: "",
    });
    setEditModalErrors({
      nameError: "",
      nameErrorStatus: false,
      unitError: "",
      unitErrorStatus: false,
      stockError: "",
      stockErrorStatus: false,
    });
    setEditSelectItems("");
    setDeleteSelectItems("");
    setDeletItemData({
      dataObj: {},
      deleteField: "",
      disabled: true,
    });
  }

  function addRecord() {
    const { name, unit, stock_qty } = addItemData;

    if (name === "") {
      setAddModalErrors((prev) => {
        return {
          ...prev,
          nameError: "Field is Required!",
          nameErrorStatus: true,
        };
      });
    }
    if (unit === "") {
      setAddModalErrors((prev) => {
        return {
          ...prev,
          unitError: "Field is Required!",
          unitErrorStatus: true,
        };
      });
    }
    if (stock_qty === "") {
      setAddModalErrors((prev) => {
        return {
          ...prev,
          stockError: "Field is Required!",
          stockErrorStatus: true,
        };
      });
    }
    if (name !== "" && unit !== "" && stock_qty !== "") {
      console.log("Test Passes");
      let data = {
        item_name: addItemData.name,
        unit: addItemData.unit,
        stock_qty: addItemData.stock_qty,
        threshold_qty: addItemData.min_qty,
        exp_date: addItemData.expiry,
        last_update: getTodayDate(),
        update_by: "NAN",
        vendor: addItemData.vendor,
      };
      service.addInventoryItem(data).then((res) => {
        setAddModal(false);
        if (res.data) {
          alertData = {
            title: "Success!",
            msg: "Item Added Successfully.",
          };
          setAlertStatus({
            type: "success",
          });
          showAlert();
          loadData();
          clearStates();
        }
      });
    }
  }

  function editRecord() {
    //Validation on the fields
    const { id, name, unit, stock_qty, min_qty, vendor, expiry } = editItemData;
    console.log(name, unit, stock_qty);

    if (name === "") {
      setEditModalErrors((prev) => {
        return {
          ...prev,
          nameError: "Field is Required!",
          nameErrorStatus: true,
        };
      });
    }
    if (unit === "") {
      setEditModalErrors((prev) => {
        return {
          ...prev,
          unitError: "Field is Required!",
          unitErrorStatus: true,
        };
      });
    }
    if (stock_qty === "") {
      setEditModalErrors((prev) => {
        return {
          ...prev,
          stockError: "Field is Required!",
          stockErrorStatus: true,
        };
      });
    }

    if (id !== "" && name !== "" && unit !== "" && stock_qty !== "") {
      let data = {
        item_name: name,
        unit,
        stock_qty,
        threshold_qty: min_qty,
        exp_date: expiry,
        last_update: getTodayDate(),
        update_by: "NAN",
        vendor,
      };
      service.updateInventoryItem(id, data).then((res) => {
        setEditModal(false);
        if (res.data) {
          alertData = {
            title: "Success!",
            msg: "Item Updated Successfully.",
          };
          setAlertStatus({
            type: "success",
          });
          showAlert();
          loadData();
          clearStates();
        }
      });
    }
  }

  function deleteRecord() {
    service.deleteInventoryItem(deletItemData.dataObj.Id).then((res) => {
      setDeleteModal(false);
      if (res.data) {
        alertData = {
          title: "Success!",
          msg: "Item Deleted Successfully.",
        };
        setAlertStatus({
          type: "error",
        });
        showAlert();
        loadData();
        clearStates();
      }
    });
  }
  function showAlert() {
    setAlertStatus({ visible: true });
    setTimeout(() => {
      setAlertStatus({ visible: false });
      console.log("Alert should be closed");
    }, 4000);
  }

  function loadData() {
    service.getInventoryData().then((obj) => {
      console.log(obj);
      let items = obj.data;
      let dataList = [];
      items.forEach((element) => {
        dataList.push({
          Id: element.id,
          ItemName: element.attributes.item_name,
          Quantity: `${element.attributes.stock_qty} ${element.attributes.unit}`,
          Stock: element.attributes.stock_qty,
          Unit: element.attributes.unit,
          Threshold: element.attributes.threshold_qty,
          LastUpdate: element.attributes.last_update,
          UpdatedBy: element.attributes.update_by,
          ExpiryDate: element.attributes.exp_date,
          StockStatus:
            element.attributes.threshold_qty > element.attributes.stock_qty
              ? "LOW"
              : "GOOD",
          Vendor: element.attributes.vendor,
        });
      });
      setData(dataList);
    });
  }
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Inventory" />
      {alertStatus.visible && (
        <Alert severity={alertStatus.type}>
          <AlertTitle>{alertData.title}</AlertTitle>
          {alertData.msg}
        </Alert>
      )}
      <Button
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          marginRight: "10px",
        }}
        variant="contained"
        color="success"
        onClick={() => {
          setAddModal(true);
        }}
      >
        Add Item
      </Button>
      <Button
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          marginRight: "10px",
        }}
        variant="contained"
        color="primary"
        onClick={() => {
          setEditModal(true);
        }}
      >
        Edit Item
      </Button>
      <Button
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          marginRight: "10px",
        }}
        variant="contained"
        color="error"
        onClick={() => {
          setDeleteModal(true);
        }}
      >
        Delete Item
      </Button>
      <Button
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          marginRight: "10px",
        }}
        variant="contained"
        color="secondary"
        onClick={() => {
          setCategoryModal(true);
        }}
      >
        Categories
      </Button>
      <div className="m-2"></div>
      <GridComponent
        dataSource={data}
        enableAdaptiveUI={false}
        allowFiltering={true}
        filterSettings={{ type: "Menu", ignoreAccent: true }}
        enableHover={false}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionsettings}
        toolbar={toolbarOptions}
        allowSorting
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {inventoryGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Sort, Filter]} />
      </GridComponent>

      {/* Modal for adding records */}
      <Dialog
        open={addModal}
        onClose={() => {
          setAddModal(false);
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
          <DialogTitle align="center">Add Inventory Item</DialogTitle>
          <div style={{ width: "500px" }}></div>
          <p>Enter details to add new item.</p>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              id="item_name"
              required
              error={addModalErrors.nameErrorStatus}
              helperText={addModalErrors.nameError}
              label="Item Name"
              margin="dense"
              value={addItemData.name}
              onChange={(e) => {
                setAddItemData((prev) => {
                  return { ...prev, name: e.target.value };
                });
              }}
            />
            <TextField
              id="qty_unit"
              error={addModalErrors.unitErrorStatus}
              helperText={addModalErrors.unitError}
              required
              select
              value={addItemData.unit}
              onChange={(e) => {
                setAddItemData((prev) => {
                  return { ...prev, unit: e.target.value };
                });
              }}
              label="Qty Unit"
              margin="dense"
            >
              {qtyUnits.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="stock_quantity"
              required
              error={addModalErrors.stockErrorStatus}
              helperText={addModalErrors.stockError}
              label="Stock Quantity"
              margin="dense"
              type="number"
              value={addItemData.stock_qty}
              onChange={(e) => {
                setAddItemData((prev) => {
                  return { ...prev, stock_qty: e.target.value };
                });
              }}
            />
            <TextField
              id="minimum_qty"
              label="Minimum Quantity"
              value={addItemData.min_qty}
              onChange={(e) => {
                setAddItemData((prev) => {
                  return { ...prev, min_qty: e.target.value };
                });
              }}
              margin="dense"
              type="number"
            />
            <TextField
              id="expiry_date"
              label="Expiry"
              margin="dense"
              value={addItemData.expiry}
              onChange={(e) => {
                console.log(e.target.value);
                setAddItemData((prev) => {
                  return { ...prev, expiry: e.target.value };
                });
              }}
              type="date"
            />
            <TextField
              id="vendor_name"
              label="Vendor"
              margin="dense"
              value={addItemData.vendor}
              onChange={(e) => {
                setAddItemData((prev) => {
                  return { ...prev, vendor: e.target.value };
                });
              }}
              type="text"
            />
            <br />
            <Button
              variant="contained"
              width="100%"
              color="success"
              onClick={addRecord}
            >
              Add Item
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
                setAddModal(false);
                clearStates();
              }}
            >
              Cancel
            </Button>
          </div>

          <div className="mb-4"></div>
        </div>
      </Dialog>
      {/* Modal for editing records */}
      <Dialog
        open={editModal}
        onClose={() => {
          setEditModal(false);
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
          <DialogTitle align="center">Edit Inventory Item</DialogTitle>
          <div style={{ width: "500px" }}></div>
          <p>Search the item name to edit that record.</p>
          <br></br>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Stack spacing={2} width="100%">
              <Autocomplete
                options={data.map((item) => item.ItemName)}
                renderInput={(params) => (
                  <TextField {...params} label="Items" />
                )}
                value={editSelectItems}
                onChange={(e, value) => {
                  setEditSelectItems(value);
                  let itemObj = data.find((item) => {
                    if (item.ItemName === value) return item;
                  });
                  setEditItemData({
                    id: itemObj.Id,
                    name: itemObj.ItemName,
                    unit: itemObj.Unit,
                    stock_qty: itemObj.Stock,
                    min_qty: itemObj.Threshold,
                    expiry: itemObj.ExpiryDate,
                    vendor: itemObj.Vendor,
                  });
                }}
              />
            </Stack>
            <br></br>
            <p>Edit item details</p>
            <br></br>
            <TextField
              id="item_id"
              required
              label="Item Id"
              margin="dense"
              disabled
              value={editItemData.id}
            />
            <TextField
              id="item_name"
              required
              error={editModalErrors.nameErrorStatus}
              helperText={editModalErrors.nameError}
              label="Item Name"
              margin="dense"
              value={editItemData.name}
              onChange={(e) => {
                setEditItemData((prev) => {
                  return { ...prev, name: e.target.value };
                });
              }}
            />
            <TextField
              id="quty_unit"
              required
              select
              error={editModalErrors.unitErrorStatus}
              helperText={editModalErrors.unitError}
              value={editItemData.unit}
              onChange={(e) => {
                setEditItemData((prev) => {
                  return { ...prev, unit: e.target.value };
                });
              }}
              label="Qty Unit"
              margin="dense"
            >
              {qtyUnits.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="stock_quantity"
              required
              error={editModalErrors.stockErrorStatus}
              helperText={editModalErrors.stockError}
              label="Stock Quantity"
              margin="dense"
              type="number"
              value={editItemData.stock_qty}
              onChange={(e) => {
                setEditItemData((prev) => {
                  return { ...prev, stock_qty: e.target.value };
                });
              }}
            />
            <TextField
              id="threshold_qty"
              label="Threshold Quantity"
              value={editItemData.min_qty}
              onChange={(e) => {
                setEditItemData((prev) => {
                  return { ...prev, min_qty: e.target.value };
                });
              }}
              margin="dense"
              type="number"
            />
            <TextField
              id="expiry_date"
              label="Expiry"
              margin="dense"
              value={editItemData.expiry}
              onChange={(e) => {
                setEditItemData((prev) => {
                  return { ...prev, expiry: e.target.value };
                });
              }}
              type="date"
            />
            <TextField
              id="vendor_name"
              label="Vendor"
              margin="dense"
              value={editItemData.vendor}
              onChange={(e) => {
                setEditItemData((prev) => {
                  return { ...prev, vendor: e.target.value };
                });
              }}
              type="text"
            />
            <br />
            <Button variant="contained" color="primary" onClick={editRecord}>
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
                setEditModal(false);
                clearStates();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
      {/* Modal for deleting records */}
      <Dialog
        open={deleteModal}
        onClose={() => {
          setDeleteModal(false);
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
          <DialogTitle align="center">Delete Inventory Item</DialogTitle>
          <div style={{ width: "500px" }}></div>
          <p>Search the item name to delete record.</p>
          <br></br>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Stack spacing={2} width="100%">
              <Autocomplete
                options={data.map((item) => item.ItemName)}
                renderInput={(params) => (
                  <TextField {...params} label="Items" />
                )}
                value={deleteSelectItems}
                onChange={(e, value) => {
                  setDeleteSelectItems(value);
                  let itemObj = data.find((item) => {
                    if (item.ItemName === value) return item;
                  });
                  setDeletItemData((prev) => ({ ...prev, dataObj: itemObj }));
                }}
              />
            </Stack>
            <br></br>
            <p>Enter "DELETE" in the box below to confirm.</p>
            <br></br>
            <TextField
              id="confirm_field"
              required
              label=""
              margin="dense"
              value={deletItemData.deleteField}
              onChange={(e) => {
                setDeletItemData((prev) => {
                  return { ...prev, deleteField: e.target.value };
                });
                if (e.target.value === "DELETE" && deleteSelectItems !== "") {
                  setDeletItemData((prev) => ({ ...prev, disabled: false }));
                } else {
                  setDeletItemData((prev) => ({ ...prev, disabled: true }));
                }
              }}
            />
            <br />
            <Button
              variant="contained"
              color="error"
              onClick={deleteRecord}
              disabled={deletItemData.disabled}
            >
              Delete Item
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
                setDeleteModal(false);
                clearStates();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Modal for Categories */}
      <Dialog
        open={categoryModal}
        onClose={() => {
          setCategoryModal(false);
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
          <DialogTitle align="center">Add or Remove Categories</DialogTitle>
          <div style={{ width: "500px" }}></div>
          <p>Search Category to Remove</p>
          <br></br>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Stack spacing={2} width="100%">
              <Autocomplete
                options={data.map((item) => item.ItemName)}
                renderInput={(params) => (
                  <TextField {...params} label="Category List" />
                )}
                value={"Select"}
                onChange={(e, value) => {}}
              />
            </Stack>
            <br />
            <Button variant="contained" color="error" onClick={addRecord}>
              Remove Category
            </Button>
            <br></br>
            <p>
              If you can't find a category in search list. You can add one
              below.
            </p>
            <br></br>
            <TextField
              id="confirm_field"
              required
              label="Category Name"
              margin="dense"
              value={""}
              onChange={(e) => {}}
            />
            <br />
            <Button variant="contained" color="success" onClick={addRecord}>
              Add Category
            </Button>
            <Button
              variant="contained"
              width="100%"
              style={{
                background: "#808080",
                color: "#fff",
                marginTop: "10px",
              }}
              onClick={() => {}}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Inventory;
