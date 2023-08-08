import React, { SyntheticEvent } from 'react';
import axios from 'axios';
import { config } from '../config';

export default function ImgurUploader(){
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>){
    if(event.target.files){
      setSelectedFile( event.target.files[0]);
    }
  }

  async function handleUpload(){
    if (!selectedFile){
      return;
    }
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(
        'https://api.imgur.com/3/upload',
        formData,
        {
          headers: {
            Authorization: `Client-ID ${config.imgurID}`,
          },
        }
      );
        
      console.log('Image uploaded:', response.data.data.link);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  // Work around to ensure a void return is provided to the Onclick attribute instead of a promise
  const handleUploadChange = (e: SyntheticEvent) => {
    e.preventDefault();
    void handleUpload();
}

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUploadChange}>Upload</button>
    </div>
  );
}