import * as React from 'react';
import MyRowDetails from './DictionaryDetails';
import Paper from '@material-ui/core/Paper';
import { Cell, Command, EditCell } from './auxiliary/Modifiers';
import {
  ChangeSet,
  EditingState,
  IntegratedPaging,
  IntegratedSorting,
  PagingState,
  RowDetailState,
  Sorting,
  SortingState
} from '@devexpress/dx-react-grid';
import { compareErrors } from '../utils/utils';
import { Dictionary, MyActions, Pair } from '../utils/types';
import {
  DragDropProvider,
  Grid,
  PagingPanel,
  Table,
  TableColumnReordering,
  TableEditColumn,
  TableEditRow,
  TableFixedColumns,
  TableHeaderRow,
  TableRowDetail
} from '@devexpress/dx-react-grid-material-ui';
import { ErrorTypeProvider } from './auxiliary/ErrorTypeProvider';
import { myTableStyles } from '../utils/styles';
import { v4 as uuid } from 'uuid';
import { withStyles } from '@material-ui/core/styles';

interface Props {
  rows: Dictionary[];
  actions: MyActions;
  classes: any;
}

interface State {
  sorting: Sorting[];
  editingRowIds: React.ReactText[];
  addedRows: Dictionary[];
  rowChanges: { [key: string]: any };
  currentPage: number;
  pageSize: number;
  pageSizes: number[];
  columnOrder: string[];
  expandedRowIds: React.ReactText[] | undefined;
  selection: React.ReactText[];
}

const columns = [
  { name: 'name', title: 'Name' },
  {
    name: 'size',
    title: 'Bytes (approx)',
    getCellValue: (row: Dictionary) =>
      row.data.reduce((accumulator: number, pair: Pair) => {
        return accumulator + pair.key.length * 2 + pair.value.length * 2;
      }, 0)
  },
  {
    name: 'entries',
    title: 'Entries',
    getCellValue: (row: Dictionary) => row.data.length
  },
  {
    name: 'errors',
    title: 'Errors',
    getCellValue: (row: Dictionary) => ({
      cycle: row.data.find((x: Pair) => x.errors.cycle),
      duplicate: row.data.find((x: Pair) => x.errors.duplicate),
      fork: row.data.find((x: Pair) => x.errors.fork),
      chain: row.data.find((x: Pair) => x.errors.chain)
    })
  }
];

const columnExtensions = [
  { columnName: 'name', width: 180, editingEnabled: true },
  { columnName: 'size', width: 120, editingEnabled: false },
  { columnName: 'entries', width: 80, editingEnabled: false },
  { columnName: 'errors', width: 180, editingEnabled: false }
];

const errorParser = {
  cycle(row: Dictionary) {
    return row.data.find((x: Pair) => x.errors.cycle);
  },
  chain(row: Dictionary) {
    return row.data.find((x: Pair) => x.errors.chain);
  },
  fork(row: Dictionary) {
    return row.data.find((x: Pair) => x.errors.fork);
  },
  duplicate(row: Dictionary) {
    return row.data.find((x: Pair) => x.errors.duplicate);
  }
};

class DictionariesOverview extends React.Component<Props, State> {
  handleSelection = (selection: React.ReactText[]) =>
    this.setState({ selection });
  handleExpandedRowIds = (expandedRowIds: React.ReactText[] | undefined) =>
    this.setState({ expandedRowIds });
  handleSorting = (sorting: Sorting[]) => this.setState({ sorting });
  handleEditingRowIds = (editingRowIds: React.ReactText[]) =>
    this.setState({ editingRowIds });
  handleOrder = (order: string[]) => this.setState({ columnOrder: order });
  handleRowChanges = (rowChanges: { [key: string]: any }) =>
    this.setState({ rowChanges });
  handleCurrentPage = (currentPage: number) => this.setState({ currentPage });
  handlePageSize = (pageSize: number) => this.setState({ pageSize });
  handleAddedRows = (addedRows: Dictionary[]) =>
    this.setState({
      addedRows: addedRows.map(row =>
        Object.keys(row).length
          ? row
          : {
              id: uuid(),
              name: 'New dictionary',
              data: []
            }
      )
    });
  handleCommitChanges = (changeSet: ChangeSet) => {
    let { added, changed, deleted } = changeSet;
    let { actions } = this.props;
    if (added) {
      actions.addDict(added as Dictionary[]);
    }
    if (changed) {
      actions.editDict(changed);
    }
    if (deleted) {
      actions.deleteDict(deleted as string[]);
    }
  };

  state = {
    sorting: [],
    editingRowIds: [],
    addedRows: [],
    rowChanges: {},
    currentPage: 0,
    pageSize: 10,
    pageSizes: [5, 10, 15],
    columnOrder: ['name', 'size', 'entries', 'errors'],
    expandedRowIds: [],
    selection: []
  };

  render() {
    const {
      sorting,
      editingRowIds,
      addedRows,
      rowChanges,
      currentPage,
      pageSize,
      pageSizes,
      columnOrder,
      expandedRowIds
    } = this.state;

    const { rows, classes, actions } = this.props;

    return (
      <Paper className={classes.paperRoot}>
        <Grid rows={rows} columns={columns} getRowId={row => row.id}>
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
          <RowDetailState
            expandedRowIds={expandedRowIds}
            onExpandedRowIdsChange={this.handleExpandedRowIds}
          />

          <IntegratedSorting
            columnExtensions={[
              { columnName: 'errors', compare: compareErrors }
            ]}
          />
          <IntegratedPaging />
          <DragDropProvider />

          <ErrorTypeProvider
            for={['errors']}
            base={'This dictionary contains a '}
            errorParser={errorParser}
          />

          <Table columnExtensions={columnExtensions} cellComponent={Cell} />

          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.handleOrder}
          />
          <TableRowDetail
            contentComponent={({ row }) => (
              <MyRowDetails row={row} handleChange={actions.editDict} />
            )}
          />
          <TableHeaderRow showSortingControls />
          <TableEditRow cellComponent={EditCell} />
          <TableEditColumn
            width={170}
            showAddCommand={!addedRows.length}
            showEditCommand
            showDeleteCommand
            commandComponent={Command}
          />
          <TableFixedColumns leftColumns={[TableEditColumn.COLUMN_TYPE]} />
          <PagingPanel pageSizes={pageSizes} />
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(myTableStyles)(DictionariesOverview);
