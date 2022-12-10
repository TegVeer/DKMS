import React from "react";
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
  DetailRow,
} from "@syncfusion/ej2-react-grids";

import { corsalData, corsalLinkData, corsalGrid } from "../data/dummy";
import { Header } from "../components";

const Customers = () => {
  const selectionsettings = { persistSelection: true };
  const toolbarOptions = ["Delete", "Add", "Edit", "Search"];
  const editing = {
    allowDeleting: true,
    allowEditing: true,
    allowAdding: true,
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Customers" />
      <GridComponent
        dataSource={corsalData}
        filterSettings={{ type: "Menu" }}
        allowFiltering
        allowPaging
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionsettings}
        toolbar={toolbarOptions}
        editSettings={editing}
        allowSorting
        childGrid={{
          columns: [
            {
              field: "OrderID",
              headerText: "Order ID",
              textAlign: "Right",
              width: 120,
            },
            { field: "CustomerID", headerText: "Customer ID", width: 150 },
            { field: "ShipCity", headerText: "Ship City", width: 150 },
            { field: "ShipName", headerText: "Ship Name", width: 150 },
          ],
          queryString: "EmployeeID",
          dataSource: corsalLinkData,
        }}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {/* {corsalGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))} */}
          <ColumnDirective
            field="EmployeeID"
            headerText="Employee ID"
            width="120"
            textAlign="Right"
          />
          <ColumnDirective
            field="FirstName"
            headerText="First Name"
            width="150"
          />
          <ColumnDirective field="City" headerText="City" width="150" />
          <ColumnDirective field="Country" headerText="Country" width="150" />
        </ColumnsDirective>
        <Inject
          services={[Page, Selection, Toolbar, Edit, Sort, Filter, DetailRow]}
        />
      </GridComponent>
    </div>
  );
};

export default Customers;
