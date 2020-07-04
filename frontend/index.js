import {
  initializeBlock,
  useBase,
  useRecords,
  expandRecord,
  TextButton,
  TablePickerSynced,
  useGlobalConfig,
} from "@airtable/blocks/ui";
import React, { useState } from "react";

// If you want to get the cell values from other fields,
// you can use record.getCellValue() or record.getCellValueAsString().

function TodoBlock() {
  const base = useBase();
  const globalConfig = useGlobalConfig();
  const tableId = globalConfig.get("selectedTableId");
  const table = base.getTableByIdIfExists(tableId);
  const records = useRecords(table);
  //  const [tableId, setTableId] = useState(null)

  const tasks = records
    ? records.map((record) => <Task key={record.id} record={record} />)
    : null;

  return (
    <div>
      {/* <TablePicker
        table={table}
        onChange={(newTable) => {
          //   setTableId(newTable.id);
          globalConfig.setAsync("selectedTableId", newTable.id);
        }}
      /> */}
      <TablePickerSynced globalConfigKey="selectedTableId" />
      {tasks}
    </div>
  );
}

function Task({ record }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 18,
        padding: 12,
        borderBottom: "1px solid #ddd",
      }}
    >
      {record.name || "Unnamed record"}{" "}
      <TextButton
        icon="expand"
        aria-label="Expand record"
        variant="dark"
        onClick={() => {
          expandRecord(record);
        }}
      />
    </div>
  );
}

initializeBlock(() => <TodoBlock />);
