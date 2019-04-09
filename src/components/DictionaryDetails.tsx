import * as Ajv from 'ajv';
import * as React from 'react';
import Papa from 'papaparse';
import {
  ChangeSet,
  EditingState,
  IntegratedPaging,
  IntegratedSorting,
  PagingState,
  Sorting,
  SortingState
} from '@devexpress/dx-react-grid';
import { Command, EditCell } from './auxiliary/Modifiers';
import { compareErrors } from '../utils/utils';
import { Dictionary, Pair, schema } from '../utils/types';
import { dictionaryDetailsStyles } from '../utils/styles';
import { Downloader, Uploader } from './auxiliary/FileActions';
import { ErrorTypeProvider } from './auxiliary/ErrorTypeProvider';
import {
  Grid,
  PagingPanel,
  Table,
  TableEditColumn,
  TableEditRow,
  TableFixedColumns,
  TableHeaderRow
} from '@devexpress/dx-react-grid-material-ui';
import { Paper, withStyles } from '@material-ui/core';
import { saveAs } from 'file-saver';
import { v4 as uuid } from 'uuid';

interface Props {
  row: Dictionary;
  classes: any;
  handleChange: any;
}

interface State {
  sorting: Sorting[];
  editingRowIds: React.ReactText[];
  addedRows: Pair[];
  rowChanges: { [key: string]: any };
  currentPage: number;
  pageSize: number;
  pageSizes: number[];
}

const columnExtensions = [
  { columnName: 'key', width: 180 },
  { columnName: 'value', width: 180 },
  { columnName: 'errors', width: 115, editingEnabled: false }
];

const columns = [
  { name: 'key', title: 'Key' },
  { name: 'value', title: 'Value' },
  { name: 'errors', title: 'Errors', getCellValue: (row: Pair) => row.errors }
];

const errorParser = {
  cycle(row: Pair) {
    return row.errors.cycle;
  },
  chain(row: Pair) {
    return row.errors.chain;
  },
  fork(row: Pair) {
    return row.errors.fork;
  },
  duplicate(row: Pair) {
    return row.errors.duplicate;
  }
};

class DictionaryDetails extends React.Component<Props, State> {
  handleSorting = (sorting: Sorting[]) => this.setState({ sorting });

  handleEditingRowIds = (editingRowIds: React.ReactText[]) =>
    this.setState({ editingRowIds });
  handleCurrentPage = (currentPage: number) => this.setState({ currentPage });
  handlePageSize = (pageSize: number) => this.setState({ pageSize });
  handleRowChanges = (rowChanges: { [key: string]: any }) =>
    this.setState({ rowChanges });
  handleAddedRows = (addedRows: Pair[]) =>
    this.setState({
      addedRows: addedRows.map(row =>
        Object.keys(row).length
          ? row
          : {
              id: uuid(),
              key: 'New value',
              value: 'New entry',
              errors: {
                cycle: false,
                chain: false,
                fork: false,
                duplicate: false
              }
            }
      )
    });
  handleCommitChanges = (changeSet: ChangeSet) => {
    let { added, changed, deleted } = changeSet;
    let { handleChange, row } = this.props;
    let newDict: Dictionary = { id: '', name: '', data: [] };
    if (added) {
      row.data.unshift(...added);
      newDict = row;
    }
    if (changed) {
      newDict = {
        ...row,
        data: row.data.map((pair, i) =>
          (changed as { [key: string]: any })[i]
            ? { ...pair, ...(changed as { [key: string]: any })[i] }
            : pair
        )
      };
    }
    if (deleted) {
      deleted.map(pair => {
        row.data.splice(pair as number, 1);
      });
      newDict = row;
    }
    handleChange({ [newDict.id]: newDict });
  };
  handleUpload = (event: any) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: res => {
        try {
          new Ajv().validate(schema, res.data);
          this.handleCommitChanges({ added: res.data });
        } catch (e) {
          alert('Invalid schema');
          window.console.warn(e, res.data);
        }
      }
    });
  };

  handleDownload = () => {
    const { row } = this.props;
    const csv = Papa.unparse(row.data);
    saveAs(
      new Blob([csv], { type: 'text/plain;charset=utf-8' }),
      row.name + '.csv'
    );
  };

  state = {
    editingRowIds: [],
    rowChanges: {},
    addedRows: [],
    sorting: [],
    currentPage: 0,
    pageSize: 10,
    pageSizes: [5, 10, 15]
  };

  render() {
    const { classes, row } = this.props;
    const {
      editingRowIds,
      rowChanges,
      addedRows,
      sorting,
      currentPage,
      pageSize,
      pageSizes
    } = this.state;

    return (
      <div className={classes.detailContainer}>
        <div style={{ display: 'inline-flex', width: '100%' }}>
          <h5 className={classes.title}>{row.name}</h5>
          <Uploader handleUpload={this.handleUpload} />
          <Downloader handleDownload={this.handleDownload} />
        </div>
        <Paper>
          <Grid rows={row.data} columns={columns}>
            <SortingState
              sorting={sorting}
              onSortingChange={this.handleSorting}
            />
            <PagingState
              currentPage={currentPage}
              onCurrentPageChange={this.handleCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={this.handlePageSize}
            />

            <EditingState
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={this.handleEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={this.handleRowChanges}
              addedRows={addedRows}
              onAddedRowsChange={this.handleAddedRows}
              onCommitChanges={this.handleCommitChanges}
              columnExtensions={columnExtensions}
            />
            <IntegratedSorting
              columnExtensions={[
                { columnName: 'errors', compare: compareErrors }
              ]}
            />
            <IntegratedPaging />

            <Table columnExtensions={columnExtensions} />
            <ErrorTypeProvider
              for={['errors']}
              base={'This entry is part of a '}
              errorParser={errorParser}
            />

            <TableEditRow cellComponent={EditCell} />
            <TableEditColumn
              width={170}
              showAddCommand={!addedRows.length}
              showEditCommand
              showDeleteCommand
              commandComponent={Command}
            />

            <TableHeaderRow showSortingControls />
            <TableFixedColumns leftColumns={[TableEditColumn.COLUMN_TYPE]} />
            <PagingPanel pageSizes={pageSizes} />
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(dictionaryDetailsStyles)(DictionaryDetails);
