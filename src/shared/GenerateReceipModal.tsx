import { Modal, Button, Space, Tag } from "antd";
import { useState } from "react";

const { CheckableTag } = Tag;
const tagsData = ['Vegetarian', 'Vegan', 'Gluten-free', 'Keto', 'Paleo'];
const tagsGoal = ['Lose weight', 'Maintain weight', 'Gain muscle', 'Improve general health'];
const tagsActivity = ['Sedentary', 'Lightly active', 'Moderately active', 'Very active'];

type GenerateReceipModalType = {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const GenerateReceipModal = (props: GenerateReceipModalType) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter((t) => t !== tag);
        console.log('You are interested in: ', nextSelectedTags);
        setSelectedTags(nextSelectedTags);
    };
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            props.setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        props.setOpen(false);
    };

    return (
        <Modal
            title="Generate new APP"
            open={props.open}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
            width={1000}
            footer={[
                <Button key="back" type="link" onClick={handleCancel}>
                    Return
                </Button>,
                <Button key="Save" type="primary" onClick={handleOk}>
                    Save
                </Button>
            ]}
        >
            <Space direction="vertical" size={20}>
                <p>Your secret token: </p>
        
                <Space size={[0, 8]} wrap>
                    <span style={{ marginRight: 18 }}>Activity:</span>
                    {tagsActivity.map((tag) => (
                        <CheckableTag
                            key={tag}
                            checked={selectedTags.includes(tag)}
                            onChange={(checked) => handleChange(tag, checked)}
                        >
                            {tag}
                        </CheckableTag>
                    ))}
                </Space>
            </Space>
        </Modal>
    );
}

export default GenerateReceipModal;
