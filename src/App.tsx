import { ConfigProvider, Layout, Typography, Descriptions, Button, Input, Space, Statistic, Spin, Image, notification } from "antd"
import type { DescriptionsProps } from 'antd';
import axios from 'axios';
import { useEffect, useState } from "react";
import GenerateReceipModal from "./shared/GenerateReceipModal";
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';

const { Dragger } = Upload;
const { Content, Sider } = Layout;
const { Title } = Typography;

function App() {

  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [defaultPrompts, setDefaultPrompts] = useState("");
  const [originalBase, setOriginalBase] = useState("");
  const [originalPhoto, setOriginalPhoto] = useState("");
  const [userFace, setUserFace] = useState("");

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    action: 'http://62.68.146.39:4000/gen/local',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        const url = 'http://62.68.146.39:4000/gen/generateMask/' + info.file.name; // Replace with your server URL

        axios.get(url)
          .then(response => {
            console.log('POST response:', response.data);
            console.log(response.data)
            setImageURL(response.data);
          })
          .catch(error => {
            console.error('POST error:', error);
            // Handle errors if any
          });

      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const propsNSFW: UploadProps = {
    name: 'file',
    multiple: false,
    action: 'http://62.68.146.39:4000/gen/local',
    async onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        let dataURLOriginal = "";
        toDataURL("http://62.68.146.39:4000/img/" + info.file.name, function (dataUrl: string) {
          dataURLOriginal = dataUrl;
        })
        message.success(`${info.file.name} file uploaded successfully.`);
        sendData(info.file.name);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const propsOriginal: UploadProps = {
    name: 'file',
    multiple: false,
    action: 'http://62.68.146.39:4000/gen/local',
    async onChange(info) {
      const dataURLOriginal = await getFileBase64(info.file.originFileObj);
      setOriginalPhoto(dataURLOriginal);
      console.log(dataURLOriginal);
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const propsUserFace: UploadProps = {
    name: 'file',
    multiple: false,
    action: 'http://62.68.146.39:4000/gen/local',
    async onChange(info) {
      const dataURLOriginal = await getFileBase64(info.file.originFileObj);
      setUserFace(dataURLOriginal);
      console.log(dataURLOriginal);
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  async function getFileBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const sendData = (dataURLOriginal: string) => {
    const data = {
      "imageName": dataURLOriginal
    };
    console.log(data)
    sendPostRequest(data)
  }

  function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        var imageData = reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
        callback(imageData);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  const showModal = () => {
    openNotificationWithIcon();
    setOpen(true);
  };


  const openNotificationWithIcon = () => {
    api.open({
      message: <Spin />,
      description:
        'Please wait few second, generation in progress',
    });
  };

  const openNotificationIsWait = () => {
    api.open({
      message: "В разработке",
      description:
        'Скоро будет доступно',
    });
  };

  const sendCustomData = () => {
    const data = {
      "original": originalPhoto,
      "userFace": userFace
    };
    const url = 'http://62.68.146.39:4000/gen/faceSwap'; // Replace with your server URL

    axios.post(url, data)
      .then(response => {
        console.log('POST response:', response.data);
        setImageURL(response.data);
      })
      .catch(error => {
        console.error('POST error:', error);
        // Handle errors if any
      });
  }



  const sendPostRequest = (data: any) => {
    openNotificationWithIcon();
    const url = 'http://62.68.146.39:4000/gen'; // Replace with your server URL

    axios.post(url, data)
      .then(response => {
        console.log('POST response:', response.data);
        setImageURL(response.data);
      })
      .catch(error => {
        console.error('POST error:', error);
        // Handle errors if any
      });
  };

  const ProductItem = (props: any) => {
    return (
      <Space>
        <Descriptions title={props.title} layout="vertical" items={props.items} />
      </Space>
    )
  }

  return (
    <ConfigProvider theme={{
      token: {
        colorBgContainer: '#000000',
        borderRadius: 10
      }
    }}>
      {contextHolder}
      <Layout>
        <Sider width={500} style={{ padding: '60px 0 0px 60px', background: '#f6f7fb' }}>
          <Space style={{ width: '400px' }} direction="vertical" size={30}>
            <Title level={2} style={{ color: "#383874" }}>SDXL local</Title>
            <Space wrap>
              <Button onClick={showModal} type="primary" shape="round">Generate new app</Button>
              <Button onClick={openNotificationIsWait} style={{ background: '#f6f7fb' }}>My apps</Button>
            </Space>
            <Space wrap size={40}>
              <Statistic title="All apps" value={0} />
              <Statistic title="Api callings" value={0} />
              <Statistic title="AVG duration" value={0} />
            </Space>
            <Content style={{ boxShadow: '0px 21px 63px -4px rgba(108, 73, 172, 0.2)', padding: '20px', background: '#fff', borderRadius: '10px' }}>
              <Image
                width={360}
                src={"data:image/png;base64," + imageURL}
              />
            </Content>
          </Space>
        </Sider>
        <Content style={{ padding: '60px 60px 60px 60px', background: '#f6f7fb' }}>
          <Content style={{ boxShadow: '0px 21px 63px -4px rgba(108, 73, 172, 0.2)', padding: '40px', background: '#fff', minHeight: '100vh', borderRadius: '10px' }}>
            <Space direction="vertical" size={40}>
              <Input value={defaultPrompts} onChange={(e) => setDefaultPrompts(e.target.value)} style={{ backgroundColor: "#fff" }} placeholder="prompts" />
              <Button onClick={sendCustomData} type="primary" >Generate</Button>
              <Space direction="vertical">
                <Descriptions title="Generate NSFW" layout="vertical" />
                <Dragger {...propsNSFW}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                  </p>
                </Dragger>
              </Space>
              <Space direction="vertical">
                <Descriptions title="Generate faceswap" layout="vertical" />
                <Space direction="vertical">
                  <Dragger {...propsOriginal}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">СЮДА ЗАГРУЖАЕМ ОРИГИНАЛ</p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                      banned files.
                    </p>
                  </Dragger>
                  <Dragger {...propsUserFace}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">СЮДА ЛИЦО ПОЛЬЗОВАТЕЛЯ</p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                      banned files.
                    </p>
                  </Dragger>
                  <Image
                    width={360}
                    src={originalPhoto}
                  />
                  <Image
                    width={360}
                    src={userFace}
                  />
                </Space>
                <Button onClick={sendCustomData} type="primary" >Generate</Button>
              </Space>
            </Space>
          </Content>
        </Content>
      </Layout>
      <GenerateReceipModal open={open} setOpen={setOpen} />
    </ConfigProvider>
  )
}

export default App
