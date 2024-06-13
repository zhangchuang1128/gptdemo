import React, { useEffect, useState } from "react";
import {
  Flex,
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
  Upload,
  Spin,
  Modal,
} from "antd";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import {
  getDocumentLibraryList,
  delete_file,
  uploadFile,
  delete_by_filename,
  deleteDocumentLibrary,
  addDocumentLibraryRequest,
} from "../../../services/fileServices";
const DocumentLibrary = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const columns = [
    {
      title: "文档库名称",
      dataIndex: "document_name",
      render: (text) => {
        return text.substring(text.lastIndexOf("/") + 1);
      },
    },
    {
      title: "所有人",
      dataIndex: "user",
      render: (text) => {
        return <span>{text.username}</span>;
      },
    },
    {
      title: "操作",
      dataIndex: "folder_path",
      render: (text) => {
     return   <a onClick={()=>{
        navigate(`/AI/DocumentManagement/Files?path=${text}`, { replace: true });
     }}>查看文件</a>;
      },
    },
  ];
  const [dataSource, setdataSource] = useState([]);
  // 表格参数
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    type:"radio",
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const [del_disabled, setdel_disabled] = useState(true);
  useEffect(() => {
    // console.log(selectedRowKeys);
    if (selectedRowKeys.length > 0) {
      setdel_disabled(false);
    } else {
      setdel_disabled(true);
    }
  }, [selectedRowKeys]);
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
    getDocumentLibraryList({ page: page, size: pageSize, document_type: "em" }).then(
      (res) => {
        //   console.log(res.data);
        setdataSource(res.data.list);
        settableloading(false);
        setToal(res.data.total);
      }
    );
  }, [page, pageSize]);
  //   删除确认
  const [del_loading, setdel_loading] = useState(false);
  const text = "Are you sure you want to delete the selected document library?";
  const description =
    "Deleting a document library deletes all the files it contains";
  const confirm = () => {
    //   message.info('Clicked on Yes.');
    if (selectedRowKeys.length > 0) {
      setdel_loading(true);
      settableloading(true);
      console.log(selectedRowKeys);
      deleteDocumentLibrary(selectedRowKeys[0]).then(() => {
        getDocumentLibraryList({ page: page, size: pageSize, document_type: "em" }).then(
          (res) => {
            //   console.log(res.data);
            setdataSource(res.data.list);
            setToal(res.data.total);
            settableloading(false);
            setdel_loading(false);
            message.success("ok");
          }
        );
      });
    } else {
      message.warning("You have not selected a document library");
    }
  };
  //   新建文档库
  const [open, setOpen] = useState(false);
  const addDocumentLibrary = () => {
    setOpen(true);
  };
  return (
    <Spin tip="Loading" size="large" spinning={tableloading || del_loading}>
      {/* <Button type="primary" className="file_BUTTON" style={{backgroundColor:"#2fb79c",marginRight:"80px"}}>Upload</Button> */}
      <Row>
        {/* pdf,jpeg,jpg,png,txt */}
        <Button
          type="primary"
          className="file_BUTTON"
          style={{ backgroundColor: "#2fb79c", marginRight: "40px" }}
          onClick={addDocumentLibrary}
        >
          新建文档库
        </Button>
        {del_disabled ? (
          <Button
            type="primary"
            loading={del_loading}
            className="file_BUTTON"
            style={{ backgroundColor: "#f85157" }}
            onClick={() => {
              message.warning("You have not selected a file");
            }}
            // disabled={del_disabled}
          >
            Delete
          </Button>
        ) : (
          <Popconfirm
            placement="topLeft"
            title={text}
            description={description}
            onConfirm={confirm}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              loading={del_loading}
              className="file_BUTTON"
              style={{ backgroundColor: "#f85157" }}
              // onClick={delete_File}
              // disabled={del_disabled}
            >
              Delete
            </Button>
          </Popconfirm>
        )}
      </Row>
      <Table
        className="documentTable"
        style={{ marginTop: "20px" }}
        rowSelection={rowSelection}
        pagination={{
          position: ["bottomRight"],
          defaultCurrent: 1,
          total: total,
          onChange: onPageChange,
        }}
        columns={columns}
        dataSource={dataSource}
        // loading={tableloading}
        rowKey={(record) => record.id}
        scroll={{
          y: 640,
        }}
      ></Table>
      {/* modal */}
      <Modal
        open={open}
        footer={null}
        onCancel={() => {
            form.setFieldValue("documentLibrary","")
            setOpen(false)}}
        title="新建文档库"
      >
        <Form form={form}>
          <Form.Item name={"documentLibrary"}>
            <Input></Input>
          </Form.Item>
          <Flex justify="end">
            <Button
              className="Modal_Button"
              type="primary"
              style={{ backgroundColor: "#2fb79c", marginRight: "20px" }}
              onClick={() => {
                let reg = new RegExp(/[\\/:*?？"<>|]/);
                if(form.getFieldValue("documentLibrary").trim()||form.getFieldValue("documentLibrary").trim()=="0"){
                    if (reg.test(form.getFieldValue("documentLibrary").trim())) {
                        message.warning("文档库名称格式不规范");
                      } else {
                          addDocumentLibraryRequest({
                          document_name: form.getFieldValue("documentLibrary").trim(), //文件夹名称
                          document_type: "em", //文件夹类型【em | bi】
                        }).then(()=>{
                          setOpen(false)
                          form.setFieldValue("documentLibrary","")
                          getDocumentLibraryList({ page: page, size: pageSize, document_type: "em" }).then(
                            (res) => {
                              //   console.log(res.data);
                              setdataSource(res.data.list);
                              setToal(res.data.total);
                              settableloading(false);
                              setdel_loading(false);
                              message.success("ok");
                            }
                          );
                        })
                      }
                }else{
                  message.warning("您还未输入文档库名称")
                }
              }}
            >
              确认
            </Button>
            <Button
              type="primary"
              className="Modal_Button"
              style={{ backgroundColor: "#f75053" }}
              onClick={() => {
                form.setFieldValue("documentLibrary","")
                setOpen(false)}}
            >
              取消
            </Button>
          </Flex>
        </Form>
      </Modal>
    </Spin>
  );
};
export default DocumentLibrary;
