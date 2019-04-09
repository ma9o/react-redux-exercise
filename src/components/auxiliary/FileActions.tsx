import * as React from 'react';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';

export const Downloader = ({ handleDownload }: any) => {
  return (
    <IconButton
      title="Download CSV"
      style={{ height: 'fit-content' }}
      onClick={handleDownload}
    >
      <CloudDownloadIcon />
    </IconButton>
  );
};

export const Uploader = ({ handleUpload }: any) => {
  return (
    <IconButton
      title="Upload CSV"
      style={{ height: 'fit-content' }}
      component="label"
    >
      <CloudUploadIcon />
      <input
        id="upload"
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
    </IconButton>
  );
};
