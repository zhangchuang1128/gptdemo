import React, { useEffect, useState,useRef } from "react";
import {
  Slider,
  Form,
  Input,
  Divider,
  Button,
  Row,
  Col,
  message,
  Rate,
  Tabs,
  Select,
  Modal,
  Spin,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import FavoritesQuestion from "./FavoritesQuestion";
import HistoryQuestions from "./HistoryQuestions";
import { SendOutlined } from "@ant-design/icons";
import {
  emqueries,
  getLanguage,
  em_check,
} from "../../../services/chatGPTServices";
import { getDocumentLibraryList } from "../../../services/fileServices";
import {
  addFavorites,
  deleteFavoritesByQuestion,
} from "../../../services/favoritesServices";
import TextArea from "antd/es/input/TextArea";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import MarkdownRenderer from "../../../utils/MarkdownRenderer";
import Clipboard from "clipboard";

const EmbeddingQueries = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm(); //文档库form
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

  const [marks, _] = useState({ 0: <strong>0</strong>, 1: <strong>1</strong> });
  //   提示的显示隐藏
  const [showHint, setShowHint] = useState(false);
  //   setting下拉框内容
  const [options, setOptions] = useState([]);
  // setting按钮点击
  // setting的显示和隐藏
  const [showSetting, setShowSetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState("Settings");
  const settingClick = () => {
    setLoading(true);
    if (!options.length > 0) {
      getLanguage().then((res) => {
        // console.log([res.data]);
        const obj = res.data;
        const list = [];
        for (let key in obj) {
          let temp = {};
          temp.label = key;
          temp.value = obj[key];
          list.push(temp);
        }
        // console.log(list);
        setOptions(list);
        setLoading(false);
        if (showSetting) {
          setShowSetting(false);
          setSetting("Settings");
        } else {
          setShowSetting(true);
          setSetting("Settings complete");
        }
      });
    } else {
      setLoading(false);
      if (showSetting) {
        setShowSetting(false);
        setSetting("Settings");
      } else {
        setShowSetting(true);
        setSetting("Settings complete");
      }
    }
  };
  // 滑动条changge
  const [SliderValue, setSliderValue] = useState(0.7);
  const onSliderChange = (res) => {
    // console.log(res);
    setSliderValue(res);
  };
  //   语言选择下拉框选定内容
  const [language, setLanguage] = useState();
  const onSelectChange = (res) => {
    // console.log(res);
    setLanguage(res);
  };

  const [text, setText] = useState(""); // 字段
  const [context, setContext] = useState(""); // context
  const [sources, setSources] = useState(""); // sources
  const [translation_content, setTranslation_content] = useState(""); // translation_content
  // 收藏按钮显示
  const [rateValue, setRateValue] = useState(0);
  // 历史提问更新
  const [updateHistory, setUpdateHistory] = useState({});

  const [showNew, setShowNew] = useState(false);

  const [newQuestion, setNewQuestion] = useState("");

  const chat_gptSend = () => {
    if (form1.getFieldValue("chatGptInput").trim()) {
      setNewQuestion(form1.getFieldValue("chatGptInput").trim());
      setShowNew(true);

      if (messages) {
        setShowMessages([
          ...showmessages,
          { question: messages.question, rateValue: rateValue },
          {
            answer: {
              text: text,
              context: context,
              sources: sources,
              translation_content: translation_content,
            },
            rateValue: rateValue
          },
        ]);
        setMessages({
          question: form1.getFieldValue("chatGptInput").trim(),
          custom_prompt: form.getFieldValue("textArea"),
          custom_temperature: SliderValue,
          translation_language: language,
          folder_path: form2.getFieldValue("DocumentLibrarySelect"),
        });
      } else {
        setMessages({
          question: form1.getFieldValue("chatGptInput").trim(),
          custom_prompt: form.getFieldValue("textArea"),
          custom_temperature: SliderValue,
          translation_language: language,
          folder_path: form2.getFieldValue("DocumentLibrarySelect"),
        });
      }
      setRateValue(0);
      setText("");
      setContext("");
      setSources("");
      setTranslation_content("");
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
    // if (messages) {
    //   setChat_gptSend_loading(true);
    //   setChatGptInputDisabled(true);
    //   emqueries(messages).then((res) => {
    //     // console.log(res);
    //     setShowMessages([
    //       ...showmessages,
    //       { question: form1.getFieldValue("chatGptInput").trim() },
    //       { answer: res.data },
    //     ]);
    //     setChat_gptSend_loading(false);
    //     setChatGptInputDisabled(false);
    //     form1.setFieldValue("chatGptInput", "");
    //     // 发送新消息后更新历史记录
    //     setUpdateHistory({});
    //   });
    // }
    if (messages) {
      console.log(messages);
      setChat_gptSend_loading(true);
      setChatGptInputDisabled(true);
      const fetchUrl =
        process.env.NODE_ENV === "production"
          ? `http://${window.location.host}/events/em_gpt/stream_queries/`
          : "http://192.168.3.27:8004/events/em_gpt/stream_queries/";
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
          console.log(JSON.parse(event.data));
          // setField((field) => {
          //   console.log("message里的field", field);
          //   field.push(data);
          //   return field;
          // });
          // console.log(data);
          if (data) {
            setText((text) => text.concat(data));
          }
          if (JSON.parse(event.data).context) {
            setContext(JSON.parse(event.data).context);
          }
          if (JSON.parse(event.data).sources) {
            setSources(JSON.parse(event.data).sources);
          }
          if (JSON.parse(event.data).translation_content) {
            setTranslation_content(JSON.parse(event.data).translation_content);
          }
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
    setShowNew(true);
  };
  // 收藏按钮
  // const [favorites,setFavorites]=useState()
  const [updateFavorites, setUpdateFavorites] = useState({});
  const favoritesChange = (item, index) => {
    // console.log(showmessages[index + 1]);
    return (e) => {
      setShowMessages((showmessages) => {
        showmessages[index].rateValue
          ? (showmessages[index].rateValue = 0)
          : (showmessages[index].rateValue = 1);
        return showmessages;
      });
      console.log("showmessages",showmessages,"index",index);
      if (e === 1) {
        addFavorites({
          question: showmessages[index].question,
          answer: showmessages[index + 1].answer.translation_content
            ? showmessages[index + 1].answer.translation_content
            : showmessages[index + 1].answer.text,
          type: 2,
        }).then((res) => {
          // console.log(res);
          message.success("Successful collection");
          setUpdateFavorites({});
        });
      } else if (e === 0) {
        deleteFavoritesByQuestion({ question: showmessages[index].question}).then(
          () => {
            message.success("Cancel collection");
            setUpdateFavorites({});
          }
        );
      }
    };
  };
  // 最新的收藏
  const newFavoritesChange = (e) => {
    
    setRateValue(rateValue === 1 ? 0 : 1);
     if (e === 1) {
        addFavorites({
          question: newQuestion,
          answer: translation_content
            ? translation_content
            : text,
          type: 2,
        }).then((res) => {
          // console.log(res);
          message.success("Successful collection");
          setUpdateFavorites({});
        });
      } else if (e === 0) {
        deleteFavoritesByQuestion({ question: newQuestion}).then(
          () => {
            message.success("Cancel collection");
            setUpdateFavorites({});
          }
        );
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
  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newModalOpen, setNewModalOpen] = useState(false);

  const [modalIndex,setModalIndex]=useState("")
  const modalClick = (index) => {
    // setModalOpen(true);
return ()=>{
    setModalOpen(true);
    setModalIndex(index)
  // document.querySelector(`.modal${index}`).display="block"
  // console.log(document.querySelector(`.modal${index}`));
}  };
  const handleCancel = () => {
    setModalOpen(false);
    setModalIndex(-1)
  };
  const newModalClick = () => {
    console.log(document.querySelector(".modal"));
    setNewModalOpen(true);
  };
  const newHandleCancel = () => {
    setNewModalOpen(false);
  };
  // 检测运行状态
  // const [em_checkloading, setem_checkloading] = useState(false);
  // const emCheck = () => {
  //   setem_checkloading(true);
  //   em_check().then((res) => {
  //     setem_checkloading(false);
  //     res.data.forEach((item) => {
  //       if (item.status === 1) {
  //         message.success(item.message);
  //       } else {
  //         message.warning(item.message);
  //       }
  //     });
  //   });
  // };
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
    form2.setFieldValue(
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
            {/* <Divider /> */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {/* <Button
                type="primary"
                onClick={emCheck}
                style={{
                  backgroundColor: "#2fb79c",
                  fontWeight: "700",
                  padding: "4px 19px",
                  borderRadius: "15px",
                  marginBottom: "8px",
                }}
                loading={em_checkloading}
              >
                Check deployment
              </Button> */}
              <Form form={form2}>
                <Form.Item label="文档库" name={"DocumentLibrarySelect"}>
                  <Select
                  disabled={chat_gptSend_loading}
                    style={{ width: "200px" }}
                    options={documentLibraryOptions}
                  />
                </Form.Item>
              </Form>
              <Button
                type="primary"
                onClick={settingClick}
                // loading={chat_gptSend_loading}
                disabled={chat_gptSend_loading}

                style={{
                  backgroundColor: "#2fb79c",
                  fontWeight: "700",
                  padding: "4px 19px",
                  borderRadius: "15px",
                  marginBottom: "8px",
                  width: "15%",
                  
                  // display: !showSetting ? "block" : "none",
                }}
              >
                {setting}
              </Button>
            </div>
            <div
              className="emchat_settings"
              style={{ display: showSetting ? "block" : "none" }}
            >
              <div className="emchat_settings_title">Temperature</div>
              <Slider
                marks={marks}
                step={0.1}
                max={1}
                defaultValue={0.7}
                // tooltip={{
                //   open: SliderValue === 0 || SliderValue === 1 ? false : true,
                //   placement: "bottom",
                // }}
                style={{ marginBottom: "50px" }}
                onChange={onSliderChange}
              />
              <div
                className="emchat_settings_title"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                <div>Costom Prompt</div>
                <QuestionCircleOutlined
                  onMouseMove={() => {
                    setShowHint(true);
                  }}
                  onMouseLeave={() => {
                    setShowHint(false);
                  }}
                />
                <div
                  className="hint"
                  style={{ display: showHint ? "block" : "none" }}
                >
                  {`You can configure a custom prompt by adding the variables {summaries} and {question} to the prompt.
{summaries} will be replaced with the content of the documents retrieved from the VectorStore.
{question} will be replaced with the user's question.`}
                </div>
              </div>
              <Form form={form}>
                <Form.Item name={"textArea"}>
                  <TextArea
                    placeholder="{summaries}  
                Please reply to the question using only the text above.  
                Question: {question}  
                Answer:"
                    autoSize={{ minRows: 2, maxRows: 5 }}
                    style={{ marginBottom: "20px" }}
                  />
                </Form.Item>
              </Form>

              <div className="emchat_settings_title">Language</div>
              <Select
                //   onDropdownVisibleChange={onDropdownVisibleChange}
                style={{
                  width: "100%",
                }}
                options={options}
                onChange={onSelectChange}
              />
            </div>
            <br style={{ clear: "both" }}></br>
            <div className="line"></div>
            <div
              className="messagesBox"
              style={{ height: showSetting ? "50%" : "90%" }}
            >
              {showmessages.map((item, index) => {
                // console.log(item?.answer?.sources?.split("]").join("(").split("(").join(")").split(")").join("[").split("[").filter((s)=>s&&s.trim()))
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
                              ? "20px"
                              : "16px",
                          fontWeight:
                            item.question || item.question === 0
                              ? "700"
                              : "500",
                          width:
                            item.question || item.question === 0
                              ? "85%"
                              : "100%",
                          fontFamily: "Microsoft Yahei",
                          // display:"flex",
                          // alignItems:"center"
                          marginTop:
                            item.question || item.question === 0 ? "10px" : "0",
                        }}
                      >
                        {item.answer || item.answer === 0 ? (
                          <div
                            style={{
                              whiteSpace: "pre-wrap",
                              backgroundColor: "#f0f2f6",
                              borderRadius: "20px",
                              padding: "20px",
                            }}
                          >
                            <div style={{ fontSize: "14px" }}>
                              {item.answer.text}
                            </div>
                            {item.answer.sources
                              .split("]")
                              .join("(")
                              .split("(")
                              .join(")")
                              .split(")")
                              .join("[")
                              .split("[")
                              .filter((s) => s && s.trim())
                              .map((res, index) => {
                                return index % 2 === 0 ? (
                                  <div style={{ fontSize: "10px" }}>
                                    {index === 0 ? (
                                      <span
                                        style={{
                                          display: "inline-block",
                                          width: "50px",
                                        }}
                                      >
                                        Sources：
                                      </span>
                                    ) : (
                                      <span
                                        style={{
                                          display: "inline-block",
                                          width: "50px",
                                        }}
                                      ></span>
                                    )}
                                    <a
                                      href={
                                        item.answer.sources
                                          .split("]")
                                          .join("(")
                                          .split("(")
                                          .join(")")
                                          .split(")")
                                          .join("[")
                                          .split("[")
                                          .filter((s) => s && s.trim())[
                                          index + 1
                                        ]
                                      }
                                      target="_blank"
                                    >
                                      {decodeURIComponent(res)}
                                    </a>
                                  </div>
                                ) : (
                                  <></>
                                );
                              })}
                            <Button
                              type="primary"
                              className="Em_Question_button"
                              onClick={modalClick(index)}
                              // loading={chat_gptSend_loading}
                            >
                              Question and Answer Context
                            </Button>
                            <Modal 
                            key={Math.random()}
                            // className={`modal${index}`}
                              open={modalOpen&&index===modalIndex}
                              footer={null}
                              onCancel={handleCancel}
                            >
                              <div>
                                {item.answer.context.replace(/\\n/g, "<br />")}
                              </div>
                            </Modal>

                            <div
                              style={{ marginBottom: "5px", fontSize: "14px" }}
                            >
                              Translation to other languages,翻译成其他语言
                            </div>
                            <div style={{ fontSize: "14px" }}>
                              {item.answer.translation_content}
                            </div>
                          </div>
                        ) : (
                          item.question
                        )}
                      </div>
                      {item.question || item.question === 0 ? (
                        <div className="Rate_box">
                          <Rate
                            className="Favorites"
                            count={1}
                            value={
                              item.rateValue
                            }
                            disabled={chat_gptSend_loading}
                            onChange={favoritesChange(item, index)}
                          />
                          <div style={{ color: "#39a1d9", paddingTop: "6px" }}>
                            Collect
                          </div>
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
              {showNew ? (
                <>
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
                          fontSize: "20px",
                          fontWeight: "700",
                          width: "85%",
                          fontFamily: "Microsoft Yahei",
                          // display:"flex",
                          // alignItems:"center"
                          marginTop: "10px",
                        }}
                      >
                        {messages.question}
                      </div>

                      <div className="Rate_box">
                        <Rate
                        disabled={chat_gptSend_loading}
                          className="Favorites"
                          count={1}
                          onChange={newFavoritesChange}
                          value={rateValue}
                        />
                        <div style={{ color: "#39a1d9", paddingTop: "6px" }}>
                          Collect
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 答案 */}
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
                          fontSize: "16px",
                          fontWeight: "500",
                          width: "100%",
                          fontFamily: "Microsoft Yahei",
                          // display:"flex",
                          // alignItems:"center"
                          marginTop: "0",
                        }}
                      >
                        <div
                          style={{
                            whiteSpace: "pre-wrap",
                            backgroundColor: "#f0f2f6",
                            borderRadius: "20px",
                            padding: "20px",
                          }}
                        >
                          {text?<div style={{ fontSize: "14px" }}>{text}</div>:<><Spin></Spin><br></br></>}
                          {sources
                            .split("]")
                            .join("(")
                            .split("(")
                            .join(")")
                            .split(")")
                            .join("[")
                            .split("[")
                            .filter((s) => s && s.trim())
                            .map((res, index) => {
                              return index % 2 === 0 ? (
                                <div style={{ fontSize: "10px" }}>
                                  {index === 0 ? (
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: "50px",
                                      }}
                                    >
                                      Sources：
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: "50px",
                                      }}
                                    ></span>
                                  )}
                                  <a
                                    href={
                                      sources
                                        .split("]")
                                        .join("(")
                                        .split("(")
                                        .join(")")
                                        .split(")")
                                        .join("[")
                                        .split("[")
                                        .filter((s) => s && s.trim())[index + 1]
                                    }
                                    target="_blank"
                                  >
                                    {decodeURIComponent(res)}
                                  </a>
                                </div>
                              ) : (
                                <></>
                              );
                            })}
                          <Button
                            type="primary"
                            className="Em_Question_button"
                            onClick={newModalClick}
                            // loading={chat_gptSend_loading}
                            disabled={chat_gptSend_loading}
                          >
                            Question and Answer Context
                          </Button>
                          <Modal
                          className="modal"
                          key={Math.random()}
                            open={newModalOpen}
                            footer={null}
                            onCancel={newHandleCancel}
                          >
                            <div>{context.replace(/\\n/g, "<br />")}</div>
                          </Modal>

                          <div
                            style={{ marginBottom: "5px", fontSize: "14px" }}
                          >
                            Translation to other languages,翻译成其他语言
                          </div>
                          <div style={{ fontSize: "14px" }}>
                            {translation_content}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="messageTime">
                      {getTimeAMPMFormat(new Date())}
                    </div>
                  </div>
                </>
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
                  {messages? (
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
export default EmbeddingQueries;
