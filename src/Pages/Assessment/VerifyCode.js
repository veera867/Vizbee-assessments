import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button,message,Input, Space, Card, List } from 'antd';

function VerifyCode() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [code,setCode] = useState('');

    const handleRedirect = async () => {
            navigate(`/app/assessment/${code}`);
    }

    return (
        <div className="layout-outer">
            {contextHolder}
            <div className="layout-inner">
                <div className="content-wrapper form-center">
                    <Card
                        title="Instructions"
                        style={{
                            width: '100%'
                        }}
                    >
                        <List>
                            <List.Item>Make sure that no one else is present in the room. Make sure that your phone is away and on silent mode. Make sure that your laptop/desktop is connected to the power supply and/or UPS</List.Item>
                            <List.Item>Make sure that you have a stable Internet connection of 2Mbps+.Please try to use a broadband connection. Please avoid unstable 3G/4G networks.</List.Item>
                            <List.Item>Make sure that your face is well-lit and clearly visible in the camera. Please make sure that you complete the test in a single go.</List.Item>
                            <List.Item>Disable your screensaver, screen auto-lock, and display auto-sleep. Disable anti-virus popups, and any other system popups</List.Item>
                        </List>
                    </Card>

                    <br />
                    <br />

                    <Space 
                        style={{
                            width: '500'
                        }}
                    >
                        <Space.Compact
                            style={{
                                width: '100%',
                            }}
                        >
                            <Input 
                                placeholder="Enter code" 
                                value={code}
                                onChange={(value)=>setCode(value.target.value)}
                            />
                            <Button type="primary" onClick={handleRedirect}>Start</Button>
                        </Space.Compact>                        
                    </Space>

                    <br />
                    <br />
                </div>
            </div>
        </div>
    )
}

export default VerifyCode