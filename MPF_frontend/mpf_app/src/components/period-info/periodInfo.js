import React, { useEffect, useState } from "react";
import "./periodInfo.css";

const PeriodInfo = (props) => {
  const { primaryKey } = props;
  const { instance_name } = props;
  const { generalResponse } = props;

  const [periodItems, setPeriodItems] = useState([]);

  const handleChange = (index, field, value) => {
    const newPeriodItems = [...periodItems];
    newPeriodItems[index] = { ...newPeriodItems[index], [field]: value };
    setPeriodItems(newPeriodItems);
  };

  useEffect(() => {
    if (primaryKey) {
      try {
        fetch(`http://localhost:8000/period_info/${primaryKey}`)
          .then((response) => response.json())
          .then((data) => {
            setPeriodItems(data);
          });
      } catch (error) {
        console.log("Error:", error);
      }
    } else {
      const periodArray = Array.from(
        { length: generalResponse[0].time_periods },
        (_, index) => ({ time_period: index + 1 })
      );
      setPeriodItems(periodArray);
      periodItems.forEach((item, index) => {
        item.time_period = periodArray[index];
      });
    }
  }, [generalResponse.id]);

  const handlePeriodInfo = async () => {
    if (primaryKey) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/period_info/${primaryKey}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(periodItems),
          }
        );

        const result = await response.json();
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const response = await fetch("http://127.0.0.1:8000/period_info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(periodItems),
        });

        const result = await response.json();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleOptimize = async () => {
    if (primaryKey) {
      try {
        let periodURL = new URL("http://127.0.0.1:8000/optimize");
        periodURL.searchParams.append("id", primaryKey);
        const response = await fetch(periodURL);
        const result = await response.text();

        // Replace escaped new lines and double quotes with empty lines
        const unescapedResult = result.replace(/\\n/g, "\n").replace(/"/g, "");

        // Create a Blob from the text content
        const blob = new Blob([unescapedResult], { type: "text/plain" });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element to initiate the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "output.txt");
        document.body.appendChild(link);
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const response = await fetch("http://127.0.0.1:8000/optimize");
        const result = await response.text();
        const url = window.URL.createObjectURL(result);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "output.txt");
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

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
                  <tr>
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
                    <th className="period-head">
                      Fertilizer Required/acre (kg)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {periodItems?.map((item, index) => (
                    <tr
                      className={index % 2 != 0 ? "even-row" : "odd-row"}
                      key={index}
                    >
                      <td>
                        <input
                          className="produce-info-table-input"
                          type="text"
                          value={item.time_period}
                          // placeholder={index % 2 === 0 ? "Produce" : ""}
                        />
                      </td>
                      <td>
                        <input
                          className="produce-info-table-input"
                          type="text"
                          defaultValue={item.inventory_holding_cost}
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
                          defaultValue={item.water_available_in_litres}
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
                          defaultValue={item.water_cost_per_litre}
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
                          defaultValue={item.available_man_hours}
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
                          defaultValue={item.labour_cost_per_man_hour}
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
                          defaultValue={item.fertilizer_cost_per_kg}
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
                          defaultValue={item.energy_cost_per_unit}
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
                          defaultValue={item.fertilizer_required_per_acre}
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
            <button className="optimize-button" onClick={handlePeriodInfo}>
              Save
            </button>
            <button className="optimize-button" onClick={handleOptimize}>
              Optimize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodInfo;
