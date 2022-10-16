import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import allActions from "../action";
import { getMoneyFromUser, showAllAdminData } from "../service";
import { removeFromLocalStorage } from "../utils/setGetAsyncStorage";

function ShowAllData(props) {
  const [showData, setShowData] = useState([]);
  let dispatch = useDispatch();

  const successApi = (res) => {
    setShowData(res.data.result);
  };

  const failcallApi = (err) => {
    alert(err.response.data);
  };

  const handleClick = (employee_id, employee_name) => {
    var answer = prompt(`Please Enter ${employee_name} Amount`);
    // if (answer !== parseInt(answer, 10).toString()) {
    //   alert("Please enter only numbers!");
    //   answer = prompt(`Please Enter ${employee_name} Amount`);
    // }
    // if (answer > 0) {
      getMoneyFromUser(
        { employee_id: employee_id, get_money: Number(answer) },
        () => {
          showAllAdminData(successApi, failcallApi);
        },
        (err) => {
          alert(err.response.data);
        }
      );
    // }
  };

  useEffect(() => {
    showAllAdminData(successApi, failcallApi);
  }, []);

  const logOut = () => {
    removeFromLocalStorage("Token");
    props.setLog(!props.log);
    // props.setIsAdmin1(false)
    dispatch(allActions.userActions.setIsAdminInRedux(false));
  };

  return (
    <>
      <div className="container">
        <div className="content">
          <div className="content_rgt">
            <div className="register_sec">
              <h1>Purchased Amound of All Users</h1>
              <ul>
                <div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>S NO.</th>
                        <th>Employee Name </th>
                        <th>Employee Code</th>
                        <th>Total Amount To Pay</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showData.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data.employee_name}</td>
                            <td>{data.employee_code}</td>
                            <td>{data.totalAmount}</td>
                            <button
                              onClick={() =>
                                handleClick(
                                  data.employee_id,
                                  data.employee_name
                                )
                              }
                            >
                              Pay
                            </button>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <button onClick={logOut}>Log Out</button>
                </div>
              </ul>
            </div>
          </div>
          <div className="content_lft">
            <h1>Welcome from PPL!</h1>
            <p className="discrptn">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don't look even
              slightly believable. If you are going to use a passage of Lorem
              Ipsum, you need to be sure there isn't anything embarrassing
              hidden in the middle of text.{" "}
            </p>
            <img src="images/img_9.png" alt />{" "}
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowAllData;
