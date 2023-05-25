import React, {useState,useEffect} from 'react';
import { Layout, Button, Drawer, Collapse  } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { CaretRightOutlined,CalendarFilled,FileProtectOutlined,
    SettingFilled,TrophyOutlined,FileDoneOutlined,PlayCircleOutlined } from '@ant-design/icons';

import {Navigate , Routes , Route, useLocation} from 'react-router-dom';
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
import Jobs from './Jobs';
import CreateJob from './Jobs/CreateJobs';
import EditJobs from './Jobs/EditJobs';

const { Header } = Layout;
const { Panel } = Collapse;

function AppLayout() {
    const location = useLocation();

    //To manage the sidebar drawer
    const [open, setOpen] = useState(false);
    const [screen,setScreen] = useState(false);
    const [collapseActive,setCollapseActive] = useState(false);

    const [login,setLogin] = useState(true);

    useEffect(()=>{
        if(location.pathname.includes('skills') || location.pathname.includes('tests')){
            setCollapseActive(true);
        } else {
            setCollapseActive(false);
        }
    },[]);

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
                <div className="logo-header">
                    <img alt="logo" src="/apexon-logo.jpg"/>
                    <h1>Apexon Assessment System</h1>
                </div>

                {
                    login
                    ? <Button type="link" className="auth-link" href='/auth/login'>Signout</Button>
                    : <Button type="link" className="auth-link" href='/auth/login'>Login</Button>
                }

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
                    <Button type="link" 
                        icon={<CalendarFilled />}
                        href="/app/jobs" 
                        className={location.pathname.includes('jobs') ? 'link active' : 'link'}
                    >
                        Jobs Dashboard
                    </Button>
                    <Button type="link" 
                        icon={<FileProtectOutlined />}
                        href="/app/asmt-dashboard" 
                        className={location.pathname.includes('asmt-dashboard') ? 'link active' : 'link'}
                    >
                        Assessment Dashboard
                    </Button>
                    
                    <Button type="link" 
                        icon={<PlayCircleOutlined />}
                        href="/app/assessment"
                        className={location.pathname.includes('assessment') ? 'link active' : 'link'}
                    >
                        Live Assessment
                    </Button>

                    <Collapse 
                        expandIconPosition={'end'} 
                        defaultActiveKey={collapseActive ? ['1'] : ''}
                        ghost
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    >
                        <Panel 
                            header="Settings" 
                            key="1"
                        >
                            <Button type="link" 
                                icon={<TrophyOutlined />}
                                href="/app/skills"
                                className={location.pathname.includes('skills') ? 'link active' : 'link'}
                            >Skills</Button>
                            <Button type="link" 
                                icon={<FileDoneOutlined />}
                                href="/app/tests"
                                className={location.pathname.includes('tests') ? 'link active' : 'link'}
                            >Tests</Button>
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
                        <h3></h3>

                        <Button type="link" 
                            icon={<CalendarFilled />}
                            href="/app/jobs" 
                            className={location.pathname.includes('jobs') ? 'link active' : 'link'}
                        >
                            Jobs Dashboard
                        </Button>
                        <Button type="link" 
                            icon={<FileProtectOutlined />}
                            href="/app/asmt-dashboard" 
                            className={location.pathname.includes('asmt-dashboard') ? 'link active' : 'link'}
                        >
                            Assessment Dashboard
                        </Button>
                        
                        <Button type="link" 
                            icon={<PlayCircleOutlined />}
                            href="/app/assessment"
                            className={location.pathname.includes('assessment') ? 'link active' : 'link'}
                        >
                            Live Assessment
                        </Button>
                        <Collapse 
                            expandIconPosition={'end'} 
                            defaultActiveKey={collapseActive ? ['1'] : ''}
                            ghost
                            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        >
                            <Panel 
                                header="Settings" 
                                key="1"
                            >
                                <Button type="link" 
                                    icon={<TrophyOutlined />}
                                    href="/app/skills"
                                    className={location.pathname.includes('skills') ? 'link active' : 'link'}
                                >Skills</Button>
                                <Button type="link" 
                                    icon={<FileDoneOutlined />}
                                    href="/app/tests"
                                    className={location.pathname.includes('tests') ? 'link active' : 'link'}
                                >Tests</Button>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
                : null
            }
            
            <Routes>
                <Route path="/" element={<Navigate to="/jobs" />} />
                <Route path="/asmt-dashboard" element={<Dashboard />}></Route>
                <Route path="/asmt-dashboard/schedule" element={<Schedule />}></Route>

                <Route path="/skills" element={<Skills />}></Route>
                <Route path="/skills/new" element={<SkillCreate />}></Route>
                <Route path="/skills/edit/:id" element={<EditSkill />}></Route>
                <Route path="/skills/new/addQuestionnaire" element={<NewQuestionnaire />}></Route>

                <Route path="/tests" element={<Tests />}></Route>
                <Route path="/tests/new" element={<CreateTest />}></Route>
                <Route path="/tests/edit/:id" element={<EditTests />}></Route>

                <Route path="/jobs" element={<Jobs />}></Route>
                <Route path="/jobs/new" element={<CreateJob />}></Route>
                <Route path="/jobs/edit/:id" element={<EditJobs />}></Route>

                <Route path="/assessment" element={<VerifyCode />}></Route>
                <Route path="/assessment/:code" element={<Assessment />}></Route>
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