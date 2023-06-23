import React, { useState } from "react";
import "./producePeriodInfo.css";


// const ProducePeriodInfo = () => {
//   const [dragActive, setDragActive] = React.useState(false);
//   const [fileProgress, setFileProgress] = useState(0);
//   const [uploadedFileName, setUploadedFileName] = useState("");

//   const inputRef = React.useRef(null);

//   const handleFile = (files) => {
//     const file = files[0];
//     setUploadedFileName(file.name);

//     const formData = new FormData();
//     formData.append("file", file);
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 10;
//       setFileProgress(progress);
//       if (progress === 100) {
//         clearInterval(interval);
//       }
//     }, 500);
//   };

//   const handleDrag = function (e) {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = function (e) {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFile(e.dataTransfer.files);
//     }
//   };

//   const handleChange = function (e) {
//     e.preventDefault();
//     if (e.target.files && e.target.files[0]) {
//       handleFile(e.target.files);
//     }
//   };

//   const onButtonClick = () => {
//     inputRef.current.click();
//   };

//   return (
//     <div className="background">
//       <div className="produce-period-info">
//         <p className="produce-period-info-heading">Produce Period Info</p>
//         <div className="mpf-navigation-bar">
//           <div className="mpf-button-wrapper">
//             <div className="number-square">
//               <span className="number">1</span>
//             </div>
//             <button className="button">General Info</button>
//           </div>
//           <span className="separator"></span>
//           <div className="mpf-button-wrapper">
//             <div className="number-square">
//               <span className="number">2</span>
//             </div>
//             <button className="button">Produce Info</button>
//           </div>
//           <span className="separator"></span>
//           <div className="mpf-button-wrapper">
//             <div className="number-square">
//               <span className="number">3</span>
//             </div>
//             <button className="button" onClick>Produce Period Info</button>
//           </div>
//           <span className="separator"></span>
//           <div className="mpf-button-wrapper">
//             <div className="number-square">
//               <span className="number">4</span>
//             </div>
//             <button className="button">Period Info</button>
//           </div>
//         </div>
//         <div className="produce-period-info-input-container">
//           <div className="produce-period-info-details">
//             <p>Enter Produce Period Details</p>
//           </div>
//           <form
//             id="form-file-upload"
//             onDragEnter={handleDrag}
//             onSubmit={(e) => e.preventDefault()}
//           >
//             <input
//               ref={inputRef}
//               type="file"
//               id="input-file-upload"
//               multiple={true}
//               onChange={handleChange}
//             />
//             <label
//               id="label-file-upload"
//               htmlFor="input-file-upload"
//               className={dragActive ? "drag-active" : ""}
//             >
//               <div className="produce-period-info-input">
//                 <button className="upload-file" onClick={onButtonClick}>
//                   Upload File Here (xlsx)
//                 </button>
//                 <p className="drag-files">
//                   {" "}
//                   Drag and Drop Files Here (max size up to 20 MB)
//                 </p>

//                 {fileProgress > 0 && uploadedFileName && (
//                   <div className="file-status-container">
//                     <div className="file-icon">
//                     <img src={('file-icon.svg')} alt='mySvgImage' />
//                     </div>
//                     <div className="file-name">
//                         {uploadedFileName}
//                     </div>
//                     <div className="file-progress">
//                       {fileProgress}%
//                     </div>
//                     <div className="horizontal-bar"></div>
//                   </div>
//                 )}
//               </div>
//             </label>
//             {dragActive && (
//               <div
//                 id="drag-file-element"
//                 onDragEnter={handleDrag}
//                 onDragLeave={handleDrag}
//                 onDragOver={handleDrag}
//                 onDrop={handleDrop}
//               ></div>
//             )}
//           </form>

//           <div className="produce-info-button-container">
//             <button className="next-produce-info-button">Next (Period Info)</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const ProducePeriodInfo = () => {
  console.log("Hello Naveen Golla");
};

export default ProducePeriodInfo;
