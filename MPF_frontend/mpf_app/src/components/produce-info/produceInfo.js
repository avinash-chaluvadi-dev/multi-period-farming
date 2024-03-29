import React, { useEffect, useState } from "react";
import ProducePeriodInfo from "../produce-period-info/producePeriodInfo";
import "./produceInfo.css";
import dataSaveIcon from "../../assets/data-save.svg";
import dataCloseIcon from "../../assets/file-close.svg";

const ProduceInfo = (props) => {
  const { primaryKey } = props;
  const { instanceName } = props;
  const { generalResponse } = props;

  const [infoRecords, setInfoRecords] = useState([]);
  const [produceItems, setProduceItems] = useState([]);
  const [showComponent, setShowComponent] = useState(false);
  const [dataSavedState, setDataSavedState] = useState(false);
  const [produceInfoStatus, setProduceInfoStatus] = useState(false);

  useEffect(() => {
    if (primaryKey) {
      try {
        fetch(`http://localhost:8000/produce_info/${primaryKey}`)
          .then((response) => response.json())
          .then((data) => {
            setInfoRecords(data);
            setProduceItems(data);
          });
      } catch (error) {
        console.log("Error:", error);
      }
    } else {
      console.log(generalResponse);
      setInfoRecords(generalResponse);
    }
  }, [generalResponse.id]);

  const renderProducePeriodInfo = () => {
    setShowComponent(true);
  };

  const handleChange = (index, field, value) => {
    const newProduceItems = [...produceItems];
    newProduceItems[index] = { ...newProduceItems[index], [field]: value };
    setProduceItems(newProduceItems);
  };

  const handleProduceInfo = async () => {
    console.log(produceItems);
    console.log(generalResponse);
    if (primaryKey) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/produce_info/${primaryKey}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(produceItems),
          }
        );
        const result = await response.json();
        setDataSavedState(true);
        // setgeneralResponse(result);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      produceItems.forEach((item, index) => {
        item.produce = generalResponse[index].produce;
      });
      try {
        const response = await fetch("http://127.0.0.1:8000/produce_info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(produceItems),
        });

        const result = await response.json();
        setDataSavedState(true);
        setProduceInfoStatus(true);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      {showComponent ? (
        <ProducePeriodInfo
          primaryKey={primaryKey}
          instanceName={instanceName}
          generalResponse={generalResponse}
        />
      ) : (
        <div className="background">
          <div className="produce-info">
            <p className="produce-info-heading">Produce Info</p>
            <div className="produce-navigation-bar">
              <div className="mpf-button-wrapper">
                <div className="number-square button-selected">
                  <span className="number">1</span>
                </div>
                <button className="button font-selected">General Info</button>
              </div>
              <span className="separator font-selected"></span>
              <div className="mpf-button-wrapper">
                <div className="number-square produce-button-selected">
                  <span className="number produce-button-selected-number">
                    2
                  </span>
                </div>
                <button className="button produce-info-step-name">
                  Produce Info
                </button>
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
            <div className="produce-info-input-container">
              <div className="produce-info-details">
                <p>Enter Produce Details</p>
              </div>

              <div className="produce-info-input">
                <table className="produce-table">
                  <thead>
                    <tr>
                      <th className="produce-head">Produce</th>
                      <th className="produce-head">Time to harvest(Periods)</th>
                      <th className="produce-head">
                        Lead time to purchase(Periods)
                      </th>
                      <th className="produce-head">
                        Man Hours required per acre
                      </th>
                      <th className="produce-head">
                        Fraction Lost per time period
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {infoRecords?.map((item, index) => (
                      <tr
                        className={index % 2 === 0 ? "even-row" : "odd-row"}
                        key={index}
                      >
                        <td>
                          <input
                            className="produce-info-table-input"
                            type="text"
                            value={item.produce}
                            onChange={(e) =>
                              handleChange(index, "produce", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="produce-info-table-input"
                            type="text"
                            defaultValue={
                              item.time_to_harvest === 0 ||
                              item.time_to_harvest === 0.0
                                ? ""
                                : item.time_to_harvest
                            }
                            onChange={(e) =>
                              handleChange(
                                index,
                                "time_to_harvest",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="produce-info-table-input"
                            type="text"
                            defaultValue={
                              item.lead_time_to_purchase === 0 ||
                              item.lead_time_to_purchase === 0.0
                                ? ""
                                : item.lead_time_to_purchase
                            }
                            onChange={(e) =>
                              handleChange(
                                index,
                                "lead_time_to_purchase",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="produce-info-table-input"
                            type="text"
                            defaultValue={
                              item.man_hours_required_per_acre === 0 ||
                              item.man_hours_required_per_acre === 0.0
                                ? ""
                                : item.man_hours_required_per_acre
                            }
                            onChange={(e) =>
                              handleChange(
                                index,
                                "man_hours_required_per_acre",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="produce-info-table-input"
                            type="text"
                            defaultValue={
                              item.fraction_lost_per_period === 0 ||
                              item.fraction_lost_per_period === 0.0
                                ? ""
                                : item.fraction_lost_per_period
                            }
                            onChange={(e) =>
                              handleChange(
                                index,
                                "fraction_lost_per_period",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {dataSavedState && (
                <div className="produce-data-saved-container">
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
              <div className="produce-period-info-button-container">
                <button
                  className="produce-save-button"
                  onClick={handleProduceInfo}
                >
                  Save
                </button>
                <button
                  className="next-produce-period-info-button"
                  onClick={renderProducePeriodInfo}
                >
                  Next (Produce Period Info)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProduceInfo;
