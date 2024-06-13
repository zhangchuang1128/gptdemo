import React, { useEffect, useState } from "react";
import { Image, Form, Input, Divider, Button } from "antd";
import background from "../../../images/logo.png";
import "./login.less";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "../../../services/loginServices";
import CryptoJS from "crypto-js"
const LoginContainers = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [remember,setRemember]=useState(false)
  const [loading,setloading]=useState(false)
// 加密
  const cryptoJSFun=(value,valueKey)=>{
    let cipherText = CryptoJS.AES.encrypt(value, valueKey).toString();
    return cipherText;
  }
  // 解密
	const getCryptoJSFun=(value,valueKey)=>{
    let bytes = CryptoJS.AES.decrypt(value, valueKey);
    let cipherText = bytes.toString(CryptoJS.enc.Utf8);
    return cipherText;
  }
 //value: 需要解密的值
 //valueKey: 跟加密时的密匙保持一致

  useEffect(()=>{
if(localStorage.getItem("account")){
  // console.log(localStorage.getItem("account"));
  form.setFieldsValue(JSON.parse(getCryptoJSFun(localStorage.getItem("account"),"YunStorm")))
  setRemember(true)
}
  },[])

  
  const loginClick = () => {
    setloading(true)
    login(form.getFieldsValue()).then((result) => {
      setloading(false)
      if (result) {
        const authorization = ["Bearer", result?.data?.access].join(" ");
        localStorage.setItem("token", authorization);
        if(remember){
          localStorage.setItem("account",cryptoJSFun(JSON.stringify(form.getFieldsValue()),"YunStorm"))
        }else{
          localStorage.removeItem("account")
        }
        window.location.href = "/";
      }
    });
  };
  document.onkeydown=(e) => {
    // console.log(e);
    if (e.keyCode === 13) {
      loginClick();
    }
  };
  const onCheckboxChange = (e) =>{
    // console.log(e.target.checked);
    setRemember(e.target.checked)
  }
  const isMobile = () => {
    return !!navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
  };
  return (
    <div className="body">
      <div className={isMobile()?"isMobile_model":"model"}>
        <div className="img_logo">
          <img src={background} style={{ width: "150px", margin: " auto" }} />
        </div>
        <div className={isMobile()?"isMobile_login_box":"login_box"}>
          <div className="login">LogIn</div>
          <div className="line" style={{ marginBottom: "10px" }}></div>
          <Form form={form}>
            <Form.Item name={"username"}>
              <Input
                size="large"
                placeholder="Please enter your account"
                prefix={<UserOutlined />}
              ></Input>
            </Form.Item>
            <Form.Item name={"password"}>
              <Input.Password
                size="large"
                placeholder="Please enter your password"
                prefix={<LockOutlined />}
              ></Input.Password>
            </Form.Item>
          </Form>
          <div className="change_box">
            <div style={{ marginTop: "8px", float: "left" }}>
              <input type="checkbox" onChange={onCheckboxChange} checked={remember}/>
              <span className="remark">Remember the password</span>
            </div>
            <div style={{ marginTop: "8px", float: "RIGHT" }}>
              <span className="remark">No account </span>
              <a className="register" href="./register">
              Register
              </a>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              className="login_button"
              type="primary"
              onClick={loginClick}
              loading={loading}
            >
              LogIn
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginContainers;
