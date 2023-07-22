import axios from "axios";
import "./producePeriodInfo.css";
import React, { useEffect, useState } from "react";
import fileIcon from "../../assets/file-icon.svg";
import PeriodInfo from "../period-info/periodInfo";

const ProducePeriodInfo = (props) => {
  const { primaryKey } = props;
  const { instanceName } = props;
  const { generalResponse } = props;

  const inputRef = React.useRef(null);
  const [fileProgress, setFileProgress] = useState(0);
  const [fileUploaded, setfileUploaded] = useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [pastUploadedName, setPastUploadedName] = useState(false);

  useEffect(() => {
    if (primaryKey) {
      try {
        fetch(`http://localhost:8000/produce_period_info/${primaryKey}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setPastUploadedName(data);
          });
      } catch (error) {
        console.log("Error:", error);
      }
    }
  }, [primaryKey]);

  const handleFile = (files) => {
    const file = files[0];
    setUploadedFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFileProgress(progress);
      if (progress === 100) {
        clearInterval(interval);
        if (primaryKey) {
          axios
            .patch(
              `http://127.0.0.1:8000/produce_period_info/${primaryKey}`,
              formData
            )
            .then((response) => {
              setfileUploaded(true);
            })
            .catch((error) => {
              alert("File Upload failed!");
            });
        } else {
          axios
            .post("http://127.0.0.1:8000/produce_period_info", formData)
            .then((response) => {
              setfileUploaded(true);
            })
            .catch((error) => {
              alert("File Upload failed!");
            });
        }
      }
    }, 500);
  };

  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files);
    }
  };

  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const renderPeriodInfo = () => {
    setShowComponent(true);
  };

  return (
    <>
      {showComponent ? (
        <PeriodInfo primaryKey={primaryKey} generalResponse={generalResponse} />
      ) : (
        <div className="produce-period-background">
          <div className="produce-period-info">
            <p className="produce-period-info-heading">Produce Period Info</p>
            <div className="produce-period-navigation-bar">
              <div className="mpf-button-wrapper">
                <div className="number-square button-selected">
                  <span className="number">1</span>
                </div>
                <button className="button font-selected">General Info</button>
              </div>
              <span className="separator font-selected"></span>
              <div className="mpf-button-wrapper">
                <div className="number-square button-selected">
                  <span className="number">2</span>
                </div>
                <button className="button font-selected">Produce Info</button>
              </div>
              <span className="separator font-selected"></span>
              <div className="mpf-button-wrapper">
                <div className="number-square general-button-selected">
                  <span className="number general-button-selected-number">
                    3
                  </span>
                </div>
                <button className="button produce-info-step-name" onClick>
                  Produce Period Info
                </button>
              </div>
              <span className="separator"></span>
              <div className="mpf-button-wrapper">
                <div className="number-square">
                  <span className="number">4</span>
                </div>
                <button className="button">Period Info</button>
              </div>
            </div>
            <div className="produce-period-info-input-container">
              <div className="produce-period-info-details">
                <p>Enter Produce Period Details</p>
              </div>
              <form
                id="form-file-upload"
                onDragEnter={handleDrag}
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  id="input-file-upload"
                  multiple={true}
                  onChange={handleChange}
                />
                <label
                  id="label-file-upload"
                  htmlFor="input-file-upload"
                  className={dragActive ? "drag-active" : ""}
                >
                  <div className="produce-period-info-input">
                    {pastUploadedName && (
                      <p className="drag-files">
                        Uploaded file corresponding to {instanceName} --{">"}{" "}
                        {pastUploadedName}
                      </p>
                    )}
                    <button className="upload-file" onClick={onButtonClick}>
                      Upload File Here (xlsx)
                    </button>
                    <p className="drag-files">
                      {" "}
                      Drag and Drop Files Here (max size up to 20 MB)
                    </p>

                    {fileProgress > 0 && uploadedFileName && (
                      <div className="file-status-container">
                        <div className="file-icon">
                          <img src={fileIcon} alt="mySvgImage" />
                        </div>
                        <div className="file-name">{uploadedFileName}</div>
                        <div className="file-progress">{fileProgress}%</div>
                        <div className="horizontal-bar"></div>
                      </div>
                    )}
                    {fileUploaded && (
                      <p>
                        Your file has been uploaded successfully. Please proceed
                        to Period Info to complete the instance creation.
                      </p>
                    )}
                  </div>
                </label>
                {dragActive && (
                  <div
                    id="drag-file-element"
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  ></div>
                )}
              </form>

              <div className="produce-period-info-button-container">
                {/* <button className="produce-period-info-upload-button" onClick={handleFile}>
                  Upload
                </button> */}
                <button
                  className="next-period-info-button"
                  onClick={renderPeriodInfo}
                >
                  Next (Period Info)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProducePeriodInfo;
