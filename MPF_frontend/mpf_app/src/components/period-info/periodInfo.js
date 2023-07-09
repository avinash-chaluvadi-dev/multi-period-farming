import React, { useState } from "react";
import "./periodInfo.css";

const PeriodInfo = ({ generalResponse }) => {
  const [periodItems, setPeriodItems] = useState([]);
  const periodArray = Array.from(
    { length: generalResponse.time_periods },
    (_, index) => index + 1
  );

  const handleChange = (index, field, value) => {
    const newPeriodItems = [...periodItems];
    newPeriodItems[index] = { ...newPeriodItems[index], [field]: value };
    setPeriodItems(newPeriodItems);
  };

  const handlePeriodInfo = async () => {
    periodItems.forEach((item, index) => {
      item.time_period = periodArray[index];
    });
    try {
      const response = await fetch("http://127.0.0.1:8000/period_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(periodItems),
      });

      const result = await response.json();
      // setProduceInfoStatus(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const number = 52
  // const periodArray = Array.from({ length: number }, (_, index) => index + 1);
  return (
    <div className="period-background">
      <div className="period-info">
        <p className="period-info-heading">Period Info</p>
        <div className="period-navigation-bar">
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
            <div className="number-square button-selected">
              <span className="number general-button-selected-number">3</span>
            </div>
            <button className="button font-selected" onClick>
              Produce Period Info
            </button>
          </div>
          <span className="separator font-selected"></span>
          <div className="mpf-button-wrapper">
            <div className="number-square general-button-selected">
              <span className="number general-button-selected-number">4</span>
            </div>
            <button className="button produce-info-step-name">
              Period Info
            </button>
          </div>
        </div>
        <div className="period-info-input-container">
          <div className="period-info-details">
            <p>Enter Period Details</p>
          </div>
          <div className="period-info-input">
            <div className="period-table-container">
              <table className="period-table">
                <thead>
                  <th className="period-head">Time Period</th>
                  <th className="period-head">
                    Inventory Holding Cost (South African Rand per KG)
                  </th>
                  <th className="period-head">Water Available (in litres)</th>
                  <th className="period-head">Water Cost / Litre</th>
                  <th className="period-head">Available Man Hours</th>
                  <th className="period-head">Labour Cost/Man Hour</th>
                  <th className="period-head">Fertilizer Cost / Kg</th>
                  <th className="period-head">Energy Cost / Unit</th>
                  <th className="period-head">Fertilizer Required/acre (kg)</th>
                </thead>
                <tbody>
                  {periodArray?.map((item, index) => (
                    <tr
                      className={index % 2 != 0 ? "even-row" : "odd-row"}
                      key={index}
                    >
                      <td>
                        <input
                          className="produce-info-table-input"
                          type="text"
                          value={item}
                          // placeholder={index % 2 === 0 ? "Produce" : ""}
                        />
                      </td>
                      <td>
                        <input
                          className="produce-info-table-input"
                          type="text"
                          onChange={(e) =>
                            handleChange(
                              index,
                              "inventory_holding_cost",
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
                              "water_available_in_litres",
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
                              "water_cost_per_litre",
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
                              "available_man_hours",
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
                              "labour_cost_per_man_hour",
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
                              "fertilizer_cost_per_kg",
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
                              "energy_cost_per_unit",
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
                              "fertilizer_required_per_acre",
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
          </div>
          <div className="period-info-button-container">
          <button className="optimize-button">Save</button>
            <button className="optimize-button">Optimize</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodInfo;
