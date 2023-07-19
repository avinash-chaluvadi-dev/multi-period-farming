import React, { useState, useEffect } from "react";
import "./generalInfo.css";
import dataSaveIcon from "../../assets/data-save.svg";
import dataCloseIcon from "../../assets/file-close.svg";
import ProduceInfo from "../produce-info/produceInfo";

const GeneralInfo = (props) => {
  let responseObject = {};
  const { instance_name } = props;

  const [totalLand, setTotalLand] = useState("");
  const [primaryKey, setPrimaryKey] = useState(0);
  const [timePeriod, setTimePeriod] = useState("");
  const [instanceName, setInstanceName] = useState("");
  const [produceItems, setProduceItems] = useState([""]);
  const [showComponent, setShowComponent] = useState(false);
  const [generalResponse, setgeneralResponse] = useState({});
  const [dataSavedState, setDataSavedState] = useState(false);

  useEffect(() => {
    if (instance_name) {
      setInstanceName(instance_name);
      let url = new URL("http://127.0.0.1:8000/instance_history/primary_key/");
      url.searchParams.append("instance_name", instance_name);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setPrimaryKey(data.id);
          responseObject.id = data.id;
          setTimePeriod(data.time_periods);
          responseObject.time_periods = data.time_periods;
          setTotalLand(data.total_land_area_available);
          return fetch(`http://127.0.0.1:8000/general_info${data.id}`);
        })
        .then((response) => response.json())
        .then((data) => {
          let produceList = data.map((item) => {
            return { produce: item.produce };
          });
          responseObject.produce = produceList;
          setgeneralResponse(responseObject);
          setProduceItems(produceList);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [responseObject.id]);

  const handleAddProduce = () => {
    setProduceItems([...produceItems, ""]);
  };

  const handleChangeProduce = (value, index) => {
    const newFormValues = [...produceItems];
    newFormValues[index] = value;
    setProduceItems(newFormValues);
  };

  const handleGeneralInfo = async () => {
    const data = {
      produce: produceItems,
      time_periods: timePeriod,
      instance_name: instanceName,
      total_land_area_available: totalLand,
    };
    let produceList = produceItems.map((item) => {
      return { produce: item };
    });
    setgeneralResponse(produceList);

    try {
      const response = await fetch("http://127.0.0.1:8000/general_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setDataSavedState(true);
      // setgeneralResponse(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderProduceInfo = () => {
    setShowComponent(true);
  };

  return (
    <>
      {showComponent && (
        <ProduceInfo
          generalResponse={generalResponse}
          primaryKey={primaryKey}
        />
      )}
      {!showComponent && (
        <div className="general-info-background">
          <div className="general-info">
            <p className="general-info-heading">General Info</p>
            <div className="mpf-navigation-bar">
              <div className="mpf-button-wrapper">
                <div className="number-square general-button-selected">
                  <span className="number general-button-selected-number">
                    1
                  </span>
                </div>
                <button className="button general-info-step-name">
                  General Info
                </button>
              </div>
              <span className="separator"></span>
              <div className="mpf-button-wrapper">
                <div className="number-square">
                  <span className="number">2</span>
                </div>
                <button className="button">Produce Info</button>
              </div>
              <span className="separator"></span>
              <div className="mpf-button-wrapper">
                <div className="number-square">
                  <span className="number">3</span>
                </div>
                <button className="button">Produce Period Info</button>
              </div>
              <span className="separator"></span>
              <div className="mpf-button-wrapper">
                <div className="number-square">
                  <span className="number">4</span>
                </div>
                <button className="button">Period Info</button>
              </div>
            </div>
            {!showComponent && (
              <div className="general-info-input-container">
                <div className="general-info-details">
                  <p>Enter General Details</p>
                </div>
                <div className="instance-name">
                  <label htmlFor="instance_name">
                    Instance Name<span className="star">*</span>
                  </label>
                  <input
                    type="text"
                    id="instance_name"
                    className="input-field"
                    placeholder="Enter instance name"
                    value={instance_name}
                    onChange={(event) => setInstanceName(event.target.value)}
                  />
                </div>
                <div className="general-info-constants">
                  <div className="general-info-input-wrapper">
                    <label htmlFor="area_available">
                      Total Land Area Available (in acres)
                      <span className="star">*</span>
                    </label>
                    <input
                      type="text"
                      id="area_available"
                      className="input-field"
                      placeholder="Area in acres"
                      value={totalLand}
                      onChange={(event) => setTotalLand(event.target.value)}
                    />
                  </div>
                  <div className="general-info-input-wrapper">
                    <label htmlFor="time_period">
                      Time Period<span className="star">*</span>
                    </label>
                    <input
                      type="text"
                      id="time_period"
                      className="input-field"
                      placeholder="Time for the entire planning"
                      value={timePeriod}
                      onChange={(event) => setTimePeriod(event.target.value)}
                    />
                  </div>
                </div>
                <div className="general-info-produce">
                  {produceItems.map((_item, index) => (
                    <div className="general-info-input-wrapper">
                      <label htmlFor="produce">
                        Produce<span className="star">*</span>
                      </label>
                      <input
                        type="text"
                        id="produce"
                        className="input-field"
                        placeholder="Crop name"
                        defaultValue={_item.produce}
                        onChange={(event) =>
                          handleChangeProduce(event.target.value, index)
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="general-info-button-container">
                  <button
                    className="add-general-info-button"
                    onClick={handleAddProduce}
                  >
                    Add Produce
                  </button>
                  <button
                    className="general-info-save-button"
                    onClick={handleGeneralInfo}
                  >
                    Save
                  </button>

                  {dataSavedState && (
                    <div className="data-saved-container">
                      <div className="data-save-tick">
                        <img src={dataSaveIcon} alt="mySvgImage" />
                      </div>
                      <p className="data-save-text">Data saved successfully</p>
                      <div className="data-close-tick">
                        <img
                          src={dataCloseIcon}
                          alt="mySvgImage"
                          onClick={() => {
                            setDataSavedState(false);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <button
                    className="next-produce-info-button"
                    onClick={renderProduceInfo}
                  >
                    Next (Produce Info)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GeneralInfo;
