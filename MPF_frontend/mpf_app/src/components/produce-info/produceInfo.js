import React, { useEffect, useState } from "react";
import ProducePeriodInfo from "../produce-period-info/producePeriodInfo";
import "./produceInfo.css";

const ProduceInfo = ({ generalResponse }) => {
  const [infoRecords, setInfoRecords] = useState([]);
  const [produceItems, setProduceItems] = useState([]);
  const [showComponent, setShowComponent] = useState(false);
  const [produceInfoStatus, setProduceInfoStatus] = useState(false);

  const generalInfoRecords = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/general_info${id}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (generalResponse.id) {
      (async () => {
        const result = await generalInfoRecords(generalResponse.id);
        setInfoRecords(result);
      })();
    }

    return () => {};
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
    produceItems.forEach((item, index) => {
      item.produce = generalResponse.produce[index];
    });
    console.log(produceItems);
    try {
      const response = await fetch("http://127.0.0.1:8000/produce_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produceItems),
      });

      const result = await response.json();
      setProduceInfoStatus(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {showComponent ? (
        <ProducePeriodInfo generalResponse={generalResponse} />
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
