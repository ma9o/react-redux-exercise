import { Theme } from '@material-ui/core';

export const myTableStyles = (theme: Theme) => ({
  paperRoot: {
    margin: 'auto',
    width: 'min-content'
  },
  lookupEditCell: {
    paddingTop: theme.spacing.unit * 0.875,
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit
  },
  dialog: {
    width: 'calc(100% - 16px)'
  },
  inputRoot: {
    width: '100%'
  }
});

export const dictionaryDetailsStyles = (theme: Theme) => ({
  detailContainer: {
    margin: '20px'
  },
  title: {
    color: theme.palette.text.primary,
    fontSize: theme.typography.fontSize,
    width: '100%'
  }
});
