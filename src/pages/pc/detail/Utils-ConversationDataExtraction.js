import { Button, Input, Form, message } from "antd";
import React, { useEffect, useState } from "react";
import { conversation_data_extraction } from "../../../services/sandboxServices";
const UtilsConversationDataExtraction = () => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [answer, setAnswer] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    form.setFieldValue(
      "question",
      `   User: Hi there, I’m off between August 25 and September 11. I saved up 4000 for a nice trip. If I flew out from San Francisco, what are your suggestions for where I can go?
  Agent: For that budget you could travel to cities in the US, Mexico, Brazil, Italy or Japan. Any preferences?
  User: Excellent, I’ve always wanted to see Japan. What kind of hotel can I expect?
  Agent: Great, let me check what I have. First, can I just confirm with you that this is a trip for one adult?
  User: Yes it is
  Agent: Great, thank you, In that case I can offer you 15 days at HOTEL Sugoi, a 3 star hotel close to a Palace. You would be staying there between August 25th and September 7th. They offer free wifi and have an excellent guest rating of 8.49/10. The entire package costs 2024.25USD. Should I book this for you?
  User: That sounds really good actually. Lets say I have a date I wanted to bring…would Japan be out of my price range then?
  Agent: Yes, unfortunately the packages I have for two in Japan do not fit in your budget. However I can offer you a 13 day beach getaway at the 3 star Rose Sierra Hotel in Santo Domingo. Would something like that interest you?
  User: How are the guest ratings for that place?
  Agent: 7.06/10, so guests seem to be quite satisfied with the place.
  User: TRUE. You know what, I’m not sure that I’m ready to ask her to travel with me yet anyway. Just book me for Sugoi
  Agent:I can do that for you! 
  User:Thanks!
  Agent: Can I help you with some other booking today?
  User:No, thanks!


  Execute these tasks:
  -	Summarize the conversation, key: summary
  -      Customer budget none if not detected, key: budget
  -      Departure city, key: departure
  -      Destination city, key: destination
  -      Selected country, key: country
  -      Which hotel the customer choose?, key: hotel
  -	Did the agent remind the customer about the evaluation survey? , key:evaluation true or false as bool
  -	Did the customer mention a product competitor?, key: competitor true or false as bool
  -	Did the customer ask for a discount?, key:discount true or false as bool
  - Agent asked for additional customer needs. key: additional_requests
  - Was the customer happy with the resolution? key: satisfied

  Answer in JSON machine-readable format, using the keys from above.
  Format the ouput as JSON object called "results". Pretty print the JSON and make sure that is properly closed at the end.`
    );
  }, []);
  const onClick = () => {
    form1.setFieldValue("answer", "");
    if (form.getFieldValue("question")) {
      setLoading(true);
      conversation_data_extraction({
        body: form.getFieldValue("question"),
      }).then((res) => {
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
      <h1 style={{ color: "#6e6e6e" }}>Conversation data extraction</h1>
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
        Execute tasks
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
export default UtilsConversationDataExtraction;
