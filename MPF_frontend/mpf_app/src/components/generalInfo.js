import React, { useState } from "react";
import "./general_info.css";
import addProduce from "./addProduce";
import ProducePeriodInfo from "./producePeriodInfo";

const GeneralInfo = () => {
  const [totalLand, setTotalLand] = useState("");
  const [timePeriod, setTimePeriod] = useState(0);
  const [produceItems, setProduceItems] = useState([""]);

  const handleAddProduce = () => {
    setProduceItems([...produceItems]);
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
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="background">
      <div className="general-info">
        <p className="general-info-heading">General Info</p>
        <div className="mpf-navigation-bar">
          <div className="mpf-button-wrapper">
            <div className="number-square">
              <span className="number">1</span>
            </div>
            <button className="button">General Info</button>
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
            <button className="button" onClick={ProducePeriodInfo}>Produce Period Info</button>
          </div>
          <span className="separator"></span>
          <div className="mpf-button-wrapper">
            <div className="number-square">
              <span className="number">4</span>
            </div>
            <button className="button">Period Info</button>
          </div>
        </div>
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
            <div className="general-info-add-button">
                <button className="add-produce-button" onClick={handleAddProduce}>
                Add
                </button>
            </div>
          </div>
          <div className="general-info-button-container">
            <button
              className="general-info-save-button"
              onClick={handleNextProduceInfo}
            >
              Save
            </button>
            <button className="next-produce-info-button" onClick={ProducePeriodInfo}>
              Next (Produce Info)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
