import { Button, Input, Form, message } from "antd";
import React, { useEffect, useState } from "react";
import { sandbox } from "../../../services/sandboxServices";
const Sandbox = () => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [answer, setAnswer] = useState();
  const [loading, setLoading] = useState(false);
  const text = `Legal clause: The Company and the Founders will provide the Investors with customary representations and warranties examples of which are set out in Appendix 4 and the Founders will provide the Investors with customary non-competition, non-solicitation and confidentiality undertakings.
 
  Plain English: The company and its founders will provide the usual assurances and guarantees on facts about the business. The founders will also agree not to work for competitors, poach employees or customers when they leave the company, and respect confidentiality. 
  
  Legal clause: In the event of an initial public offering of the Companys shares on a US stock 
  exchange the Investors shall be entitled to registration rights customary in transactions of this type (including two demand rights and unlimited shelf and piggy-back rights), with the expenses paid by the Company. 
  
  Plain English: If the Company does an IPO in the USA, investors have the usual rights to include 
  their shares in the public offering and the costs of doing this will be covered by the Company. 
  
  Legal clause: Upon liquidation of the Company, the Series A Shareholders will receive in preference to all other shareholders an amount in respect of each Series A Share equal to one times the Original Issue Price (the "Liquidation Preference"), plus all accrued but unpaid dividends. To the extent that the Company has assets remaining after the distribution of that amount, the Series A Shareholders will participate with the holders of Ordinary Shares pro rata to the number of shares held on an as converted basis. 
  
  Plain English:`;

  useEffect(() => {
    form.setFieldValue("question", text);
  }, []);
  const onClick = () => {
    form1.setFieldValue("answer", "");
    if (form.getFieldValue("question")) {
      setLoading(true);
      sandbox({ body: form.getFieldValue("question") }).then((res) => {
        // console.log(res);
        // setAnswer(res.data)
        form1.setFieldValue("answer", res.data);
        setLoading(false);
      });
    } else {
      message.warning("You have not entered the prompt");
    }
  };
  return (
    <>
      <h1 style={{ color: "#6e6e6e" }}>Input prompt</h1>
      <p style={{ color: "#939393" }}>Prompt</p>
      <Form form={form}>
        <Form.Item name={"question"}>
          <TextArea
            disabled={loading}
            style={{ width: "80%", border: "2px solid #39a1d9" }}
            autoSize={{ minRows: 13, maxRows: 13 }}
          ></TextArea>
        </Form.Item>
      </Form>
      <br></br>

      <Button
        type="primary"
        loading={loading}
        style={{ borderRadius: "20px", backgroundColor: "#2eb494" }}
        onClick={onClick}
      >
        Use the prompts to test
      </Button>
      <p style={{ color: "#939393" }}>OpenAI result</p>
      <Form form={form1}>
        <Form.Item name={"answer"}>
          <TextArea
            // disabled={true}
            style={{ width: "80%", border: "2px solid #39a1d9" }}
            autoSize={{ minRows: 13, maxRows: 13 }}
          ></TextArea>
        </Form.Item>
      </Form>
    </>
  );
};
export default Sandbox;
