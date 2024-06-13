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
  Select,
  Rate,
  Tabs,
  Table,
  Pagination,
  Popconfirm,
  Upload,
  Spin,
} from "antd";
import {
  getfileList,
  delete_file,
  biUploadFile,
  getDocumentLibraryList
} from "../../../services/fileServices";
import { useSearchParams } from "react-router-dom";
const BiDocumentManagement = () => {
  const [searchParams,setSearchParams]=useSearchParams()
  // console.log(searchParams.get("path"));
  const [form]=Form.useForm()
  const columns = [
    {
      title: "File name",
      dataIndex: "filename",
      render: (text) => {
        return text.substring(text.lastIndexOf("/") + 1);
      },
    },
    // {
    //   title: "Converted",
    //   dataIndex: "converted",
    //   render: (text) => {
    //     if (text) {
    //       return <div className="yes">YES</div>;
    //     } else {
    //       return <div className="no">NO</div>;
    //     }
    //   },
    // },
    // {
    //   title: "Embeddings added",
    //   dataIndex: "embeddings_added",
    //   render: (text) => {
    //     if (text) {
    //       return <div className="yes">YES</div>;
    //     } else {
    //       return <div className="no">NO</div>;
    //     }
    //   },
    // },
    {
      title: "Full path",
      dataIndex: "fullpath",
      render: (text) => {
        return (
          <a href={text} target="_blank">
            View file
          </a>
        );
      },
    },
    // {
    //   title: "Converted path",
    //   dataIndex: "converted_path",
    //   render: (text) => {
    //     if (text) {
    //       return (
    //         <a href={text} target="_blank">
    //           查看链接
    //         </a>
    //       );
    //     } else {
    //       return text;
    //     }
    //   },
    // },
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
    getfileList({ page: page, size: pageSize, type: "bi",folder_path: form.getFieldValue("DocumentLibrarySelect")
    ? form.getFieldValue("DocumentLibrarySelect")
    : searchParams.get("path") }).then((res) => {
      //   console.log(res.data);
      setdataSource(res.data.list);
      settableloading(false);
      setToal(res.data.total);
    });
  }, [page, pageSize]);
  //   删除确认
  const [del_loading, setdel_loading] = useState(false);
  const text = "Are you sure you want to delete the selected file?";
  // const description = '删除选中的文件';
  const confirm = () => {
    //   message.info('Clicked on Yes.');
    if (selectedRowKeys.length > 0) {
      setdel_loading(true);
      settableloading(true);
      delete_file({ filename: selectedRowKeys }).then(() => {
        getfileList({ page: page, size: pageSize, type: "bi",folder_path: form.getFieldValue("DocumentLibrarySelect")
        ? form.getFieldValue("DocumentLibrarySelect")
        : searchParams.get("path") }).then((res) => {
          //   console.log(res.data);
          setdataSource(res.data.list);
          settableloading(false);
          setToal(res.data.total);
          setdel_loading(false);
        });
        message.success("ok");
      });
    } else {
      message.warning("You have not selected a file");
    }
  };
  // 文件上传
  const [fileList, setFileList] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  const uploadProps = () => {
    return {
      name: "file",
      multiple: true,
      maxCount: 20,
      onRemove: (file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
      },
      beforeUpload: (file) => {
        setFileList([...fileList, file]);
        setUploadLoading(true);
        settableloading(true);
        return false;
      },
      onChange(info) {
        // console.log(info);
        // console.log(fileList);
        // console.log(info.file);
        const { status } = info.file;
        if (status !== "uploading") {
          // console.log(info.fileList);
          if (fileList.length === 0) {
            message.error("Please upload the file first");
            return false;
          }
          const formData = new FormData();
          // fileList.forEach((item)=>{
          // console.log(item);
          formData.append("files", info.file);
          formData.append("folder_path", form.getFieldValue("DocumentLibrarySelect")
          ? form.getFieldValue("DocumentLibrarySelect")
          : searchParams.get("path"));
          biUploadFile(formData).then((res) => {
            // setFileList([]);
            setUploadLoading(false);
            getfileList({ page: page, size: pageSize, type: "bi",folder_path: form.getFieldValue("DocumentLibrarySelect")
            ? form.getFieldValue("DocumentLibrarySelect")
            : searchParams.get("path") }).then(
              (res) => {
                //   console.log(res.data);
                setdataSource(res.data.list);
                settableloading(false);
                setToal(res.data.total);
              }
            );
          });
        }
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
          // console.log(info.fileList);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
          // console.log(info.fileList);
        }
      },
    };
  };

    // 文档库下拉框内容
    const [documentLibraryOptions, setDocumentLibraryOptions] = useState([]);
    useEffect(() => {
      getDocumentLibraryList({ document_type: "bi",size:10000 }).then((res) => {
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
  return (
    <Spin
      tip="Loading"
      size="large"
      spinning={tableloading || del_loading || uploadLoading}
    >
      {/* <Button type="primary" className="file_BUTTON" style={{backgroundColor:"#2fb79c",marginRight:"80px"}}>Upload</Button> */}
      <Row>
        <Col span={18}>
        <Upload {...uploadProps()} accept=".xlsx,.csv">
          <Button
            type="primary"
            className="file_BUTTON"
            style={{ backgroundColor: "#2fb79c", marginRight: "40px" }}
            loading={uploadLoading}
          >
            Upload
          </Button>
        </Upload>
        {del_disabled ? (
          <Button
            type="primary"
            loading={del_loading}
            className="file_BUTTON"
            style={{ backgroundColor: "#f85157" }}
            onClick={() => {
              message.warning("You have not selected a file");
            }}
          >
            Delete
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
              style={{ backgroundColor: "#f85157" }}
              // onClick={delete_File}
            >
              Delete
            </Button>
          </Popconfirm>
        )}
        </Col>
        <Col span={6}>
        <Form form={form}>
            <Form.Item label="文档库" name={"DocumentLibrarySelect"}>
              <Select
                onChange={() => {
                  settableloading(true)
                  getfileList({ page: page, size: pageSize, type: "bi",folder_path: form.getFieldValue("DocumentLibrarySelect")
                  ? form.getFieldValue("DocumentLibrarySelect")
                  : searchParams.get("path") }).then((res) => {
                    //   console.log(res.data);
                    setdataSource(res.data.list);
                    settableloading(false);
                    setToal(res.data.total);
                    setdel_loading(false);
                  });
                }}
                defaultValue={searchParams.get("path")}
                options={documentLibraryOptions}
              />
            </Form.Item>
          </Form>
        </Col>
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
        rowKey={(record) => record.filename}
        scroll={{
          y: 640,
        }}
      ></Table>
    </Spin>
  );
};
export default BiDocumentManagement;
