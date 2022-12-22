import React, { useState, useEffect } from "react";
import { Chip } from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
function TnxTypeSymbol(props) {
  if (props.type === "IN")
    return <Chip icon={<ArchiveIcon />} color={"success"} label="IN" />;
  else if (props.type === "OUT")
    return <Chip icon={<UnarchiveIcon />} color={"error"} label="OUT" />;
  else return <p>NaN</p>;
}
export default TnxTypeSymbol;
