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
          const url = 'http://62.68.146.39:4000/gen/generateMask/' + info.file.name; // Replace with your server URL

          axios.get(url)
            .then(async (response) => {
              sendData(response.data, dataURLOriginal);
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

  const sendData = (maskBase: string, dataURLOriginal: string) => {
    const data = {
      "init_images": [dataURLOriginal],
      "resize_mode": 3,
      "denoising_strength": 0.75,
      "image_cfg_scale": 7,
      "mask": maskBase,
      "mask_blur": 4,
      "inpainting_fill": 1,
      "inpaint_full_res": true,
      "inpaint_full_res_padding": 32,
      "inpainting_mask_invert": 0,
      "initial_noise_multiplier": 0,
      "prompt": "nude, NSFW",
      "batch_size": 1,
      "steps": 20,
      "cfg_scale": 7,
      "override_settings": {},
      "override_settings_restore_afterwards": false,
      "script_args": [],
      "sampler_index": "Euler a",
      "include_init_images": false,
      "send_images": true,
      "save_images": false,
      "alwayson_scripts": {
        "controlnet": {
          "args": [
            {
              "module": "inpaint",
              "model": "control_v11p_sd15_inpaint [ebff9138]"
            }
          ]
        }
      }
    };
    console.log('maskBasestart', data)
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
      "prompt": defaultPrompts,
      "negative_prompt": "(from behind:1.2), blurry, logo, watermark, signature, cropped, out of frame, worst quality, low quality, jpeg artifacts, poorly lit, overexposed, underexposed, glitch, error, out of focus, (semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, digital art, anime, manga:1.3), amateur, (poorly drawn hands, poorly drawn face:1.2), deformed iris, deformed pupils, morbid, duplicate, mutilated, extra fingers, mutated hands, poorly drawn eyes, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, incoherent, (bad-image-v2–39000, bad_prompt_version2, EasyNegative, NG_DeepNegative_V1_4T, bad-artist:0.7), (bad-hands-5)",
      "steps": 30
    };
    sendPostRequest(data)
  }



  const sendPostRequest = (data: any) => {
    openNotificationWithIcon();
    const url = 'http://62.68.146.39:4000/gen'; // Replace with your server URL

    axios.post(url, data)
      .then(response => {
        console.log('POST response:', response.data);
        setImageURL(response.data.images[0]);
        console.log(response.data)
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
                <Descriptions title="Generate mask" layout="vertical" />
                <Dragger {...props}>
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
            </Space>
          </Content>
        </Content>
      </Layout>
      <GenerateReceipModal open={open} setOpen={setOpen} />
    </ConfigProvider>
  )
}

export default App
