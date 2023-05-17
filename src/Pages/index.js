import React, {useState} from 'react';
import { Layout, Button, Drawer  } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

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

const { Header , Footer } = Layout;

function AppLayout() {
    //To manage the sidebar drawer
    const [open, setOpen] = useState(false);
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
                <MenuOutlined className="icon-menu" onClick={showDrawer}/>
            </div>
        </Header>

        <Drawer title="Apexon Assessment System" placement="right" onClose={onClose} open={open}>
            <div className="drawer-body">
                <Button type="link" href="/app/dashboard">Dashboard</Button>
                <Button type="link" href="/app/skills">Skills</Button>
                <Button type="link" href="/app/assessment">Assessment</Button>
                <Button type="link" href="/app/tests">Tests</Button>
            </div>
        </Drawer>

        <>
            <Routes>
                <Route path="/" element={<Navigate to="/app/dashboard" />} />
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
        </>

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