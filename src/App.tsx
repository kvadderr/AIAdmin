import { ConfigProvider, Layout, Typography, Descriptions, Button, Input, Space, Statistic, Spin, Image, notification } from "antd"
import type { DescriptionsProps } from 'antd';
import axios from 'axios';
import { useState } from "react";
import GenerateReceipModal from "./shared/GenerateReceipModal";

const { Content, Sider } = Layout;
const { Title } = Typography;

function App() {

  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [defaultPrompts, setDefaultPrompts] = useState("");

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

  const ItemsButton = (props: any) => {
    return (
      <Space wrap>
        <Button onClick={() => sendPostRequest(props.data)} type="primary">Generate</Button>
        <Button onClick={openNotificationIsWait} type="primary">Edit</Button>
        <Button onClick={openNotificationIsWait} type="dashed" style={{ background: '#fff' }}>Documentation</Button>
      </Space>
    )
  };

  const sendPostRequest = (data: any) => {
    openNotificationWithIcon();
    const url = 'http://62.68.146.39:4000/gen'; // Replace with your server URL

    axios.post(url, data)
      .then(response => {
        console.log('POST response:', response.data);
        setImageURL(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('POST error:', error);
        // Handle errors if any
      });
  };

  const austonautData = {
    "prompt": "Astronaut on Mars During sunset",
    "negative_prompt": "(from behind:1.2), blurry, logo, watermark, signature, cropped, out of frame, worst quality, low quality, jpeg artifacts, poorly lit, overexposed, underexposed, glitch, error, out of focus, (semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, digital art, anime, manga:1.3), amateur, (poorly drawn hands, poorly drawn face:1.2), deformed iris, deformed pupils, morbid, duplicate, mutilated, extra fingers, mutated hands, poorly drawn eyes, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, incoherent, (bad-image-v2–39000, bad_prompt_version2, EasyNegative, NG_DeepNegative_V1_4T, bad-artist:0.7), (bad-hands-5)",
    "steps": 20
  }

  const girlsData = {
    "prompt": "Woman, The portrait is ultra-detailed, with sharp focus and high resolution. The model’s skin and eyes are highly detailed, and the golden jewelry is rendered with precision and accuracy. The photograph has a cinematic quality to it, with dramatic lighting that emphasizes the beauty of the model and the richness of her surroundings. The image is captured with an 8k camera and edited using the latest digital tools to produce a flawless final result.",
    "negative_prompt": "(from behind:1.2), blurry, logo, watermark, signature, cropped, out of frame, worst quality, low quality, jpeg artifacts, poorly lit, overexposed, underexposed, glitch, error, out of focus, (semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, digital art, anime, manga:1.3), amateur, (poorly drawn hands, poorly drawn face:1.2), deformed iris, deformed pupils, morbid, duplicate, mutilated, extra fingers, mutated hands, poorly drawn eyes, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, incoherent, (bad-image-v2–39000, bad_prompt_version2, EasyNegative, NG_DeepNegative_V1_4T, bad-artist:0.7), (bad-hands-5)",
    "restore_faces": "true",
    "steps": 20,
    "sampler_name": "Euler a",
    "cfg_scale": 8.5,
  }

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Title',
      children: 'Austonaut',
    },
    {
      key: '2',
      label: 'Steps',
      span: 1,
      children: '15',
    },
    {
      key: '3',
      label: 'Tags',
      span: 1,
      children: 'Генерируем космического человека',
    },
    {
      key: '4',
      label: 'Props',
      span: 3,
      children: 'Astronaut on Mars During sunset',
    },
    {
      key: '3',
      label: 'Negative props',
      span: 3,
      children: '(from behind:1.2), blurry, logo, watermark, signature, cropped, out of frame, worst quality, low quality, jpeg artifacts, poorly lit, overexposed, underexposed, glitch, error, out of focus, (semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, digital art, anime, manga:1.3), amateur, (poorly drawn hands, poorly drawn face:1.2), deformed iris, deformed pupils, morbid, duplicate, mutilated, extra fingers, mutated hands, poorly drawn eyes, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, incoherent, (bad-image-v2–39000, bad_prompt_version2, EasyNegative, NG_DeepNegative_V1_4T, bad-artist:0.7), (bad-hands-5)',
    },
    {
      key: '5',
      label: 'Action',
      children: <ItemsButton data={austonautData} />,
    },
  ];

  const girlItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Title',
      children: 'Beatiful girl',
    },
    {
      key: '2',
      label: 'Steps',
      span: 1,
      children: '20',
    },
    {
      key: '3',
      label: 'Tags',
      span: 1,
      children: 'Создаем красивых девушек',
    },
    {
      key: '4',
      label: 'Props',
      span: 3,
      children: 'The portrait is ultra-detailed, with sharp focus and high resolution. The model’s skin and eyes are highly detailed, and the golden jewelry is rendered with precision and accuracy. The photograph has a cinematic quality to it, with dramatic lighting that emphasizes the beauty of the model and the richness of her surroundings. The image is captured with an 8k camera and edited using the latest digital tools to produce a flawless final result.',
    },
    {
      key: '3',
      label: 'Negative props',
      span: 3,
      children: '(from behind:1.2), blurry, logo, watermark, signature, cropped, out of frame, worst quality, low quality, jpeg artifacts, poorly lit, overexposed, underexposed, glitch, error, out of focus, (semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, digital art, anime, manga:1.3), amateur, (poorly drawn hands, poorly drawn face:1.2), deformed iris, deformed pupils, morbid, duplicate, mutilated, extra fingers, mutated hands, poorly drawn eyes, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, incoherent, (bad-image-v2–39000, bad_prompt_version2, EasyNegative, NG_DeepNegative_V1_4T, bad-artist:0.7), (bad-hands-5)',
    },
    {
      key: '5',
      label: 'Action',
      children: <ItemsButton data={girlsData} />,
    },
  ];

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
                src={"http://62.68.146.39:4000/static/" + imageURL}
              />
            </Content>
          </Space>
        </Sider>
        <Content style={{ padding: '60px 60px 60px 60px', background: '#f6f7fb' }}>
          <Content style={{ boxShadow: '0px 21px 63px -4px rgba(108, 73, 172, 0.2)', padding: '40px', background: '#fff', minHeight: '100vh', borderRadius: '10px' }}>
            <Space direction="vertical" size={40}>
              <Input value={defaultPrompts} onChange={(e) => setDefaultPrompts(e.target.value)} style={{ backgroundColor: "#fff" }} placeholder="prompts" />
              <Button onClick={sendCustomData} type="primary" >Generate</Button>
              <ProductItem items={items} title="Austonaut" />
              <ProductItem items={girlItems} title="Girl" />
            </Space>
          </Content>
        </Content>
      </Layout>
      <GenerateReceipModal open={open} setOpen={setOpen} />
    </ConfigProvider>
  )
}

export default App
