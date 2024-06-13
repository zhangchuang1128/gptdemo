import { Button, Input, Form, message, Radio, Space } from "antd";
import React, { useEffect, useState } from "react";
import { document_summary } from "../../../services/sandboxServices";
const UtilsDocumentSummary = () => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [answer, setAnswer] = useState();
  const [loading, setLoading] = useState(false);
  const textareaStyle = { width: "100%", border: "2px solid #39a1d9" }
  useEffect(() => {
    form.setFieldValue(
      "question",
      `A neutron star is the collapsed core of a massive supergiant star, which had a total mass of between 10 and 25 solar masses, possibly more if the star was especially metal-rich.[1] Neutron stars are the smallest and densest stellar objects, excluding black holes and hypothetical white holes, quark stars, and strange stars.[2] Neutron stars have a radius on the order of 10 kilometres (6.2 mi) and a mass of about 1.4 solar masses.[3] They result from the supernova explosion of a massive star, combined with gravitational collapse, that compresses the core past white dwarf star density to that of atomic nuclei.`
    );
  }, []);

  const [value, setValue] = useState("Basic Summary");

  const onClick = () => {
    if (value === "Custom") {
      if (form2.getFieldValue("Custom") === ""||form2.getFieldValue("Custom")===undefined) {
        message.warning("You haven't entered the custom summarization yet");
      } else {
        form1.setFieldValue("answer", "");
        if (form.getFieldValue("question")) {
          setLoading(true);
          document_summary({
            body: form.getFieldValue("question"),
            summary_type: form2.getFieldValue("Custom"),
          }).then((res) => {
            form1.setFieldValue("answer", res?.data);
            setLoading(false);
          });
        } else {
          message.warning("You have not entered the content");
        }
      }
    } else {
      form1.setFieldValue("answer", "");
      if (form.getFieldValue("question")) {
        setLoading(true);
        document_summary({
          body: form.getFieldValue("question"),
          summary_type: value,
        }).then((res) => {
          // console.log(res);
          // setAnswer(res.data)
          form1.setFieldValue("answer", res.data);
          setLoading(false);
        });
      } else {
        message.warning("You have not entered the content");
      }
    }
  };
  //   单选
  const [Custom, setCustom] = useState(false);
  const onChange1 = (val) => {
    // console.log(val.target.value);
    if (val.target.value === "Custom") {
      setCustom(true);
      setValue(val.target.value);
    } else {
      setCustom(false);
      setValue(val.target.value);
    }
  };
  return (
    <>
      <h1 style={{ color: "#6e6e6e" }}>Summarization</h1>
      <div style={{ color: "#6e6e6e", marginBottom: "10px" }}>
        Select a type of summarization
      </div>
      <Form form={form2}>
        <Form.Item>
          <Radio.Group onChange={onChange1} value={value}>
            <Space direction="vertical">
              <Radio value={"Basic Summary"}>
                <span style={{ color: "#6e6e6e" }}>Basic Summary</span>
              </Radio>
              <Radio value={"Bullet Points"}>
                <span style={{ color: "#6e6e6e" }}>Bullet Points</span>
              </Radio>
              <Radio value={"Custom"}>
                <span style={{ color: "#6e6e6e" }}>Custom</span>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        {/* {Custom? <Form.Item name={"Custom"}>
          <Input></Input>
        </Form.Item>:<></>} */}
        <Form.Item
          name={"Custom"}
          style={{ display: Custom ? "block" : "none" }}
        >
          <Input></Input>
        </Form.Item>
      </Form>
      <h2 style={{ color: "#939393" }}>Enter some text to summarize</h2>
      <Form form={form}>
        <Form.Item name={"question"}>
          <TextArea
            disabled={loading}
            style={textareaStyle}
            autoSize={{ minRows: 8, maxRows: 8 }}
          ></TextArea>
        </Form.Item>
      </Form>
      <Button
        type="primary"
        loading={loading}
        style={{ borderRadius: "20px", backgroundColor: "#2eb494" }}
        onClick={onClick}
      >
        Summarize
      </Button>
      <h2 style={{ color: "#939393" }}>Summary result</h2>
      <Form form={form1}>
        <Form.Item name={"answer"}>
          <TextArea
            // disabled={true}
            style={textareaStyle}
            autoSize={{ minRows: 8, maxRows: 8 }}
          ></TextArea>
        </Form.Item>
      </Form>
    </>
  );
};
export default UtilsDocumentSummary;
