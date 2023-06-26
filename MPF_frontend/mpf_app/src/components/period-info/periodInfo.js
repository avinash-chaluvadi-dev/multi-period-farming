import React, { useState } from "react";
import "./periodInfo.css";

const PeriodInfo = ({ generalResponse }) => {
  const number = 52
  // const periodArray = Array.from({ length: generalResponse.time_periods }, (_, index) => index + 1);
  const periodArray = Array.from({ length: number }, (_, index) => index + 1);
  console.log(periodArray)
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
            <button className="button produce-info-step-name">Period Info</button>
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
                <th className="period-head">Inventory Holding Cost (South African Rand per KG)</th>
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
                        placeholder={index % 2 === 0 ? "Produce" : ""}
                      />
                    </td>
                    <td>
                      <input
                        className="produce-info-table-input"
                        type="text"
                      />
                    </td>
                    <td>
                      <input
                        className="produce-info-table-input"
                        type="text"
                      />
                    </td>
                    <td>
                      <input
                        className="produce-info-table-input"
                        type="text"
                      />
                    </td>
                    <td>
                      <input
                        className="produce-info-table-input"
                        type="text"
                      />
                    </td>
                    <td>
                      <input
                        className="produce-info-table-input"
                        type="text"
                      />
                    </td>
                    <td>
                      <input
                        className="produce-info-table-input"
                        type="text"
                      />
                    </td>
                    <td>
                      <input
                        className="produce-info-table-input"
                        type="text"
                      />
                    </td>
                    <td>
                      <input
                        className="produce-info-table-input"
                        type="text"
                      />
                    </td>
                  </tr>
                 ))}
            </tbody>
                </table>
            </div>
          </div>
          <div className="period-info-button-container">
            <button className="optimize-button">
              Optimize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodInfo
