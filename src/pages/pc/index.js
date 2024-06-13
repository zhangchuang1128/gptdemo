
import React from 'react';
import {Route, Routes, useLocation} from "react-router-dom";
import {Content} from "antd/es/layout/layout";
// import {Provider} from "react-redux";
import Redirect from "../../utils/Redirect";
// import Headers from "./header";
import LoginContainers from "./login/index";
import RegisterContainers from "./login/RegisterContainers"
// import Logout from "./login/Logout";
// import store from "../../configureStore";
import WrappedIndexContainers from '../pc/index/index';
// import Four from "./404";
import './pcIndex.less';



const PcApp = () => {
    const location = useLocation();
document.title=useLocation().pathname.substring(useLocation().pathname.lastIndexOf("/") + 1);

    return (
                <div className="pcContent">
                    <Routes>
                        {/*主页重定向到主页面*/}
                        <Route exact path="/" element={<Redirect to='/AI/Chat-GPT'/>}/>
                        {/*登录*/}
                        <Route exact path='/login' element={<LoginContainers/>}/>
                        {/*注册*/}
                        <Route exact path='/register' element={<RegisterContainers/>}/>
                        {/*登出*/}
                        {/* <Route exact path='/logout' element={<Logout/>}/> */}
                        <Route path='/AI/*' element={localStorage.getItem('token') ? <WrappedIndexContainers/> :
                            <Redirect to='/login'/>}/>
                        {/*/!*全匹配，作为404页面使用*!/*/}
                        {/* <Route path="*" element={<Four/>}/> */}
                    </Routes>
                </div>
    )
};

export default PcApp;
