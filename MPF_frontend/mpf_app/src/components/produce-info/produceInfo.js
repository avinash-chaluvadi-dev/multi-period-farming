import React, { useEffect, useState } from "react";
import ProducePeriodInfo from "../produce-period-info/producePeriodInfo";
import "./produceInfo.css";


const ProduceInfo = ({ generalResponse }) => {
  const [infoRecords, setInfoRecords] = useState([]);
  const [showComponent, setShowComponent] = useState(false);

  const generalInfoRecords = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/general_info${id}`);
      const result = await response.json();
      console.log("Success:", result);
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
  return (
    <>
    {showComponent ? (
      <ProducePeriodInfo generalResponse={generalResponse}/>
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
              <span className="number produce-button-selected-number">2</span>
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
                <th className="produce-head">Lead time to purchase(Periods)</th>
                <th className="produce-head">Man Hours required per acre</th>
                <th className="produce-head">Fraction Lost per time period</th>
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
                        placeholder={index % 2 === 0 ? "Produce" : ""}
                      />
                    </td>
                    <td>
                      <input
                        className="produce-info-table-input"
                        type="text"
                        placeholder={
                          index % 2 === 0 ? "Harvest time in periods" : ""
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="produce-info-table-input"
                        type="text"
                        placeholder={
                          index % 2 === 0 ? "Purchase time in periods" : ""
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="produce-info-table-input"
                        type="text"
                        placeholder={index % 2 === 0 ? "Total man hours" : ""}
                      />
                    </td>
                    <td>
                      <input
                        className="produce-info-table-input"
                        type="text"
                        placeholder={
                          index % 2 === 0 ? "Fraction lost per period" : ""
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="produce-period-info-button-container">
            <button className="produce-save-button">Save</button>
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
