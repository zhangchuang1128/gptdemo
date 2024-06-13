import React, { useEffect, useState, useRef } from "react";
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
  Select,
} from "antd";
import FavoritesQuestion from "./FavoritesQuestion";
import HistoryQuestions from "./HistoryQuestions";
import { SendOutlined } from "@ant-design/icons";
import { emgpt } from "../../../services/chatGPTServices";
import { getDocumentLibraryList } from "../../../services/fileServices";
import Clipboard from "clipboard";

import {
  addFavorites,
  deleteFavoritesByQuestion,
} from "../../../services/favoritesServices";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import MarkdownRenderer from "../../../utils/MarkdownRenderer";
const EmbeddingChat = () => {
  const md = MarkdownRenderer();

  const [form] = Form.useForm();
  const [form1] = Form.useForm();
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

  const [text, setText] = useState(""); // 字段
  // 收藏按钮显示
  const [rateValue, setRateValue] = useState(0);

  // 历史提问更新
  const [updateHistory, setUpdateHistory] = useState({});
  //   之前的会话记录
  const [chat_history, setChat_history] = useState([]);

  const [showNew, setShowNew] = useState(false);

  const [newQuestion, setNewQuestion] = useState("");
  const chat_gptSend = () => {
    if (form1.getFieldValue("chatGptInput").trim()) {
      setNewQuestion(form1.getFieldValue("chatGptInput").trim());

      // setMessages({
      //   question: form1.getFieldValue("chatGptInput").trim(),
      //   chat_history: chat_history,
      //   folder_path:form.getFieldValue("DocumentLibrarySelect")
      // });
      setShowNew(true);
      // console.log(messages);
      // if (messages) {
      //不是第一次点击的话
      // setShowHistory(true);
      // console.log("第二次问答-第一次的答案", text);
      // console.log("第二次问答-第一次的messages", messages);

      if (messages) {
        // 第二次以后问答
        // console.log("第二以后次问答");

        // console.log(
        //   "messages:",
        //   messages,
        //   "q:",
        //   form1.getFieldValue("chatGptInput"),
        //   "a:",
        //   text
        // );
        // setChat_history([
        //   ...chat_history,
        //   [form1.getFieldValue("chatGptInput").trim(), text],
        // ]);
        let emchat_histoy = chat_history;
        emchat_histoy.push([messages.question, text]);
        setChat_history(emchat_histoy);
        console.log(emchat_histoy);
        setShowMessages([
          ...showmessages,
          {
            role: "user",
            content: messages.question,
            rateValue: rateValue,
          },
          { content: text },
        ]);
        setMessages({
          question: form1.getFieldValue("chatGptInput").trim(),
          chat_history: emchat_histoy,
          folder_path: form.getFieldValue("DocumentLibrarySelect"),
        });
      } else {
        setMessages({
          question: form1.getFieldValue("chatGptInput").trim(),
          chat_history: chat_history,
          folder_path: form.getFieldValue("DocumentLibrarySelect"),
        });
      }

      // }
      setText("");
      setRateValue(0);
      form1.setFieldValue("chatGptInput", "");
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
      // console.log(messages);
      // setChat_gptSend_loading(true);
      // setChatGptInputDisabled(true);
      // emgpt(messages).then((res) => {
      //   // console.log(res);
      // setChat_history([
      //   ...chat_history,
      //   [form1.getFieldValue("chatGptInput").trim(), res.data],
      // ]);
      //   setShowMessages([
      //     ...showmessages,
      //     { question: form1.getFieldValue("chatGptInput").trim() },
      //     { answer: res.data },
      //   ]);
      //   setChat_gptSend_loading(false);
      //   setChatGptInputDisabled(false);
      //   form1.setFieldValue("chatGptInput", "");
      //   // // 发送新消息后更新历史记录
      //   setUpdateHistory({});
      // });

      setChat_gptSend_loading(true);
      setChatGptInputDisabled(true);
      const fetchUrl =
        process.env.NODE_ENV === "production"
          ? `http://${window.location.host}/events/em_gpt/stream_chat/`
          : "http://192.168.3.27:8004/events/em_gpt/stream_chat/";
      fetchEventSource(fetchUrl, {
        method: "POST",
        // signal: signal,
        headers: {
          // "Content-Type": "text/event-stream",
          "Content-Type": "*/*",
          Accept: "*/*",
          Authorization: `${localStorage.getItem("token")}`,
        },
        openWhenHidden: true, // 使切换标签后连接不中断
        body: JSON.stringify(messages),
        // body: params,
        onmessage(event) {
          // console.log(event);
          // if (abort) {
          // controller.abort();
          // } else {
          // // console.log(JSON.parse(event.data).answer);
          // if (
          //   JSON.parse(event.data).answer?.finish_reason !== "stop" &&
          //   JSON.parse(event.data).answer?.delta.content !== null
          // ) {
          const data = JSON.parse(event.data).answer;
          // setField((field) => {
          //   console.log("message里的field", field);
          //   field.push(data);
          //   return field;
          // });
          console.log(data);
          setText((text) => text.concat(data));
          // } else if (
          //   JSON.parse(event.data).answer?.finish_reason === "stop"
          // ) {
          // setShowMessages([
          //   ...showmessages,
          //   { role: "user", content: form1.getFieldValue("chatGptInput") },
          //   { content: field },
          // ]);
          // setField([]);
          // console.log("完成了111111111111111111111111111111111111");

          // }
          // }
        },
        onclose() {
          setChat_gptSend_loading(false);
          setChatGptInputDisabled(false);
          // 发送新消息后更新历史记录
          setUpdateHistory({});
          // new AbortController().abort()
        },
        onerror(err) {
          console.log(`报错${err}`);
        },
      });
    }
  }, [messages]);
  // 清除按钮
  const clearMessages = () => {
    setMessages();
    setShowMessages([]);
    setChat_history([]);
    setNewQuestion("");
    setShowNew(false);
  };
  // 收藏按钮
  // const [favorites,setFavorites]=useState()
  const [updateFavorites, setUpdateFavorites] = useState({});
  const favoritesChange = (item, index) => {
    // console.log(item);
    // console.log("showmessages:",showmessages,"index:",index);
    // console.log();
    // console.log(showmessages[index + 1]);

    return (e) => {
      setShowMessages((showmessages) => {
        showmessages[index].rateValue
          ? (showmessages[index].rateValue = 0)
          : (showmessages[index].rateValue = 1);
        return showmessages;
      });
      if (e === 1) {
        addFavorites({
          question: item.content.trim(),
          answer: showmessages[index + 1].content,
          type: 2,
        }).then((res) => {
          // console.log(res);
          message.success("Successful collection");
          setUpdateFavorites({});
        });
      } else if (e === 0) {
        deleteFavoritesByQuestion({ question: item.content.trim() }).then(
          () => {
            message.success("Cancel collection");
            setUpdateFavorites({});
          }
        );
      }
    };
  };

  // 最新问题收藏按钮
  const newFavoritesChange = (e) => {
    // console.log(messages,text);
    setRateValue(rateValue === 1 ? 0 : 1);
    if (e === 1) {
      addFavorites({
        question: messages.question,
        answer: text,
        type: 2,
      }).then((res) => {
        // console.log(res);
        message.success("Successful collection");
        setUpdateFavorites({});
      });
    } else if (e === 0) {
      deleteFavoritesByQuestion({ question: messages.question }).then(() => {
        message.success("Cancel collection");
        setUpdateFavorites({});
      });
    }
  };

  // 收藏和历史提问Tabs
  const items = [
    {
      key: "1",
      label: <span className="TabsTitle">Collect questions</span>,
      children: (
        <FavoritesQuestion updateFavorites={updateFavorites} type={2} />
      ),
    },
    {
      key: "2",
      label: <span className="TabsTitle">Historical questions</span>,
      children: <HistoryQuestions updateHistory={updateHistory} type={2} />,
    },
  ];
  const onTabsChange = (e) => {
    // console.log(e);
  };
  // 文档库下拉框内容
  const [documentLibraryOptions, setDocumentLibraryOptions] = useState([]);
  useEffect(() => {
    getDocumentLibraryList({ document_type: "em", size: 10000 }).then((res) => {
      // console.log(res.data.list);
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
    form.setFieldValue(
      "DocumentLibrarySelect",
      documentLibraryOptions[0]?.value
    );
  }, [documentLibraryOptions]);

  // 滚动到最底部
  const messagesEnd = useRef(null);
  const scrollToBottom = () => {
    if (messagesEnd && messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    // 滚动到底部div
    scrollToBottom();
    // 代码复制功能
    const clipboard = new Clipboard("#copy-btn");
    // 复制成功失败的提示
    clipboard.on("success", (e) => {
      message.success("复制成功");
    });
    clipboard.on("error", (e) => {
      message.error("复制失败");
    });
    // 清理函数，确保只有一个clipboard实例。
    return () => {
      clipboard.destroy();
    };
  });
  return (
    <Row wrap={false} style={{ height: "100%" }}>
      <Col span={16} style={{ height: "100%" }}>
        {/* <Spin tip="Loading" size="large" spinning={chat_gptSend_loading}> */}
        <div style={{ height: "100%", padding: "5px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form form={form}>
              <Form.Item label="文档库" name={"DocumentLibrarySelect"}>
                <Select
                  disabled={chat_gptSend_loading}
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
                      {item.role === "user" ? "Q" : "A"}
                    </div>
                    <div
                      style={{
                        fontSize: item.role === "user" ? "16px" : "14px",
                        fontWeight: item.role === "user" ? "700" : "500",
                        width: item.role === "user" ? "85%" : "100%",
                        fontFamily: "Microsoft Yahei",
                        marginTop: item.role === "user" ? "10px" : "0",
                      }}
                    >
                      {item.role === "user" ? (
                        item.content
                      ) : (
                        <div
                          className="mdStyle"
                          style={{
                            whiteSpace: "pre-wrap",
                            padding: "20px",
                            backgroundColor: "#f0f2f6",
                            borderRadius: "20px",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: md.render(item?.content),
                          }}
                        ></div>
                      )}
                    </div>
                    {item.role === "user" ? (
                      <div className="Rate_box">
                        <Rate
                          className="Favorites"
                          disabled={chat_gptSend_loading}
                          count={1}
                          onChange={favoritesChange(item, index)}
                          value={item.rateValue ? item.rateValue : 0}
                        />
                        <div style={{ color: "#39a1d9", paddingTop: "6px" }}>
                          Collect
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  {item.role === "user" ? (
                    <></>
                  ) : (
                    <div className="messageTime">
                      {getTimeAMPMFormat(new Date())}
                    </div>
                  )}
                </div>
              );
            })}
            {showNew ? (
              <div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      // alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div className="photo">{"Q"}</div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        width: "85%",
                        fontFamily: "Microsoft Yahei",
                        marginTop: "10px",
                      }}
                    >
                      {newQuestion}
                    </div>
                    <div className="Rate_box">
                      <Rate
                        className="Favorites"
                        count={1}
                        disabled={chat_gptSend_loading}
                        onChange={newFavoritesChange}
                        value={rateValue}
                      />
                      <div style={{ color: "#39a1d9", paddingTop: "6px" }}>
                        Collect
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      // alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div className="photo">{"A"}</div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        width: "100%",
                        fontFamily: "Microsoft Yahei",
                        marginTop: "0",
                      }}
                    >
                      <div
                        style={{
                          whiteSpace: "pre-wrap",
                          padding: "20px",
                          backgroundColor: "#f0f2f6",
                          borderRadius: "20px",
                        }}
                      >
                        {text ? (
                          <div
                          className="mdStyle"
                            dangerouslySetInnerHTML={{
                              __html: md.render(text),
                            }}
                          />
                        ) : (
                          <Spin></Spin>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="messageTime">
                    {getTimeAMPMFormat(new Date())}
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div style={{ position: "sticky", bottom: "0px" }}>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                {showNew ? (
                  <Button
                    className="clearChat"
                    type="primary"
                    onClick={clearMessages}
                    // loading={chat_gptSend_loading}
                    disabled={chat_gptSend_loading}
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
            <div
              style={{ clear: "both", height: "1px", width: "100%" }}
              ref={messagesEnd}
            ></div>
          </div>
        </div>
        {/* </Spin> */}
      </Col>
      <Col span={7} style={{ marginLeft: "30px", height: "100%" }}>
        <div style={{ height: "100%", padding: "5px" }}>
          <Tabs defaultActiveKey="1" items={items} onChange={onTabsChange} />
        </div>
      </Col>
    </Row>
  );
};
export default EmbeddingChat;
