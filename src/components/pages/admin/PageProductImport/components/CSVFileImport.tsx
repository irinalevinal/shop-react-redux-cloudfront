import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosRequestHeaders } from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

// const TOKEN_KEY = "authorization_token";
// const TOKEN_VALUE = "YOUR VALUE";
// localStorage.setItem(TOKEN_KEY, TOKEN_VALUE);

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | any>();

  const generateRequestHeaders = () => {
    const headers: AxiosRequestHeaders = {}
    const authorization_token = localStorage.getItem('authorization_token')
    if (authorization_token) {
      headers.Authorization = `Basic ${authorization_token}`
    }
    return headers
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    // Get the presigned URL
    const response = await axios({
      method: "GET",
      url,
      params: {
        name: encodeURIComponent(file?.name || ''),
      },
      headers: generateRequestHeaders()
    });
    console.log("File to upload: ", file?.name);
    console.log("Uploading to: ", response.data?.presignedUrl);
    const result = await fetch(response.data?.presignedUrl, {
      method: "PUT",
      body: file,
    });
    console.log("Result: ", result);
    setFile("");
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
