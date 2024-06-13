import React, { useEffect, useState } from "react";
import { Col, Pagination, Row, Collapse, Button, message, Spin } from "antd";
import { getHistoryList } from "../../../services/historyServices";
import dayjs from "dayjs";
import MarkdownRenderer from "../../../utils/MarkdownRenderer";
import { delete_histories } from "../../../services/historyServices";
import { DeleteOutlined } from "@ant-design/icons";
const HistoryQuestions = (props) => {
  const md = MarkdownRenderer();

  const [total, setToal] = useState();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [favoritesQuestions, setFavoritesQuestions] = useState([]);
  const [loadding, setloadding] = useState(false);

  const toObj = (str) => {
    // console.log(JSON.parse(str.replace(/'/g, '"')));
    return JSON.parse(str.replace(/'/g, '"'));
  };
  //   const [arr, setArr] = useState([]);
  useEffect(() => {
    // console.log(("Historical questions新增了"));
    getHistoryList({ type: props.type, page: page, size: pageSize }).then(
      (res) => {
        const historyList = res.data.list;
        if (props.type === 3) {
          historyList.forEach((item) => {
            // console.log(item.answer.replace(/\\n/g, '<br />').replace(/"/g, '&&&'));
            const answer = item.bi_answer;
            item.answer = { type: answer.type, answer: answer };
          });
          // console.log(historyList);
        }
        // console.log(toObj(historyList[0]["answer"].replace(/\\n/g, '<br />'))["answer"]);
        setFavoritesQuestions(historyList);
        setToal(res.data.total);
      }
    );
  }, [props.updateHistory, pageSize, page]);
  // useEffect(()=>{
  //     if(favoritesQuestions.length>0){
  //         favoritesQuestions.forEach((item)=>{
  //             item.answer?.answer?.replace(/\\n/g, '<br />')
  //             // if(item.answer.t)
  //         })
  //     }
  // },[favoritesQuestions])
  const onPageChange = (page, pageSize) => {
    setPageSize(pageSize);
    setPage(page);
  };
  return (
    <div className="favoritesBox">
      <Spin tip="Loading" size="large" spinning={loadding}>
        {favoritesQuestions.map((item, index) => {
          // console.log(item.answer.answer.answer);
          return (
            <Collapse
              accordion
              items={[
                {
                  key: index,
                  label: (
                    <>
                      <Row>
                        <Col className="favoritesQuestion" span={24}>
                          {item.question}
                        </Col>
                      </Row>
                      <Row style={{ zIndex: "9" }}>
                        <Col span={20}>
                          {dayjs(item.create_time).format("YYYY/MM/DD  HH:mm")}
                        </Col>
                        <Col span={4}>
                          <Button
                            style={{
                              border: "none",
                              backgroundColor: "#fafafa",
                            }}
                            onClick={() => {
                              // console.log(item);
                              setloadding(true);
                              delete_histories(item.id).then((res) => {
                                message.success("successfully delete");
                                getHistoryList({
                                  type: props.type,
                                  page: page,
                                  size: pageSize,
                                }).then((res) => {
                                  const historyList = res.data.list;
                                  if (props.type === 3) {
                                    historyList.forEach((item) => {
                                      // console.log(item.answer.replace(/\\n/g, '<br />').replace(/"/g, '&&&'));
                                      const answer = item.bi_answer;
                                      item.answer = {
                                        type: answer.type,
                                        answer: answer,
                                      };
                                    });
                                    // console.log(historyList);
                                  }
                                  // console.log(toObj(historyList[0]["answer"].replace(/\\n/g, '<br />'))["answer"]);
                                  setFavoritesQuestions(historyList);
                                  setToal(res.data.total);
                                  setloadding(false);
                                });
                              });
                            }}
                            icon={<DeleteOutlined />}
                          ></Button>
                        </Col>
                      </Row>
                    </>
                  ),
                  children: (
                    <div className="favoritesAnswer">
                      {props.type === 3 ? (
                        item.answer.type === "text" ? (
                          // <item.answer.answer.answer>{}</item.answer.answer.answer>
                          <div
                            style={{ whiteSpace: "pre-wrap" }}
                            // dangerouslySetInnerHTML={{
                            //   __html: item.answer.answer.answer,
                            // }}
                          >
                            <div
                              className="mdStyle"
                              dangerouslySetInnerHTML={{
                                __html: md.render(item.answer.answer.answer),
                              }}
                            />
                            {/* {item.answer.answer.answer} */}
                          </div>
                        ) : (
                          <img
                            width={"100%"}
                            src={`/${item.answer.answer.answer}`}
                          />
                        )
                      ) : (
                        <div
                          style={{ whiteSpace: "pre-wrap" }}
                          // dangerouslySetInnerHTML={{ __html: item.answer }}
                        >
                          <div
                            className="mdStyle"
                            dangerouslySetInnerHTML={{
                              __html: md.render(item.answer),
                            }}
                          />

                          {/* {item.answer} */}
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          );
        })}
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Pagination
            defaultCurrent={1}
            className="favoritesPage"
            onChange={onPageChange}
            total={total}
          />
        </div>
      </Spin>
    </div>
  );
};
export default HistoryQuestions;
