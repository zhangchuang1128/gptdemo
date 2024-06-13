import React, { useEffect, useState } from "react";
import { Col, Pagination, Row, Collapse, Rate, Button, Spin } from "antd";
import {
  favoritesList,
  deleteFavoritesById,
} from "../../../services/favoritesServices";
import dayjs from "dayjs";
import { DeleteOutlined } from "@ant-design/icons";
import MarkdownRenderer from "../../../utils/MarkdownRenderer";

const FavoritesQuestion = (props) => {
  const md = MarkdownRenderer();

  const [total, setToal] = useState();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [favoritesQuestions, setFavoritesQuestions] = useState([]);
  useEffect(() => {
    // console.log(("收藏新增了"));
    favoritesList({ type: props.type, page: page, size: pageSize }).then(
      (res) => {
        // console.log(res.data);
        const favorites_list = res.data.list;
        if (props.type === 3) {
          favorites_list.forEach((item) => {
            // console.log(item);
            item.answer.replace(/\\n/g, "<br />");
          });
        }
        setFavoritesQuestions(favorites_list);
        setToal(res.data.total);
      }
    );
  }, [props.updateFavorites, pageSize, page]);
  const onPageChange = (page, pageSize) => {
    setPageSize(pageSize);
    setPage(page);
  };
  //   const [items,setitems]=useState([])
  const [loadding, setloadding] = useState(false);
  return (
    <div className="favoritesBox">
      <Spin tip="Loading" size="large" spinning={loadding}>
        {favoritesQuestions.map((item, index) => {
          return (
            <Collapse
              key={index}
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
                      <Row>
                        <Col span={20}>
                          {dayjs(item.create_time).format("YYYY/MM/DD  HH:mm")}
                        </Col>
                        <Col span={4}>
                          <Button
                            icon={<DeleteOutlined />}
                            style={{
                              border: "none",
                              backgroundColor: "#fafafa",
                            }}
                            onClick={() => {
                              // console.log(item);
                              setloadding(true);
                              // props.deleteFavoriteFun(item)
                              deleteFavoritesById(item.id).then((res) => {
                                favoritesList({
                                  type: props.type,
                                  page: page,
                                  size: pageSize,
                                }).then((res) => {
                                  // console.log(res.data);
                                  const favorites_list = res.data.list;
                                  if (props.type === 3) {
                                    favorites_list.forEach((item) => {
                                      // console.log(item);
                                      item.answer.replace(/\\n/g, "<br />");
                                    });
                                  }
                                  setFavoritesQuestions(favorites_list);
                                  setToal(res.data.total);
                                  setloadding(false);
                                });
                              });
                            }}
                          />
                        </Col>
                      </Row>
                    </>
                  ),
                  children: (
                    <div className="favoritesAnswer">
                      {item.answer?.substring(0, 6) === "media/" ? (
                        <img width={"100%"} src={`/${item.answer}`} />
                      ) : (
                        <div
                          style={{ whiteSpace: "pre-wrap" }}
                          // dangerouslySetInnerHTML={{ __html: item.answer }}
                        >
                          {/* {item.answer} */}
                          <div
                            className="mdStyle"
                            dangerouslySetInnerHTML={{
                              __html: md.render(item.answer),
                            }}
                          />
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
export default FavoritesQuestion;
