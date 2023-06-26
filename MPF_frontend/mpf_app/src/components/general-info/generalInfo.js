import React, { useState } from "react";
import "./generalInfo.css";
import ProduceInfo from "../produce-info/produceInfo";

const GeneralInfo = () => {
  const [step, setStep] = useState(1);
  const [totalLand, setTotalLand] = useState("");
  const [timePeriod, setTimePeriod] = useState(0);
  const [produceItems, setProduceItems] = useState([""]);
  const [showComponent, setShowComponent] = useState(false);
  const [generalResponse, setgeneralResponse] = useState({});

  const handleAddProduce = () => {
    setProduceItems([...produceItems, ""]);
    console.log(produceItems);
  };

  const handleChangeProduce = (value, index) => {
    const newFormValues = [...produceItems];
    newFormValues[index] = value;
    setProduceItems(newFormValues);
  };

  const handleNextProduceInfo = async () => {
    const data = {
      produce: produceItems,
      time_periods: timePeriod,
      total_land_area_available: totalLand,
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/general_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setgeneralResponse(result)
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderProduceInfo = () => {
    setShowComponent(true);
  };
  
  return (
    <>
    {showComponent ? (
      <ProduceInfo generalResponse={generalResponse}/>
    ) : (
    <div className="general-info-background">
      <div className="general-info">
        <p className="general-info-heading">General Info</p>
        <div className="mpf-navigation-bar">
          <div className="mpf-button-wrapper">
            <div className="number-square general-button-selected">
              <span className="number general-button-selected-number">1</span>
            </div>
            <button className="button general-info-step-name">General Info</button>
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
          <div className="general-info-constants">
            <div className="general-info-input-wrapper">
              <label htmlFor="area_available">
                Total Land Area Available (in acres)
              </label>
              <input
                type="text"
                id="area_available"
                className="input-field"
                placeholder="Area in acres"
                onChange={(event) => setTotalLand(event.target.value)}
              />
            </div>
            <div className="general-info-input-wrapper">
              <label htmlFor="time_period">Time Period</label>
              <input
                type="text"
                id="time_period"
                className="input-field"
                placeholder="Time for the entire planning"
                onChange={(event) => setTimePeriod(event.target.value)}
              />
            </div>
          </div>
          <div className="general-info-produce">
            {produceItems.map((_item, index) => (
              <div className="general-info-input-wrapper">
                <label htmlFor="produce">Produce</label>
                <input
                  type="text"
                  id="produce"
                  className="input-field"
                  placeholder="Crop name"
                  onChange={(event) =>
                    handleChangeProduce(event.target.value, index)
                  }
                />
              </div>
            ))}
          </div>
          <div className="general-info-button-container">
            <button className="add-general-info-button" onClick={handleAddProduce}>
              Add
            </button>
            <button
              className="general-info-save-button"
              onClick={handleNextProduceInfo}
            >
              Save
            </button>
          </div>
          <div>
            <button
              className="next-produce-info-button"
              onClick={renderProduceInfo}
            >
              Next (Produce Info)
            </button>
            {/* {showComponent && < ProducePeriodInfo/>} */}
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
