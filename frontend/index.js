import {
  initializeBlock,
  useBase,
  useRecords,
  expandRecord,
  TextButton,
  TablePickerSynced,
  useGlobalConfig,
  FieldPickerSynced,
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

  const completedFieldId = globalConfig.get("completedFieldId");
  const completedField = table
    ? table.getFieldByIdIfExists(completedFieldId)
    : null;

  const toggle = (record) => {
    table.updateRecordAsync(record, {
      [completedFieldId]: !record.getCellValue(completedFieldId),
    });
  };
  const tasks =
    records && completedFieldId
      ? records.map((record) => (
          <Task
            key={record.id}
            record={record}
            onToggle={toggle}
            completedFieldId={completedFieldId}
          />
        ))
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
      <FieldPickerSynced table={table} globalConfigKey="completedFieldId" />
      {tasks}
    </div>
  );
}

function Task({ record, completedFieldId, onToggle }) {
  const label = record.name || "Unnamed record";
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
      <TextButton
        variant="dark"
        size="xlarge"
        onClick={() => {
          onToggle(record);
        }}
      >
        {record.getCellValue(completedFieldId) ? <s>{label}</s> : label}{" "}
      </TextButton>
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
