import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import allActions from "../action";
import { getTotalAmountOfUser, sendAmoundOfPurchased } from "../service";
import { getFromLocalStorage, removeFromLocalStorage } from "../utils/setGetAsyncStorage";
import ModalComponent from 'react-modal-dom';
import ReactCustomModal from "../utils/Modal";
import Loader from "../component/loader";


const AddAmountUser = (props) => {
  const [showModal,setShowModal] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let userData = useSelector(
    (state) => state.userReducers?.userDetailes?.data?.data
  );
  let totalAmount = useSelector((state) => state.userReducers?.totalAmount);
  let token = getFromLocalStorage("Token");
  token = JSON.parse(token);

  let date = new Date();

  const [amount, setAmount] = useState(0);

  const handleInputChange = (e) => {
    setAmount(e.target.value);
  };

  const successApi = (res) => {
    dispatch(allActions.userActions.amountAddedSuccess(true))
    getTotalAmountOfUser(
      { employee_id: token },
      (res) =>
        dispatch(
          allActions.userActions.userTotalAmountIs(res.data.data.totalAmount)
        ),
      () => {}
    );
    setShowModal(true)
    setIsLoader(false)
    setAmount(0)
  };

  const failcallApi = (err) => {
    setIsLoader(false)
    alert(err.response.data);
    setAmount(0)
  };

  useEffect(() => {
    let token = getFromLocalStorage("Token");
    token = JSON.parse(token);
    if (token) {
      getTotalAmountOfUser(
        { employee_id: token },
        (res) =>
          dispatch(
            allActions.userActions.userTotalAmountIs(res.data.data.totalAmount)
          ),
        () => {}
      );
    }
  }, [userData]);

  const handleSubmit = () => {
    // logInApi(formValues,successApi,failcallApi)
    let formVal = {
      employee_id: userData?._id,
      employee_name:
        userData?.employee_firstname + " " + userData?.employee_lastname,
      employee_code: userData?.employee_code,
      amount: { date: date.getDate(), puchaseAmount: Number(amount) },
    };
    if(amount>0 && amount < 500){
      setIsLoader(true)
    sendAmoundOfPurchased(formVal, successApi, failcallApi);
    }
    else{
      alert("Please Enter a valid Amount More than 0 less that 500")
    }
  };

  const logOut=()=>{
    removeFromLocalStorage('Token')
    props.setLog(!props.log)
    props.setIsAdmin1(false)
   dispatch(allActions.userActions.setIsAdminInRedux(false)) 
  }

  const closeModal =()=>{
    setShowModal(false)
  }

  return (
    isLoader? <Loader/>:
    <div className="container">
        <div className="content">
          {/* containet Left */}
          <div className="content_lft">
         {showModal?<ReactCustomModal 
            onCloseModal={closeModal}
          /> :null } 
            <h1>Welcome from Chips Shop!</h1>
            {/* <p className="discrptn">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don't look even
              slightly believable. If you are going to use a passage of Lorem
              Ipsum, you need to be sure there isn't anything embarrassing
              hidden in the middle of text.{' '}
            </p>
            <img src="images/img_9.png" alt />{' '} */}
          </div>
          {/* containet Right */};
          <div className="content_rgt">
            <div className="register_sec">
              <h1>{"Hey, "+ (userData?.employee_firstname ?? '') +' ' + "your total amount is " +(totalAmount ?? 0)+ 'Rs.' }</h1>
              <ul>
                <li>
                  <span>Please Enter Your Amount</span>
                  <input
                    type="number"
                    placeholder="Rs."
                    name="amount"
                    value={amount}
                    onChange={(e) => handleInputChange(e)}
                  />
                </li>
                <li>
                  <a to="/ResetPassword">
                    {' '}
                    <input onClick={() => handleSubmit()}
                      type="submit"
                      defaultValue="Submit"
                    />
                  </a>
                </li>
                <li>
                  <a to="/ResetPassword">
                    {' '}
                    <button onClick={logOut}>Log Out </button>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AddAmountUser;
