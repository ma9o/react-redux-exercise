import * as React from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { Button, IconButton } from '@material-ui/core';
import { Table, TableEditRow } from '@devexpress/dx-react-grid-material-ui';

export const AddButton = ({ onExecute }: any) => (
  <div style={{ textAlign: 'center' }}>
    <Button color="primary" onClick={onExecute} title="Create new row">
      New
    </Button>
  </div>
);

export const EditButton = ({ onExecute }: any) => (
  <IconButton onClick={onExecute} title="Edit row">
    <EditIcon />
  </IconButton>
);

export const DeleteButton = ({ onExecute }: any) => (
  <IconButton
    onClick={() => {
      // eslint-disable-next-line
      if (window.confirm('Are you sure you want to delete this row?')) {
        onExecute();
      }
    }}
    title="Delete row"
  >
    <DeleteIcon />
  </IconButton>
);

export const CommitButton = ({ onExecute }: any) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);

export const CancelButton = ({ onExecute }: any) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);

export const Command = ({ id, onExecute }: any) => {
  let CommandButton = commandComponents[id];
  return <CommandButton onExecute={onExecute} />;
};

export const Cell = (props: any) => {
  return <Table.Cell {...props} />;
};

export const EditCell = (props: any) => {
  return <TableEditRow.Cell {...props} />;
};

export const commandComponents: any = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton
};
