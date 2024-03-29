import React,{useState} from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useEffect } from "react";
import { ImagetoBase64 } from "../Admin/utility/ImagetoBase64";
import * as Yup from "yup"
import { useSelector, useDispatch } from "react-redux";
import TradingNav from "../components/tradingnav";
import TradingTopNav from "../components/tradingTopNav";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { IoAlertOutline } from "react-icons/io5";
import { FaCopy } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom' 
import { userProfileAction } from "../redux/userSlice";
import { ImFolderUpload } from "react-icons/im";
import Disabledbutton from "../components/disabledbutton";
import "../styles/depositMenu.css";
import DepositFooter from "../components/depositFooter";
import { depositAction } from "../redux/depositSlice";
import toast from "react-hot-toast";

  //form validation
  const formSchema = Yup.object({
    amount: Yup.number().required("Amount is required"),
    method: Yup.string().required("Deposit method is required"),
    screenshot: Yup.string(),
    status: Yup.string(),
  })

const DepositMenu = () => {

  const navigate = useNavigate();
  //get deposit methods
  const { filterby } = useParams();
  const methodData = useSelector((state) => state.method.methodList);
  const methodDisplay = methodData.filter((el) => el._id === filterby)[0];

    //dispatch
    const dispatch = useDispatch();

    //formik form
    const formik = useFormik({
      initialValues:{
        amount: "",
        method: "",
        screenshot: "",
        status:"Pending",
      },
      onSubmit: (values, {resetForm}) =>{
        dispatch(depositAction(values))
        resetForm({values: ''})
      },
      validationSchema: formSchema,
    })

    useEffect(()=>{
      dispatch(userProfileAction())
  },[dispatch])

  const states = useSelector(state => state?.user);
  const { profile } = states

  const deposits = profile?.deposit
  
    //get deposit created from store
    const state = useSelector(state => state?.deposit)
    const {appErr, loading, serverErr, depositCreated, isDepositCreated} = state;

    const [imageVPreview, setImageVPreview] = useState( deposits?.screenshot ||  <span><ImFolderUpload/></span>)

    const uploadVImage = async (e) => {
      const file = e.target.files[0];
    
      if (file) {
        const data = await ImagetoBase64(file);
        formik.setFieldValue('screenshot', data);
    
        // Set image preview for immediate display
        const reader = new FileReader();
        reader.onload = () => {
          setImageVPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    //redirect
    useEffect(()=>{
      if(isDepositCreated)
      toast("Deposit processing...", {
        className: "toast-message-deposit",
      });
    }, [isDepositCreated, dispatch]);

    //copy text
  const [textToCopy, setTextToCopy] = useState(methodDisplay?.number);

  const handleCopyClick = () => {
    // Using document.execCommand for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    // Using navigator.clipboard.writeText for modern browsers
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        toast('Copied!');
      }).catch((err) => {
        toast('Unable to copy text to clipboard', err);
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Perform the calculation (double the input value)
    const calculatedResult = value ? (parseFloat(value) / methodDisplay?.calc).toFixed(3) : '';
    // Update the formik values and trigger re-render
    formik.setFieldValue(name, value);
    formik.setFieldValue('calculatedResult', calculatedResult);
  };

  return (
    <div className="deposit-menu">
      <div className="top-nav">
        <TradingTopNav />
      </div>

      <div className="deposit-menu-body">
        <div className="sideNav">
          <TradingNav />
        </div>

        <div className="depositmenu-body-cover">

        <div className="deposit-menu-body-wrapper">
        <div className="deposit-menu-card-wrapper">
          <div className="left-wrapper">
            <h1>Chosen payment method:</h1>
            <div className="deposit-menu-card">
              <div>
                <img src={methodDisplay?.image} />
                <p>{methodDisplay?.name}</p>
              </div>

              <h4>Deposit to: <span>{methodDisplay?.number}</span> <div className="copy-icon" onClick={handleCopyClick}><FaCopy color="gray"/></div></h4>
              <h5>Or scan the Qr code below: <span><img src={methodDisplay?.qrcode} /></span></h5>
              <h6>Account name: <span>{methodDisplay?.user}</span></h6>
              <p className="deposit-description"><span>{methodDisplay?.description}</span></p>

              <p>
                Min amount: <span>$30.00</span>
              </p>
              <p>
                Max amount: <span>$60,000.00</span>
              </p>
            </div>
            <Link to="/deposit"><span><FaCircleChevronLeft/></span>Chose a different payment method</Link>
          </div>

          <div className="deposit-menu-card-options">
            {serverErr || appErr? <div>{serverErr}{appErr}</div>:null}
            <form action="" onSubmit={formik.handleSubmit}>

              <label htmlFor="amount">The Amount</label>
              <input type="number" name="amount" id="amount" placeholder={"$"} value={formik.values.amount} onChange={handleInputChange} onBlur = {formik.handleBlur("amount")}/>
              {formik.values.calculatedResult !== null && (<p>Transfer {formik.values.calculatedResult} {methodDisplay?.name}</p>)}
              <div className="show-error">
              {formik.touched.amount && formik.errors.amount}
              </div>

              <input type="text" name="status" id="status" placeholder={"status"} value={formik.values.status} onChange={formik.handleChange("status")} onBlur = {formik.handleBlur("status")}/>

              <label htmlFor="method">Transaction ID</label>
              <input type="text" name="method" id="method" placeholder={"Type your text id here"} value={formik.values.method} onChange={formik.handleChange("method")} onBlur = {formik.handleBlur("method")}/>
              <div className="show-error">
              {formik.touched.method && formik.errors.method}
              </div>

            <div className="verification-id verification-id-deposit">
              <h1 className="screenshot-text">Upload a screenshot of your deposit here:</h1>
              <label htmlFor="screenshot" className="v-img-label checks"> <div className="verification-img">{deposits?.screenshot? <img src={deposits?.screenshot}/>: <img src={imageVPreview}/> }</div></label>
              <input type="file" className="v-img-input" id="screenshot" accept="image/*"
              onChange={uploadVImage}
              onBlur = {formik.handleBlur("screenshot")}/>
            </div>

              {loading? <Disabledbutton/>:<button>Deposit<BsArrowRightCircleFill color = "rgba(255, 255, 255, 0.195)" size={20}/></button>}

              <div className="warning"><IoAlertOutline className="alert-icon"/>Attention! This is for {methodDisplay?.name} transfers only. Confirm details before making payments to avoid losing them.<br/><br/>
               Please transfer the amount exactly as indicated.</div>
            </form>
          </div>
        </div>
        <DepositFooter/>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DepositMenu;
