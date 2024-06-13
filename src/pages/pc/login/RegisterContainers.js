import React, { useState } from "react";
import request from "umi-request";
import { Image, Form, Input, Col, Button, Row, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  WhatsAppOutlined,
  MailOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";
import logo from "../../../images/logo.png";
import {
  getVerificationCode,
  register,
} from "../../../services/registerServices";
const RegisterContainers = () => {
  const [form] = Form.useForm();
  //   获取验证码按钮
  const [getVerificationLoadding, setGetVerificationLoadding] = useState(false);
  const getVerification = () => {
    setGetVerificationLoadding(true);
    form
      .validateFields()
      .then(() => {
        getVerificationCode({
          email: form.getFieldValue("email"),
        })
          .then(() => {
            setGetVerificationLoadding(false);
          })
          .catch(() => {
            setGetVerificationLoadding(false);
          });
      })
      .catch(() => {
        setGetVerificationLoadding(false);
      });
  };
  //   注册按钮
  const [loading,setloading]=useState(false)
  const registerClick = () => {
    form
      .validateFields()
      .then(() => {
        // console.log(form.getFieldsValue());
        if (
          form.getFieldValue("password") !==
          form.getFieldValue("confirmPassword")
        ) {
          message.warning("The two passwords are inconsistent");
        } else if (!form.getFieldValue("verification")) {
          // 验证码有没有输入
          message.warning("Please enter the verification code");
        } else {
          setloading(true)
          register({
            username: form.getFieldsValue().username,
            password: form.getFieldsValue().password,
            mobile: form.getFieldsValue().number,
            email: form.getFieldsValue().email,
            code: form.getFieldsValue().verification,
          }).then((res) => {
            // console.log(res);
            setloading(false)
            window.location.href = '/login'
          });
        }
      })
      .catch(() => {});
  };
  return (
    <div className="body">
      <div id="model-div" className="regmodel">
        <div className="img_logo">
          <img src={logo} style={{ width: "150px", margin: "auto" }} />
        </div>
        <div className="login_box">
          <div className="login">Register</div>
          <div className="line" style={{ marginBottom: "12px" }}></div>
          <Form form={form} className="registerForm">
            <Form.Item
              name={"username"}
              rules={[
                {
                  required: true,
                  message: "Please input your account!",
                },
                {
                  pattern: new RegExp(/^[a-zA-Z0-9_-]{4,16}$/),
                  message: "4 to 16 digits (letters, numbers, underscores, minus signs)",
                },
              ]}
              validateFirst={true}
            >
              <Input
                size="large"
                placeholder="Please enter your account"
                prefix={<UserOutlined />}
              ></Input>
            </Form.Item>
            <Form.Item
              name={"password"}
              rules={[
                {
                  required: true,
                  message: "Please input your account!",
                },
                {
                  pattern: new RegExp(
                    /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{1,9}$/
                  ),
                  message: "It consists of letters, numbers, special characters, any 2 types, 1-9 characters",
                },
              ]}
              validateFirst={true}
            >
              <Input.Password
                size="large"
                placeholder="Please enter your password"
                prefix={<LockOutlined />}
              ></Input.Password>
            </Form.Item>
            <Form.Item
              name={"confirmPassword"}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                {
                  pattern: new RegExp(
                    /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{1,9}$/
                  ),
                  message: "It consists of letters, numbers, special characters, any 2 types, 1-9 characters",
                },
              ]}
              validateFirst={true}
            >
              <Input.Password
                size="large"
                placeholder="Please confirm your password"
                prefix={<LockOutlined />}
              ></Input.Password>
            </Form.Item>
            <Form.Item
              name={"number"}
              rules={[
                {
                  required: true,
                  message: "Please enter your phone number!",
                },
                {
                  pattern: new RegExp(
                    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
                  ),
                  message: "Please enter the correct phone number",
                },
              ]}
              validateFirst={true}
            >
              <Input
                size="large"
                placeholder="Please enter your telephone"
                prefix={<WhatsAppOutlined />}
              ></Input>
            </Form.Item>
            <Form.Item
              name={"email"}
              rules={[
                {
                  required: true,
                  message: "Please enter your email address!",
                },
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
              ]}
              validateFirst={true}
            >
              <Input
                size="large"
                placeholder="Please enter your email address"
                prefix={<MailOutlined />}
              ></Input>
            </Form.Item>
            <Form.Item
              name={"verification"}
              //    rules={[
              //     {
              //         required: true,
              //         message: 'Please input your Email verification code!',
              //       },
              //   ]}
            >
              <Row>
                <Col span={15}>
                  <Input
                    size="large"
                    placeholder="Please enter your email verification code"
                    prefix={<SafetyCertificateOutlined />}
                  ></Input>
                </Col>
                <Col span={9}>
                  <Button
                    type="primary"
                    style={{ marginLeft: "14px", height: "100%" }}
                    onClick={getVerification}
                    loading={getVerificationLoadding}
                  >
                    Get a verification code
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
          <div className="change_box">
            <div style={{ marginTop: "8px", float: "left" }}>
              <span className="remark">Existing account </span>
              <a className="register" href="./login">
                Login
              </a>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="primary"
              className="login_button"
              onClick={registerClick}
              loading={loading}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterContainers;
