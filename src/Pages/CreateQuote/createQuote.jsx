import React, { useEffect, useRef, useState } from "react";
import "./createQuote.css";
import { useNavigate } from "react-router-dom";
import { handleCreateQuote, handleUpload } from "../../services/api";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import NavBar from "../../Components/NavBar/navBar";

const CreateQuote = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); 
  const [isTextTouched, setIsTextTouched] = useState(false); 
  const [isFileTouched, setIsFileTouched] = useState(false); 
 
  const title ="Create Quote"

  const handleFileChange = (e) => {
    setIsFileTouched(true);
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile)); 
  };

  const triggerFileInput = () => {
    setIsFileTouched(true); 
    fileInputRef.current.click();
  };

  const upload = async () => {
    if (!file) return null; 
    const formData = new FormData();
    formData.append('file', file);
    const res = await handleUpload(formData);
    return res;
  };

  const createQuote = async () => {
    setIsTextTouched(true);
    setIsFileTouched(true);

    if (!text || !file) {
      return;
    }

    const mediaUrl = await upload();
    console.log("Uploaded media URL:", mediaUrl);

    const uploadquote = await handleCreateQuote(text, mediaUrl);
    navigate('/quotes');
  };

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <>
      <div className="create-quote-container">
        <NavBar title={title} />
        <div className="create-quote-body">
          <div className="card">
            <textarea
              value={text}
              style={{ width: "100%", minHeight: "150px" }}
              className="text-area"
              onChange={(e) => setText(e.target.value)}
              onBlur={() => setIsTextTouched(true)} // Set touched on blur
              placeholder="Enter quote text"
              required
            />
            {isTextTouched && !text && (
              <p className="error-message">Quote text is required.</p>
            )}

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              required
            />

            <div className="img-upload">
              {!filePreview ? (
                <button className="upload-image-button" onClick={triggerFileInput}>
                  <AddPhotoAlternateIcon className="add-photo-icon" />
                </button>
              ) : (
                <div className="img-preview">
                  <img className="image" src={filePreview} alt="Preview" />
                  <EditIcon className="edit-photo" onClick={triggerFileInput} />
                </div>
              )}
            </div>
            {isFileTouched && !file && (
              <p className="error-message">Image is required.</p>
            )}
            <button className="sumbit-func" onClick={createQuote}>Submit Quote</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateQuote;
