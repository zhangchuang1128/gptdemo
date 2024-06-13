import React, { useEffect, useState } from "react";
import {
  Image,
  Form,
  Input,
  Divider,
  Button,
  Row,
  Col,
  message,
  Rate,
  Tabs,
  Spin,
  Select
} from "antd";
import FavoritesQuestion from "./FavoritesQuestion";
import HistoryQuestions from "./HistoryQuestions";
import { SendOutlined } from "@ant-design/icons";
import { bigpt } from "../../../services/chatGPTServices";
import {getDocumentLibraryList} from "../../../services/fileServices"

import {
  addFavorites,
  deleteFavoritesByQuestion,
} from "../../../services/favoritesServices";
import MarkdownRenderer from "../../../utils/MarkdownRenderer";
const BIGPTQueries = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [inputShow, setInputShow] = useState(false);
  const [messages, setMessages] = useState();
  const [showmessages, setShowMessages] = useState([]);
  const [chat_gptSend_loading, setChat_gptSend_loading] = useState(false);
  const [chatGptInputDisabled, setChatGptInputDisabled] = useState(false);
  const getTimeAMPMFormat = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes + " " + ampm;
  };
  // 历史提问更新
  const [updateHistory, setUpdateHistory] = useState({});

  const chat_gptSend = () => {
    if (form1.getFieldValue("chatGptInput").trim()) {
      setMessages({ question: form1.getFieldValue("chatGptInput").trim(),folder_path:form2.getFieldValue("DocumentLibrarySelect") });
    } else {
      message.warning("You have not entered the question");
    }
  };
  const onClick = () => {
    chat_gptSend();
  };
  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      chat_gptSend();
    }
  };
  // 发送消息监听请求给showmessages push值
  useEffect(() => {
    // console.log(messages);
    if (messages) {
      setChat_gptSend_loading(true);
      setChatGptInputDisabled(true);
      bigpt(messages).then((res) => {
        // console.log(res);
        setShowMessages([
          ...showmessages,
          { question: form1.getFieldValue("chatGptInput").trim() },
          {
            answer: res.data.answer.replace(/\\n/g, "<br />"),
            type: res.data.type,
          },
        ]);
        setChat_gptSend_loading(false);
        setChatGptInputDisabled(false);
        form1.setFieldValue("chatGptInput", "");
        // 发送新消息后更新历史记录
        setUpdateHistory({});
      });
    }
  }, [messages]);
  // 清除按钮
  const clearMessages = () => {
    setMessages();
    setShowMessages([]);
  };
  // 收藏按钮
  // const [favorites,setFavorites]=useState()
  const [updateFavorites, setUpdateFavorites] = useState({});
  const favoritesChange = (item, index) => {
    // console.log(showmessages[index + 1]);
    return (e) => {
      if (e === 1) {
        addFavorites({
          question: item.question.trim(),
          answer: showmessages[index + 1].answer,
          type: 3,
        }).then((res) => {
          // console.log(res);
          message.success("Successful collection");
          setUpdateFavorites({});
        });
      } else if (e === 0) {
        deleteFavoritesByQuestion({ question: item.question.trim() }).then(() => {
          message.success("Cancel collection");
          setUpdateFavorites({});
        });
      }
    };
  };

  // 收藏和历史提问Tabs
  const items = [
    {
      key: "1",
      label: <span className="TabsTitle">Collect questions</span>,
      children: (
        <FavoritesQuestion updateFavorites={updateFavorites} type={3} />
      ),
    },
    {
      key: "2",
      label: <span className="TabsTitle">Historical questions</span>,
      children: <HistoryQuestions updateHistory={updateHistory} type={3} />,
    },
  ];
  const onTabsChange = (e) => {
    // console.log(e);
  };
    // 文档库下拉框内容
    const [documentLibraryOptions, setDocumentLibraryOptions] = useState([]);
    useEffect(() => {
      getDocumentLibraryList({ document_type: "bi",size:10000}).then((res) => {
        console.log(res.data.list);
        setDocumentLibraryOptions(
          res.data.list.map((item) => {
            return {
              label: item.folder_path,
              value: item.folder_path,
            };
          })
        );
      });
    }, []);
    useEffect(() => {
      form2.setFieldValue(
        "DocumentLibrarySelect",
        documentLibraryOptions[0]?.value
      );
    }, [documentLibraryOptions]);
  return (
    <Row wrap={false} style={{ height: "100%" }}>
      <Col span={16} style={{ height: "100%" }}>
        <Spin tip="Loading" size="large" spinning={chat_gptSend_loading}>
          <div style={{ height: "100%", padding: "5px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form form={form2}>
                <Form.Item label="文档库" name={"DocumentLibrarySelect"}>
                  <Select
                    style={{ width: "200px" }}
                    options={documentLibraryOptions}
                  />
                </Form.Item>
              </Form>
            </div>
            <br style={{ clear: "both" }}></br>
            <div className="line"></div>
            <div className="messagesBox">
              {showmessages.map((item, index) => {
                // console.log(showmessages);
                return (
                  <div key={index}>
                    <div
                      style={{
                        display: "flex",
                        // alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <div className="photo">
                        {item.question || item.question === 0 ? "Q" : "A"}
                      </div>
                      <div
                        style={{
                          fontSize:
                            item.question || item.question === 0
                              ? "16px"
                              : "14px",
                          fontWeight:
                            item.question || item.question === 0
                              ? "700"
                              : "500",
                          width:item.question || item.question === 0? "85%":"100%",
                          fontFamily:"Microsoft Yahei",
                          marginTop:item.question || item.question === 0?"10px":"0px"
                        }}
                      >
                        {item.answer || item.answer === 0 ? (
                          item.type === "text" ? (
                            //   getText(item.answer):
                            <div
                              style={{
                                whiteSpace: "pre-wrap",
                                backgroundColor: "#f0f2f6",
                                borderRadius: "20px",
                                padding: "20px",
                              }}
                            >
                              {item.answer}
                            </div>
                          ) : (
                            <div
                              style={{
                                whiteSpace: "pre-wrap",
                                backgroundColor: "#f0f2f6",
                                borderRadius: "20px",
                                padding: "20px",
                              }}
                            >
                              <img src={`/${item.answer}`} />
                            </div>
                          )
                        ) : (
                          item.question
                        )}
                      </div>
                      {item.question || item.question === 0 ? (
                        <div className="Rate_box">
                          <Rate
                            className="Favorites"
                            count={1}
                            onChange={favoritesChange(item, index)}
                          />
                          <div style={{ color: "#39a1d9",paddingTop:"6px" }}>Collect</div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    {item.question || item.question === 0 ? (
                      <></>
                    ) : (
                      <div className="messageTime">
                        {getTimeAMPMFormat(new Date())}
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ position: "sticky", bottom: "0px" }}>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  {showmessages.length > 0 ? (
                    <Button
                      className="clearChat"
                      type="primary"
                      onClick={clearMessages}
                    >
                      Clear Chat
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
                <Form form={form1}>
                  <Form.Item name={"chatGptInput"}>
                    <Input
                      className="chatGptInput"
                      size="large"
                      disabled={chatGptInputDisabled}
                      onKeyDown={onKeyDown}
                      placeholder="You can enter your question here..."

                    />
                  </Form.Item>
                </Form>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  className="inputButton"
                  // onClick={chat_gptSend}
                  onClick={onClick}
                  loading={chat_gptSend_loading}
                />
              </div>
            </div>
          </div>
        </Spin>
      </Col>
      <Col span={7} style={{ marginLeft: "30px", height: "100%" }}>
        <div style={{ height: "100%", padding: "5px" }}>
          <Tabs defaultActiveKey="1" items={items} onChange={onTabsChange} />
        </div>
      </Col>
    </Row>
  );
};
export default BIGPTQueries;
