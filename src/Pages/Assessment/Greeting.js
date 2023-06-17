import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Result } from 'antd';

const { Header } = Layout;

function Greeting() {
    const {type} = useParams();

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
                    {
                        type === 'success'
                        ? <Result 
                            status='success'
                            title='Thank you!'
                            extra={
                                <p>Your test is successfully submitted!</p>
                            }
                        />
                        : <Result 
                            status='error'
                            title='Something went wrong!'
                            extra={
                                <p>Don't worry we saved your responses!</p>
                            }
                        />
                    }
                </div>
            </div>
        </div>
        </Layout>
    )
}

export default Greeting