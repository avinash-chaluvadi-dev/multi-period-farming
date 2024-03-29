import "./instanceSelection.css";

import React, { useState } from "react";
import ModifyInstance from "./modifyInstance";
import GeneralInfo from "../general-info/generalInfo";

import NewInstanceArrowIcon from "../../assets/new-instance-arrow-icon.svg";
import ModifyInstanceArrowIcon from "../../assets/modify-instance-arrow-icon.svg";

const InstanceSelection = () => {
  const [showNewComponent, setShowNewComponent] = useState(false);
  const [showModifyComponent, setShowModifyComponent] = useState(false);

  const renderGeneralInfo = () => {
    setShowNewComponent(true);
  };

  const renderModifyInstance = () => {
    setShowModifyComponent(true);
  };

  return (
    <>
      {showNewComponent && <GeneralInfo modify_instance={false} />}
      {showModifyComponent && <ModifyInstance />}
      {!showNewComponent && !showModifyComponent && (
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
              <div
                className="modify-instance-button"
                onClick={renderModifyInstance}
              >
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
