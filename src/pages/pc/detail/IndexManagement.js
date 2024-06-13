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
  Table,
  Pagination,
  Popconfirm,
  Select,
  Modal,
  Spin,
} from "antd";
import {
  //   getfileList,
  delete_file,
  getIndexList,
  delete_by_key,
  delete_by_filename,
} from "../../../services/fileServices";
const IndexManagement = () => {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [content, setContent] = useState();
  const handleCancel = () => {
    setModalOpen(false);
  };
  const columns = [
    { title: "Key", dataIndex: "key" },
    {
      title: "File name",
      dataIndex: "filename",
      render: (text) => {
        return decodeURIComponent(text.substring(text.lastIndexOf("/") + 1));
      },
    },
    {
      title: "Source",
      dataIndex: "source",
      render: (text) => {
        let result = text.match(/\(([^)]*)\)/);
        return (
          <a href={result[1]} target="_blank">
            View file
          </a>
        );
      },
    },
    {
      title: "Content",
      dataIndex: "content",
      render: (text, row) => {
        return (
          <a
            onClick={() => {
              // console.log(text);
              setModalOpen(true);
              setContent(text);
            }}
          >
            View content
          </a>
        );
      },
    },
  ];
  const [dataSource, setdataSource] = useState([]);
  // 表格参数
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    // console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // 第一个删除判断
  const [del_disabled, setdel_disabled] = useState(true);
  useEffect(() => {
    console.log(selectedRowKeys);
    if (selectedRowKeys.length > 0) {
      setdel_disabled(false);
    } else {
      setdel_disabled(true);
    }
  }, [selectedRowKeys]);

  //   下拉框筛选
  const [filterFileName, setFilterFileName] = useState();
  // 下拉框options
  const [options, setOptions] = useState([]);
  //   分页
  const [total, setToal] = useState();
  // 加载页面发送请求获取列表
  const [tableloading, settableloading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onPageChange = (page, pageSize) => {
    setPageSize(pageSize);
    setPage(page);
  };
  useEffect(() => {
    settableloading(true);
    form.setFieldValue("filter_filename", "");
    getIndexList({ page: page, size: pageSize }).then((res) => {
      //   console.log(res.data);
      setdataSource(res.data.list);
      settableloading(false);
      setToal(res.data.total);
      const arr = res.data.list.map((item) => {
        return {
          value: decodeURIComponent(item.filename),
          label: decodeURIComponent(
            item.filename.substring(item.filename.lastIndexOf("/") + 1)
          ),
        };
      });
      arr.push({value:"",label:"All"})

      //   去重
      setOptions(
        arr.filter(
          (item, index) =>
            arr.findIndex((i) => i.value === item.value) === index
        )
      );
    });
  }, [page, pageSize]);
  //   删除确认
  const [del_loading, setdel_loading] = useState(false);
  const text = "Are you sure you want to delete the filtered file index？";
  const text1 = "Are you sure you want to delete the selected index？";
  // const description = '删除选中的文件';
  const confirm = () => {
    //   message.info('Clicked on Yes.');
    if (filterFileName) {
      //   setdel_loading(true);
      settableloading(true);
      delete_by_filename({ filename: filterFileName }).then(() => {
        form.setFieldValue("filter_filename", "");
        getIndexList({ page: page, size: pageSize }).then((res) => {
          setdataSource(res.data.list);
          setToal(res.data.total);
          const arr = res.data.list.map((item) => {
            return {
              value: decodeURIComponent(item.filename),
              label: decodeURIComponent(
                item.filename.substring(item.filename.lastIndexOf("/") + 1)
              ),
            };
          });
          //   去重
          setOptions(
            arr.filter(
              (item, index) =>
                arr.findIndex((i) => i.value === item.value) === index
            )
          );
          settableloading(false);
        });
        message.success("ok");
      });
    } else {
      message.warning("You have not filtered yet");
    }
  };

  const filterChange = (val) => {
    setFilterFileName(val);
    settableloading(true);
    setSelectedRowKeys([]);

    getIndexList({ page: val ? 1 : page, size: pageSize, filename: val }).then(
      (res) => {
        // console.log(res.data);
        setdataSource(res.data.list);
        setToal(res.data.total);
        const arr = res.data.list.map((item) => {
          return {
            value: decodeURIComponent(item.filename),
            label: decodeURIComponent(
              item.filename.substring(item.filename.lastIndexOf("/") + 1)
            ),
          };
        });
        //   去重
        // setOptions(
        //   arr.filter(
        //     (item, index) =>
        //       arr.findIndex((i) => i.value === item.value) === index
        //   )
        // );
        settableloading(false);
      }
    );
  };
  //   索引删除
  const confirm1 = () => {
    if (selectedRowKeys.length > 0) {
      settableloading(true);
      // console.log(selectedRowKeys);
      delete_by_key({ key: selectedRowKeys }).then(() => {
        getIndexList({ page: page, size: pageSize }).then((res) => {
          //   console.log(res.data);
          setdataSource(res.data.list);
          setToal(res.data.total);
          const arr = res.data.list.map((item) => {
            return {
              value: decodeURIComponent(item.filename),
              label: decodeURIComponent(
                item.filename.substring(item.filename.lastIndexOf("/") + 1)
              ),
            };
          });
          //   去重
          setOptions(
            arr.filter(
              (item, index) =>
                arr.findIndex((i) => i.value === item.value) === index
            )
          );
          settableloading(false);
        });
      });
    } else {
      message.warning("You have not selected an index");
    }
  };

  // 第二个删除判断
  const [delFile_disabled, setdelFile_disabled] = useState(true);
  useEffect(() => {
    if (filterFileName) {
      // console.log(filterFileName);
      setdelFile_disabled(false);
    } else {
      setdelFile_disabled(true);
    }
  }, [filterFileName]);
  return (
    <Spin tip="Loading" size="large" spinning={tableloading}>
      <Modal open={modalOpen} footer={null} onCancel={handleCancel}>
        {content}
      </Modal>
      {/* <Button type="primary" className="file_BUTTON" style={{backgroundColor:"#2fb79c",marginRight:"80px"}}>Upload</Button> */}
      <Row>
        <Col span={16}>
          {/* {del_disabled ? (
            <Button
              type="primary"
              className="file_BUTTON"
              style={{ backgroundColor: "#f95157", marginRight: "40px" }}
              onClick={() => {
                message.warning("You have not selected an index");
              }}
            >
              Delete
            </Button>
          ) : (
            <Popconfirm
              placement="topLeft"
              title={text1}
              onConfirm={confirm1}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                className="file_BUTTON"
                style={{ backgroundColor: "#f95157", marginRight: "40px" }}
              >
                Delete
              </Button>
            </Popconfirm>
          )}
          {delFile_disabled ? (
            <Button
              type="primary"
              loading={del_loading}
              className="file_BUTTON"
              style={{ backgroundColor: "#faab25" }}
              onClick={() => {
                message.warning("You have not filtered yet");
              }}
            >
              Delete file index
            </Button>
          ) : (
            <Popconfirm
              placement="topLeft"
              title={text}
              onConfirm={confirm}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                loading={del_loading}
                className="file_BUTTON"
                style={{ backgroundColor: "#faab25" }}
                // onClick={delete_File}
              >
                Delete file index
              </Button>
            </Popconfirm>
          )} */}
        </Col>
        <Col span={8}>
          <Row>
            <Col
              span={10}
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#666666",
                lineHeight: "32px",
                textAlign: "right",
                paddingRight: "10px",
              }}
            >
              Filter by file
            </Col>
            <Col span={14}>
              <Form form={form} className="filter_form">
                <Form.Item name={"filter_filename"}>
                  <Select
                    onChange={filterChange}
                    loading={tableloading}
                    options={options}
                    style={{ width: "100%" }}
                    allowClear
                  ></Select>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
      <Table
        className="documentTable"
        style={{ marginTop: "20px" }}
        // rowSelection={rowSelection}
        scroll={{
          y: 640,
        }}
        pagination={{
          position: ["bottomRight"],
          defaultCurrent: 1,
          total: total,
          onChange: onPageChange,
        }}
        columns={columns}
        dataSource={dataSource}
        // loading={tableloading}
        rowKey={(record) => record.key}
      ></Table>
    </Spin>
  );
};
export default IndexManagement;
