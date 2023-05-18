import React, {useState,useEffect} from 'react';
import { Layout, Button, Drawer,Collapse  } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { CaretRightOutlined } from '@ant-design/icons';

import {Navigate , Routes , Route} from 'react-router-dom';
import Assessment from './Assessment';

import '../App.css';
import Skills from './Skills';
import Dashboard from './Dashboard';
import SkillCreate from './Skills/create';
import NewQuestionnaire from './Skills/NewQuestionnaire';
import Schedule from './Dashboard/Schedule';
import CreateTest from './Tests/CreateTest';
import VerifyCode from './Assessment/VerifyCode';
import EditSkill from './Skills/edit';
import Tests from './Tests';
import EditTests from './Tests/EditTests';

const { Header } = Layout;
const { Panel } = Collapse;

function AppLayout() {
    //To manage the sidebar drawer
    const [open, setOpen] = useState(false);
    const [screen,setScreen] = useState(false);

    useEffect(()=>{
        function handleResize() {
            const width = window.innerWidth;
    
            if (width <= 1024) {
                setScreen('small');
            } else {
                setScreen('big');
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    },[]);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    
    return (
        <Layout>
        <Header>
            <div className="header-wrapper">
                <h1>Apexon Assessment System</h1>
                {
                    screen === 'small'
                    ? <MenuOutlined className="icon-menu" onClick={showDrawer}/>
                    : null
                }
            </div>
        </Header>

        {
            screen === 'small'
            ? <Drawer 
                title="Apexon Assessment System" 
                placement="right" 
                onClose={onClose} 
                open={open}
            >
                <div className="drawer-body">
                    <Button type="link" href="/dashboard">Dashboard</Button>
                    <Button type="link" href="/assessment">Assessment</Button>

                    <Collapse 
                        expandIconPosition={'end'} 
                        ghost
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    >
                        <Panel header="Settings" key="1">
                            <Button type="link" href="/skills">Skills</Button>
                            <Button type="link" href="/tests">Tests</Button>
                        </Panel>
                    </Collapse>
                </div>
            </Drawer>
            : null
        }

        <div className="app-container">
            {
                screen === 'big'
                ? <div className="sidebar">
                    <div className="drawer-body">
                        <h3>Menu</h3>
                        <Button type="link" href="/dashboard">Dashboard</Button>
                        <Button type="link" href="/assessment">Assessment</Button>
                        <Collapse 
                            expandIconPosition={'end'} 
                            ghost
                            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        >
                            <Panel header="Settings" key="1">
                                <Button type="link" href="/skills">Skills</Button>
                                <Button type="link" href="/tests">Tests</Button>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
                : null
            }
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />}></Route>
                <Route path="/assessment" element={<VerifyCode />}></Route>
                <Route path="/assessment/:code" element={<Assessment />}></Route>
                <Route path="/assessment/schedule" element={<Schedule />}></Route>
                <Route path="/skills" element={<Skills />}></Route>
                <Route path="/skills/new" element={<SkillCreate />}></Route>
                <Route path="/skills/edit/:id" element={<EditSkill />}></Route>
                <Route path="/skills/new/addQuestionnaire" element={<NewQuestionnaire />}></Route>

                <Route path="/tests" element={<Tests />}></Route>
                <Route path="/tests/new" element={<CreateTest />}></Route>
                <Route path="/tests/edit/:id" element={<EditTests />}></Route>
            </Routes>
        </div>

        {
            /*
                <Footer>
                    Vizbee App ©2023 | All rights reserved.
                </Footer>
            */
        }
    </Layout>
)
}

export default AppLayout