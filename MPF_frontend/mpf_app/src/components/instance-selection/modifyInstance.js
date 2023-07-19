import React, { useState, useEffect } from "react";
import viewInstanceIcon from "../../assets/view-instance.svg";
import GeneralInfo from "../general-info/generalInfo";
import "./modifyInstance.css";

const ModifyInstance = () => {
  const [viewInstance, setViewInstance] = useState("");
  const [instanceData, setInstanceData] = useState([]);
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/instance_history")
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((item) => {
          const [date, fullTime] = item.created_at.split("T");
          const [time] = fullTime.split(".");
          return { ...item, date, time };
        });
        setInstanceData(updatedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleViewInstance = (instance_name) => {
    setShowComponent(true);
    setViewInstance(instance_name);
  };

  return (
    <>
      {showComponent ? (
        <GeneralInfo instance_name={viewInstance} modify_instance={true} />
      ) : (
        <div className="modify-instance-background">
          <p className="modify-instance-heading">MPF Instance History</p>
          <div className="modify-instance-container">
            <p className="modify-instance-history">History Table</p>
            <div className="modify-instance-table-container">
              <table className="modify-instance-table">
                <thead>
                  <tr>
                    <th className="modify-instance-head">Instance Name</th>
                    <th className="modify-instance-head">Created On</th>
                    <th className="modify-instance-head">Time Period</th>
                    <th className="modify-instance-head"></th>
                  </tr>
                </thead>
                <tbody>
                  {instanceData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          className="modify-instance-table-input"
                          type="text"
                          defaultValue={item.instance_name}
                        />
                      </td>
                      <td>
                        <input
                          className="modify-instance-table-input"
                          type="text"
                          defaultValue={item.date}
                        />
                      </td>
                      <td>
                        <input
                          className="modify-instance-table-input"
                          type="text"
                          defaultValue={item.time}
                        />
                      </td>
                      <td>
                        <div
                          className="view-instance"
                          onClick={() => handleViewInstance(item.instance_name)}
                        >
                          <p>View Instance</p>
                          <img src={viewInstanceIcon} alt="mySvgImage" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModifyInstance;
