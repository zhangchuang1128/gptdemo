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
import { SendOutlined, DownOutlined } from "@ant-design/icons";
import { chatgpt, preselectedRole } from "../../../services/chatGPTServices";
import {
  addFavorites,
  deleteFavoritesByQuestion,
} from "../../../services/favoritesServices";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import MarkdownRenderer from "../../../utils/MarkdownRenderer";
import Clipboard from "clipboard";

const ChatGPT = () => {
  // console.log(window.config);
  const md = MarkdownRenderer();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [inputShow, setInputShow] = useState(false);
  const [messages, setMessages] = useState([]);
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
  const [rateValue, setRateValue] = useState(0);
  // // 点击右侧删除收藏函数回调
  // const [delete_question, setdelete_question] = useState();
  // const deleteFavoriteFun = (v) => {
  //   // console.log(v);
  //   setdelete_question(v.question);
  // };
  // 历史提问更新
  const [updateHistory, setUpdateHistory] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const chat_gptSend = () => {
    if (form1.getFieldValue("chatGptInput")?.trim()) {
      setShowNew(true);
      if (messages.length > 0) {
        //不是第一次点击的话
        setShowHistory(true);
        console.log("第二次问答-第一次的答案", text);
        console.log("第二次问答-第一次的messages", messages);
        setShowMessages([
          ...showmessages,
          {
            role: "user",
            content: messages[messages.length - 1].content,
            rateValue: rateValue,
          },
          { content: text },
        ]);
      }
      if (messages.length > 0) {
        setMessages([
          ...messages,
          {
            role: "assistant",
            content: text,
          },
          { role: "user", content: form1.getFieldValue("chatGptInput").trim() },
        ]);
      } else {
        setMessages([
          ...messages,
          {
            role: "system",
            content: form.getFieldValue("systermRole")
              ? form.getFieldValue("systermRole")
              : "",
          },
          { role: "user", content: form1.getFieldValue("chatGptInput").trim() },
        ]);
      }
      setText("");
      setRateValue(0);
      form1.setFieldValue("chatGptInput", "");
    } else {
      message.warning("You have not entered the question");
    }
  };
  useEffect(() => {
    console.log("第二次问答-第一次的showmessages", showmessages, showHistory);
  }, [showmessages]);
  useEffect(() => {
    console.log("监听每一次的messages", messages);
    console.log(messages.length - showmessages.length);
  }, [messages]);

  const onClick = () => {
    chat_gptSend();
  };
  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      chat_gptSend();
    }
  };
  // 发送消息监听请求给showmessages push值

  // const [field, setField] = useState([]); // 字段
  const [text, setText] = useState(""); // 字段
  // const controller = new AbortController();
  // const signal = controller.signal;
  // const[abort, setAbort] = useState(false);
  useEffect(() => {
    if (messages.length > 0) {
      setChat_gptSend_loading(true);
      setChatGptInputDisabled(true);
      const fetchUrl =
        process.env.NODE_ENV === "production"
          ? `http://${window.location.host}/events/chat_gpt/stream_chat/`
          : "http://192.168.3.27:8004/events/chat_gpt/stream_chat/";
      fetchEventSource(fetchUrl, {
        method: "POST",
        // signal: signal,
        headers: {
          "Content-Type": "text/event-stream",
          Accept: "*/*",
          Authorization: `${localStorage.getItem("token")}`,
        },
        openWhenHidden: true, // 使切换标签后连接不中断
        body: JSON.stringify({ messages: messages }),
        // body: params,
        onmessage(event) {
          // if (abort) {
          // controller.abort();
          // } else {
          if (JSON.parse(event.data).choices[0] === undefined) {
            // form1.setFieldValue("chatGptInput", "");
          }
          // console.log(JSON.parse(event.data).choices[0]);
          if (
            JSON.parse(event.data).choices[0]?.finish_reason !== "stop" &&
            JSON.parse(event.data).choices[0]?.delta.content !== null
          ) {
            const data = JSON.parse(event.data).choices[0]?.delta.content
              ? JSON.parse(event.data).choices[0]?.delta.content
              : "";
            // setField((field) => {
            //   console.log("message里的field", field);
            //   field.push(data);
            //   return field;
            // });
            setText((text) => text.concat(data));
          } else if (
            JSON.parse(event.data).choices[0]?.finish_reason === "stop"
          ) {
            // setShowMessages([
            //   ...showmessages,
            //   { role: "user", content: form1.getFieldValue("chatGptInput") },
            //   { content: field },
            // ]);
            // setField([]);
            console.log("完成了111111111111111111111111111111111111");
            setChat_gptSend_loading(false);
            setChatGptInputDisabled(false);
            // setTimeout(() => {
            // }, 100);
            // 发送新消息后更新历史记录
            setUpdateHistory({});
          }
          // }
        },
        // onclose(){
        //   new AbortController().abort()
        // },
        onerror(err) {
          console.log(`报错${err}`);
        },
      });
    }
  }, [messages]);

  // const [newFiled, setNewFiled] = useState("");
  // useEffect(() => {
  //   console.log(showmessages);
  //   setNewFiled("");
  //   showmessages[showmessages.length - 1]?.content.forEach((item) => {
  //     setTimeout(() => {
  //       // console.log(item);
  //       setNewFiled((newFiled) => newFiled.concat(item));
  //     }, 2000);
  //   });
  // }, [showmessages]);
  // useEffect(() => {
  //   console.log(newFiled);
  // }, [newFiled]);

  // 清除按钮
  const clearMessages = () => {
    setMessages([]);
    setShowMessages([]);
    setShowHistory(false);
    setShowNew(false);
  };
  // 收藏按钮
  // const [favorites,setFavorites]=useState()
  const [updateFavorites, setUpdateFavorites] = useState({});
  const favoritesChange = (item, index) => {
    return (e) => {
      setShowMessages((showmessages) => {
        showmessages[index].rateValue
          ? (showmessages[index].rateValue = 0)
          : (showmessages[index].rateValue = 1);
        return showmessages;
      });
      if (e === 1) {
        console.log(showmessages[index]);
        addFavorites({
          question: item.content.trim(),
          answer: showmessages[index + 1].content,
          type: 1,
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
    setRateValue(rateValue === 1 ? 0 : 1);
    // console.log(e);
    if (e === 1) {
      // console.log(messages[messages.length - 1].content);
      // console.log(text);

      addFavorites({
        question: messages[messages.length - 1].content,
        answer: text,
        type: 1,
      }).then((res) => {
        // console.log(res);
        message.success("Successful collection");
        setUpdateFavorites({});
      });
    } else if (e === 0) {
      deleteFavoritesByQuestion({
        question: messages[messages.length - 1].content,
      }).then(() => {
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
        <FavoritesQuestion
          // deleteFavoriteFun={deleteFavoriteFun}
          updateFavorites={updateFavorites}
          type={1}
        />
      ),
    },
    {
      key: "2",
      label: <span className="TabsTitle">Historical questions</span>,
      children: <HistoryQuestions updateHistory={updateHistory} type={1} />,
    },
  ];
  const onTabsChange = (e) => {
    // console.log(e);
  };
  // 角色预选下拉框
  const [show, setShow] = useState(true);
  const [options, setOptions] = useState([]);
  const [optionsShow, setOptionsShow] = useState(false);
  useEffect(() => {
    preselectedRole().then((res) => {
      const result = res.data.map((item) => {
        return { value: item.message, label: item.message };
      });
      setOptions(result);
    });
  }, []);
  const onRoleChange = (e) => {
    setShow(true);
    setOptionsShow(false);
  };
  const onRoleBlur = (e) => {
    // console.log("失去焦点",e);
    setOptionsShow(false);
    setShow(true);
  };
  const onRoleFocus = () => {
    // console.log("获取焦点");
    setOptionsShow(true);
  };

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
  const isMobile = () => {
    // console.log();
    console.log(navigator.userAgent);
    return !!navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
  };
  return (
    <>
      {isMobile() ? (
        <>
          <div
            style={{ height: "100%", padding: "5px", boxSizing: "border-box" }}
          >
            {/* <Divider /> */}
            <Button
              type="primary"
              // loading={chat_gptSend_loading}
              disabled={chat_gptSend_loading}
              onClick={() => {
                setInputShow(true);
              }}
              style={{
                backgroundColor: "#2fb79c",
                fontWeight: "700",
                padding: "4px 19px",
                borderRadius: "15px",
                marginBottom: "8px",
                marginTop: "10px",
              }}
            >
              Add System Role
            </Button>
            {inputShow ? (
              <Form form={form} style={{ position: "relative" }}>
                <Form.Item
                  name={"systermRole"}
                  style={{
                    marginBottom: "8PX",
                    display: show ? "inline-block" : "none",
                    width: "100%",
                  }}
                >
                  <Input
                    // allowClear
                    showSearch
                    disabled={chat_gptSend_loading}
                    suffix={
                      <DownOutlined
                        style={{ color: "rgba(199, 199, 199)" }}
                        onClick={(e) => {
                          setShow(false);
                          setTimeout(() => {
                            document.getElementById("addRoleSelect").focus();
                          }, 100);
                        }}
                      />
                    }
                    options={options}
                    className="addSystemRole"
                    placeholder="You are a helpful assistant,answer as concisely as possible..."
                  />
                </Form.Item>
                <Form.Item
                  name={"systermRole"}
                  style={{
                    marginBottom: "8PX",
                    display: show ? "none" : "inline-block",
                    width: "100%",
                  }}
                >
                  <Select
                    id="addRoleSelect"
                    disabled={chat_gptSend_loading}
                    // allowClear
                    // showSearch
                    onChange={onRoleChange}
                    onBlur={onRoleBlur}
                    onFocus={onRoleFocus}
                    options={options}
                    // defaultOpen={true}
                    open={optionsShow}
                    className="addSystemRole"
                    placeholder="You are a helpful assistant,answer as concisely as possible..."
                  />
                </Form.Item>
              </Form>
            ) : (
              <>
                <br></br>
                <br></br>
              </>
            )}
            <div className="line"></div>
            <div className="messagesBox">
              {showHistory ? (
                showmessages.map((item, index) => {
                  // console.log(item);
                  return (
                    <div key={index}>
                      <div
                        style={{
                          display: "flex",
                          // alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        {/* <div className="photo">
                          {item?.role === "user" ? "Q" : "A"}
                        </div> */}
                        <div
                          style={{
                            overflow:"auto",
                            marginLeft:item?.role === "user" ?"5px":"0px",
                            fontSize: item?.role === "user" ? "16px" : "14px",
                            fontWeight: item?.role === "user" ? "700" : "500",
                            width: item?.role === "user" ? "85%" : "100%",
                            whiteSpace: "normal",
                            backgroundColor:
                              item?.role === "user" ? "#ffffff" : "#f0f2f6",
                            padding: item?.role === "user" ? "0" : "20px",
                            borderRadius: item?.role === "user" ? "0" : "20px",
                            // verticalAlign:"center"
                            fontFamily: "Microsoft Yahei",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {item.role === "user" ? (
                            item?.content
                          ) : (
                            <div
                              className="mdStyle"
                              dangerouslySetInnerHTML={{
                                __html: md.render(item?.content),
                              }}
                            />
                          )}
                        </div>
                      </div>
                      {item?.role === "user" ? (
                        <></>
                      ) : (
                        <div className="messageTime">
                          {getTimeAMPMFormat(new Date())}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <></>
              )}

              <div style={{ display: showNew ? "block" : "none" }}>
                <div>
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "10px",
                    }}
                  >
                    {/* <div className="photo">{"Q"}</div> */}
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        marginLeft:"5px",
                        width: "100%",
                        whiteSpace: "normal",
                        backgroundColor: "#ffffff",
                        padding: "0",
                        borderRadius: "0",
                        // verticalAlign:"center"
                        fontFamily: "Microsoft Yahei",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="mdStyle"
                        dangerouslySetInnerHTML={{
                          __html: md.render(
                            messages.length > 1
                              ? messages[messages.length - 1].content
                              : ""
                          ),
                        }}
                      />
                      {/* <div>问题</div> */}
                    </div>
                  </div>
                  <></>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "10px",
                    }}
                  >
                    {/* <div className="photo">{"A"}</div> */}
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        width: "100%",
                        whiteSpace: "normal",
                        backgroundColor: "#f0f2f6",
                        padding: "20px",
                        borderRadius: "20px",
                        // verticalAlign:"center"
                        fontFamily: "Microsoft Yahei",
                        display: "flex",
                        alignItems: "center",
                        overflow:'auto'
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
                      {/* <div>答案</div> */}
                    </div>
                  </div>

                  <div className="messageTime">
                    {getTimeAMPMFormat(new Date())}
                  </div>
                </div>
              </div>

              <div style={{ position: "sticky", bottom: "0px" }}>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  {messages.length > 0 ? (
                    // chat_gptSend_loading ? (
                    //   <button
                    //     className="clearChat"
                    //     // onClick={() => {
                    //       // setAbort(true);
                    //       // console.log();
                    //     // }}
                    //     disabled={chat_gptSend_loading}

                    //     type="primary"
                    //   >
                    //     Clear Chat
                    //   </button>
                    // ) : (
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
                    // )
                    <></>
                  )}
                </div>
                <Form form={form1}>
                  <Form.Item name={"chatGptInput"}>
                    <Input
                      className="isMobile_chatGptInput"
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
                  className="isMobile_inputButton"
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
        </>
      ) : (
        <Row wrap={false} style={{ height: "100%" }}>
          <Col span={16} style={{ height: "100%" }}>
            {/* <Spin tip="Loading" size="large" spinning={chat_gptSend_loading}> */}
            <div style={{ height: "100%", padding: "5px" }}>
              {/* <Divider /> */}
              <Button
                type="primary"
                // loading={chat_gptSend_loading}
                disabled={chat_gptSend_loading}
                onClick={() => {
                  setInputShow(true);
                }}
                style={{
                  backgroundColor: "#2fb79c",
                  fontWeight: "700",
                  padding: "4px 19px",
                  borderRadius: "15px",
                  marginBottom: "8px",
                }}
              >
                Add System Role
              </Button>
              {inputShow ? (
                <Form form={form} style={{ position: "relative" }}>
                  <Form.Item
                    name={"systermRole"}
                    style={{
                      marginBottom: "8PX",
                      display: show ? "inline-block" : "none",
                      width: "100%",
                    }}
                  >
                    <Input
                      // allowClear
                      showSearch
                      disabled={chat_gptSend_loading}
                      suffix={
                        <DownOutlined
                          style={{ color: "rgba(199, 199, 199)" }}
                          onClick={(e) => {
                            setShow(false);
                            setTimeout(() => {
                              document.getElementById("addRoleSelect").focus();
                            }, 100);
                          }}
                        />
                      }
                      options={options}
                      className="addSystemRole"
                      placeholder="You are a helpful assistant,answer as concisely as possible..."
                    />
                  </Form.Item>
                  <Form.Item
                    name={"systermRole"}
                    style={{
                      marginBottom: "8PX",
                      display: show ? "none" : "inline-block",
                      width: "100%",
                    }}
                  >
                    <Select
                      id="addRoleSelect"
                      disabled={chat_gptSend_loading}
                      // allowClear
                      // showSearch
                      onChange={onRoleChange}
                      onBlur={onRoleBlur}
                      onFocus={onRoleFocus}
                      options={options}
                      // defaultOpen={true}
                      open={optionsShow}
                      className="addSystemRole"
                      placeholder="You are a helpful assistant,answer as concisely as possible..."
                    />
                  </Form.Item>
                </Form>
              ) : (
                <>
                  <br></br>
                  <br></br>
                </>
              )}
              <div className="line"></div>
              <div className="messagesBox">
                {showHistory ? (
                  showmessages.map((item, index) => {
                    // console.log(item);
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
                            {item?.role === "user" ? "Q" : "A"}
                          </div>
                          <div
                            style={{
                              fontSize: item?.role === "user" ? "16px" : "14px",
                              fontWeight: item?.role === "user" ? "700" : "500",
                              width: item?.role === "user" ? "85%" : "100%",
                              whiteSpace: "normal",
                              backgroundColor:
                                item?.role === "user" ? "#ffffff" : "#f0f2f6",
                              padding: item?.role === "user" ? "0" : "20px",
                              borderRadius:
                                item?.role === "user" ? "0" : "20px",
                              // verticalAlign:"center"
                              fontFamily: "Microsoft Yahei",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {item.role === "user" ? (
                              item?.content
                            ) : (
                              <div
                                className="mdStyle"
                                dangerouslySetInnerHTML={{
                                  __html: md.render(item?.content),
                                }}
                              />
                            )}
                          </div>
                          {item?.role === "user" ? (
                            <div className="Rate_box">
                              <Rate
                                className="Favorites"
                                disabled={chat_gptSend_loading}
                                count={1}
                                onChange={favoritesChange(item, index)}
                                value={item.rateValue ? item.rateValue : 0}
                              />
                              {/* }  */}

                              <div
                                style={{ color: "#39a1d9", paddingTop: "6px" }}
                              >
                                Collect
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                        {item?.role === "user" ? (
                          <></>
                        ) : (
                          <div className="messageTime">
                            {getTimeAMPMFormat(new Date())}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <></>
                )}

                <div style={{ display: showNew ? "block" : "none" }}>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: "10px",
                      }}
                    >
                      <div className="photo">{"Q"}</div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          width: "85%",
                          whiteSpace: "normal",
                          backgroundColor: "#ffffff",
                          padding: "0",
                          borderRadius: "0",
                          // verticalAlign:"center"
                          fontFamily: "Microsoft Yahei",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div
                          className="mdStyle"
                          dangerouslySetInnerHTML={{
                            __html: md.render(
                              messages.length > 1
                                ? messages[messages.length - 1].content
                                : ""
                            ),
                          }}
                        />
                        {/* <div>问题</div> */}
                      </div>

                      <div className="Rate_box">
                        <Rate
                          disabled={chat_gptSend_loading}
                          className="Favorites"
                          count={1}
                          value={rateValue}
                          // onChange={favoritesChange()}

                          onChange={newFavoritesChange}
                        />
                        {/* }  */}

                        <div style={{ color: "#39a1d9", paddingTop: "6px" }}>
                          Collect
                        </div>
                      </div>
                    </div>
                    <></>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: "10px",
                      }}
                    >
                      <div className="photo">{"A"}</div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          width: "100%",
                          whiteSpace: "normal",
                          backgroundColor: "#f0f2f6",
                          padding: "20px",
                          borderRadius: "20px",
                          // verticalAlign:"center"
                          fontFamily: "Microsoft Yahei",
                          display: "flex",
                          alignItems: "center",
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
                        {/* <div>答案</div> */}
                      </div>
                    </div>

                    <div className="messageTime">
                      {getTimeAMPMFormat(new Date())}
                    </div>
                  </div>
                </div>

                <div style={{ position: "sticky", bottom: "0px" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {messages.length > 0 ? (
                      // chat_gptSend_loading ? (
                      //   <button
                      //     className="clearChat"
                      //     // onClick={() => {
                      //       // setAbort(true);
                      //       // console.log();
                      //     // }}
                      //     disabled={chat_gptSend_loading}

                      //     type="primary"
                      //   >
                      //     Clear Chat
                      //   </button>
                      // ) : (
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
                      // )
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
              <Tabs
                style={{ height: "100%" }}
                defaultActiveKey="1"
                items={items}
                onChange={onTabsChange}
              />
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};
export default ChatGPT;
