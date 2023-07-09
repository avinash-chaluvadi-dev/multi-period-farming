import React, { useState } from "react";
import "./instanceSelection.css";
import GeneralInfo from "../general-info/generalInfo";

import NewInstanceArrowIcon from "../../assets/new-instance-arrow-icon.svg";
import ModifyInstanceArrowIcon from "../../assets/modify-instance-arrow-icon.svg";

const InstanceSelection = () => {
  const [showComponent, setShowComponent] = useState(false);

  const renderGeneralInfo = () => {
    setShowComponent(true);
  };

  return (
    <>
      {showComponent ? (
        <GeneralInfo />
      ) : (
        <div className="instance-selection-background">
          <div className="instance-selection-container">
            <div className="select-instance-container">
              <p className="select-instance-text">Select Instance</p>
            </div>
            <div className="select-instnace-body">
              <p>
                To insert new instance, click on New Instance and if you want to
                modify existing instance click on Modify Instance
              </p>
            </div>
            <div className="instance-selection-buttons-container">
              <div className="new-instance-button" onClick={renderGeneralInfo}>
                <p>New Instance</p>
                <img src={NewInstanceArrowIcon} alt="mySvgImage" />
              </div>
              <div className="modify-instance-button">
                <p>Modify Instance</p>
                <img src={ModifyInstanceArrowIcon} alt="mySvgImage" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstanceSelection;
