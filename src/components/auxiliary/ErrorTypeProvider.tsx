import * as React from 'react';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import LinkIcon from '@material-ui/icons/Link';
import LoopIcon from '@material-ui/icons/Loop';
import { DataTypeProvider } from '@devexpress/dx-react-grid';
import { Tooltip } from '@material-ui/core';

export const ErrorTypeProvider = (props: any) => {
  const { base, errorParser } = props;
  return (
    <DataTypeProvider
      formatterComponent={({ row }) => {
        return (
          <>
            <Tooltip title={base + 'cycle'}>
              <LoopIcon
                style={{
                  color: 'red',
                  display: errorParser.cycle(row) ? 'inline-block' : 'none'
                }}
              />
            </Tooltip>

            <Tooltip title={base + 'chain'}>
              <LinkIcon
                style={{
                  color: 'orange',
                  display: errorParser.chain(row) ? 'inline-block' : 'none'
                }}
              />
            </Tooltip>

            <Tooltip title={base + 'fork'}>
              <CallSplitIcon
                style={{
                  color: 'orange',
                  display: errorParser.fork(row) ? 'inline-block' : 'none'
                }}
              />
            </Tooltip>

            <Tooltip title={base + 'duplicate'}>
              <FilterNoneIcon
                style={{
                  color: 'orange',
                  display: errorParser.duplicate(row) ? 'inline-block' : 'none'
                }}
              />
            </Tooltip>
          </>
        );
      }}
      {...props}
    />
  );
};
