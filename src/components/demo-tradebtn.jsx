import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoMdArrowRoundUp } from "react-icons/io";
import { IoMdArrowRoundDown } from "react-icons/io";
import { useFormik } from "formik";
import { DemotradeAction ,demotradebalAction } from "../redux/tradeSlice";
import { updateDemoBalance } from "../redux/userSlice";
import { userProfileAction } from "../redux/userSlice";
import { fetchAllPercAction } from "../redux/percSlice";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { Link } from 'react-router-dom' 
import "react-toastify/dist/ReactToastify.css";
import io from 'socket.io-client';
import { FaHistory } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import { MdAccessTime } from "react-icons/md";
import Audiop from '../audio/placed.mp3'
import Audiow from '../audio/won.mp3'
import Audiol from '../audio/lost.mp3'
import "../styles/trading.css";

//form validation
const formSchema = Yup.object({
  time: Yup.string(),
  investment: Yup.number().required("This field is required"),
  up: Yup.string(),
  down: Yup.string(),
  result: Yup.string(),
  payout: Yup.number(),
  calculatedResult: Yup.number(),
  tradeResult: Yup.string(),
});

const Demotradebtns = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllPercAction());
  }, [dispatch]);

  const percs = useSelector((state) => state?.perc?.percList?.[0]);

  const perc = percs?.perc;

  //get deposit created from store
  const bal = useSelector((state) => state?.trading.balance);

  const state = useSelector((state) => state?.user);
  const { userLoading, userAppErr, userServerErr, profile } = state;

  const states = useSelector((state) => state?.trading);
  const {
    appErr,
    loading,
    tradeloading,
    serverErr,
    tradeCreated,
    isTradeCreated,
  } = states;

  //fetch trade
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(userProfileAction(+page));
  }, [dispatch, page, setPage]);

  //formik form
  const formik = useFormik({
    initialValues: {
      time: 0,
      investment: 0,
      calculatedResult: "",
      tradeResult: "Pending",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const trade = await dispatch(DemotradeAction(values));
        if (trade?.payload?.alert) {
          new Audio(Audiop).play();
          toast.success("Trade placed");
          resetForm({ values: "" });
        }
      } catch (error) {
        console.error("Dispatch failed:", error);
      }
    },
    validationSchema: formSchema,
  });

  const handleIChange = (event) => {
    const { name, value } = event.target;
    const calculatedResult = Math.floor(value ? parseFloat(value) * 1.3 : "");
    formik.setFieldValue(name, value);
    formik.setFieldValue("calculatedResult", calculatedResult);
  };


  return (
    <div className="trade-btns-cover-wrapper">
      <div className="place-trades">
        <div className="buttons">
          <form action="" onSubmit={formik.handleSubmit}>
            {appErr || serverErr ? (
              <div className="show-error-top">{appErr}</div>
            ) : null}
            <h2 className="place-trade-top-text">
              Place trade{" "}
              <span><Link to="/demoTrades">View trades</Link></span>
            </h2>

            <div className="inputs-trade-wrapper">
              <div>
                <label htmlFor="time">Time</label>
                <h1 className="time-div">
                  <MdAccessTime size={20} />
                  <input
                    type="number"
                    name="time"
                    id="time"
                    min="1"
                    value={formik.values.time}
                    onChange={formik.handleChange("time")}
                    />
                </h1>
                <p className="trade-under-text">MINUTES</p>
              </div>
              <div>
                <label htmlFor="investment">Stake</label>
                <h1 className="investment-div">
                  <BsCurrencyDollar size={20} />
                  <input
                    type="number"
                    name="investment"
                    id="investment"
                    min="10"
                    value={formik.values.investment}
                    onChange={handleIChange}
                    onBlur={formik.handleBlur("investment")}
                  />
                </h1>
                <p className="trade-under-text">AMOUNT</p>
              </div>
            </div>
            {formik.values.calculatedResult !== null && (
              <p className="payout-text-mb">
                Payout: <h6>${formik.values.calculatedResult}</h6>
              </p>
            )}

            <div className="trade-btns-wrapper">
              <button type="submit" className="trade-btn even">
                {tradeloading ? "Placing.." : "Up"}
                <IoMdArrowRoundUp className="icon" />
              </button>
              {formik.values.calculatedResult !== null && (
                <p className="payout-text-dt">
                  Your payout: <h6>${formik.values.calculatedResult}</h6>
                </p>
              )}
              <button type="submit" className="trade-btn odd">
                {tradeloading ? "Placing.." : "Down"}{" "}
                <IoMdArrowRoundDown className="icon" />
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="time-history">
        <div className="time-history-cover">
          <p className="time-left-dk"><Link to="/demoTrades">View trades</Link></p>
          <div className="view-trade-history">
            <Link to="/demoTrades"><FaHistory size={40} color="gray" /></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demotradebtns;
