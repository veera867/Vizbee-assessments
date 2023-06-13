import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button,message,Input, Space, Card, List } from 'antd';

const { Header } = Layout;

function Greeting() {

    return (
        <Layout>
        <Header>
            <div className="header-wrapper">
                <div className="logo-header">
                    <img alt="logo" src="/apexon-logo.jpg"/>
                    <h1>Apexon Assessment System</h1>
                </div>
            </div>
        </Header>
        <div className="layout-outer">
            <div className="layout-inner">
                <div className="content-wrapper form-center">
                    <h1>Thank You!</h1>
                    <br></br>
                    <h3>You can close this window now!</h3>
                </div>
            </div>
        </div>
        </Layout>
    )
}

export default Greeting