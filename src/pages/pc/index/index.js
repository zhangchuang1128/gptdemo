import React, { useEffect, useState } from "react";
import {
  RightOutlined,
  LeftOutlined,
  UploadOutlined,
  UserOutlined,
  PicLeftOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Redirect from "../../../utils/Redirect";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import logo2 from "../../../images/logo2.png";
import user from "../../../images/user.png";
import { Layout, Menu, Button, theme } from "antd";
import ChatGPT from "../detail/ChatGPT";
import EmbeddingChat from "../detail/EmbeddingChat";
import EmbeddingQueries from "../detail/EmbeddingQueries";
import BIGPTQueries from "../detail/BI-GPTQueries";
import AddDocument from "../detail/AddDocument";
import DocumentManagement from "../detail/DocumentManagement";
import DocumentLibrary from "../detail/DocumentLibrary";
import IndexManagement from "../detail/IndexManagement";
import Sandbox from "../detail/Sandbox";
import UtilsDocumentSummary from "../detail/Utils-DocumentSummary";
import UtilsConversationDataExtraction from "../detail/Utils-ConversationDataExtraction";
import UtilsPromptExtraction from "../detail/Utils-PromptExtraction";
import BiDocumentManagement from "../detail/BiDocumentManagement";
import BiDocumentLibrary from "../detail/BiDocumentLibrary";
import { getUser, userLogout } from "../../../services/loginServices";
const { Header, Sider, Content } = Layout;
const WrappedIndexContainers = () => {
  // 标题切换

  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState();
  const labelStyle = { fontSize: "15px", fontWeight: 400 };
  const imgStyle = {
    width: "80px",
    height: "70px",
    marginTop: "28px",
    display: collapsed ? "none" : "inline-block",
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  useEffect(() => {
    getUser().then((res) => {
      // console.log(res.data.username);
      setUsername(res.data.username);
    });
  }, []);
  const isMobile = () => {
    return !!navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
  };
  return (
    <>
      {isMobile()? (
        <Routes>
        <Route exact path="/Chat-GPT" element={<ChatGPT />} />
      </Routes>
      ) : (
        <Layout style={{ height: "100%" }}>
          <Sider
            trigger={null}
            width={300}
            collapsible
            collapsed={collapsed}
            style={{ backgroundColor: "#289fdb", position: "relative" }}
          >
            <div className="demo-logo-vertical">
              <img style={imgStyle} src={logo2}></img>
            </div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["1"]}
              style={{
                backgroundColor: "#289fdb",
                fontFamily: "Microsoft YaHei",
              }}
              items={[
                {
                  key: "/AI/Chat-GPT",
                  icon: <PicLeftOutlined />,
                  label: "Chat-GPT",
                  onClick: (e) => {
                    navigate(e.key, { replace: true });
                  },
                },
                {
                  key: "EmbeddingChat",
                  icon: <PicLeftOutlined />,
                  label: "Embedding-GPT",
                  children: [
                    {
                      key: "/AI/EmbeddingChat",
                      icon: <PicLeftOutlined />,
                      label: <span style={labelStyle}>Embedding Chat</span>,
                      onClick: (e) => {
                        navigate(e.key, { replace: true });
                      },
                    },
                    {
                      key: "/AI/EmbeddingQueries",
                      icon: <PicLeftOutlined />,
                      label: <span style={labelStyle}>Embedding Queries</span>,
                      onClick: (e) => {
                        navigate(e.key, { replace: true });
                      },
                    },
                    {
                      key: "/AI/DocumentManagement",
                      icon: <PicLeftOutlined />,
                      label: (
                        <span style={labelStyle}>Document Management</span>
                      ),
                      onClick: (e) => {
                        navigate(e.key, { replace: true });
                      },
                    },
                    // {
                    //   key: "/AI/IndexManagement",
                    //   icon: <PicLeftOutlined />,
                    //   label:<span style={labelStyle}>Index Management</span>,
                    //   onClick: (e) => {
                    //     navigate(e.key, { replace: true });
                    //   },
                    // },
                  ],
                },

                {
                  key: "/BI-GPTQueries",
                  icon: <PicLeftOutlined />,
                  label: "BI-GPT",
                  children: [
                    {
                      key: "/AI/BI-GPTQueries",
                      icon: <PicLeftOutlined />,
                      label: <span style={labelStyle}>BI-GPT Queries</span>,
                      onClick: (e) => {
                        navigate(e.key, { replace: true });
                      },
                    },
                    {
                      key: "/AI/BiDocumentManagement",
                      icon: <PicLeftOutlined />,
                      label: (
                        <span style={labelStyle}>Document Management</span>
                      ),
                      onClick: (e) => {
                        navigate(e.key, { replace: true });
                      },
                    },
                  ],
                },
                // {
                //   key: "/AI/Sandbox",
                //   icon: <PicLeftOutlined />,
                //   label: "Sandbox",
                //   onClick: (e) => {
                //     navigate(e.key, { replace: true });
                //   },
                // },
                {
                  key: "/AI/Utils-DocumentSummary",
                  icon: <PicLeftOutlined />,
                  label: "Document Summary",
                  style: { whiteSpace: "normal", height: "auto" },
                  onClick: (e) => {
                    navigate(e.key, { replace: true });
                  },
                },
                // {
                //   key: "/AI/Utils-ConversationDataExtraction",
                //   icon: <PicLeftOutlined />,
                //   label: "Conversation Data Extraction",
                //   style: { whiteSpace: "normal", height: "auto" },
                //   onClick: (e) => {
                //     navigate(e.key, { replace: true });
                //   },
                // },
              ]}
            />
            <div className="user">
              <img
                style={{
                  width: "80px",
                  height: "70px",
                  marginTop: "20px",
                  marginBottom: "10px",
                  display: collapsed ? "none" : "inline-block",
                }}
                src={user}
              ></img>
              <div
                style={{
                  color: "#fff",
                  fontSize: "18px",
                  marginBottom: "10PX",
                  display: collapsed ? "none" : "inline-block",
                }}
              >
                {username}
              </div>
              <div>
                <Button
                  type="primary"
                  style={{
                    border: "2px solid #fff",
                    display: collapsed ? "none" : "inline-block",
                  }}
                  onClick={() => {
                    userLogout();
                    window.location.href = "/login";
                  }}
                >
                  LOGOUT
                </Button>
              </div>
            </div>
            <div className="radius_top">
              <div className="circle"></div>
              <div className="bottom"></div>
              <div className="right"></div>
            </div>
            <div className="radius_bottom">
              <div className="circle"></div>
              <div className="bottom"></div>
              <div className="right"></div>
            </div>
          </Sider>
          <Layout style={{ fontFamily: "Microsoft YaHei" }}>
            <Content
              style={{
                margin: "18px",
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                position: "relative",
                borderRadius: "36px",
                fontFamily: "Microsoft YaHei",
                overflowY: "scroll",
              }}
            >
              <Button
                type="text"
                className="collapsed"
                style={{ top: "50%", width: 15 }}
                icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
              <Routes>
                <Route exact path="/Chat-GPT" element={<ChatGPT />} />
                <Route
                  exact
                  path="/EmbeddingChat"
                  element={<EmbeddingChat />}
                />
                <Route
                  exact
                  path="/EmbeddingQueries"
                  element={<EmbeddingQueries />}
                />
                <Route exact path="/BI-GPTQueries" element={<BIGPTQueries />} />
                <Route exact path="/AddDocument" element={<AddDocument />} />
                <Route
                  exact
                  path="/DocumentManagement"
                  element={<DocumentLibrary />}
                />
                <Route
                  exact
                  path="/DocumentManagement/Files"
                  element={<DocumentManagement />}
                />
                <Route
                  exact
                  path="/IndexManagement"
                  element={<IndexManagement />}
                />
                <Route exact path="/Sandbox" element={<Sandbox />} />
                <Route
                  exact
                  path="/Utils-DocumentSummary"
                  element={<UtilsDocumentSummary />}
                />
                <Route
                  exact
                  path="/Utils-ConversationDataExtraction"
                  element={<UtilsConversationDataExtraction />}
                />
                <Route
                  exact
                  path="/Utils-PromptExtraction"
                  element={<UtilsPromptExtraction />}
                />
                <Route
                  exact
                  path="/BiDocumentManagement"
                  element={<BiDocumentLibrary />}
                />
                <Route
                  exact
                  path="/BiDocumentManagement/Files"
                  element={<BiDocumentManagement />}
                />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  );
};
export default WrappedIndexContainers;
