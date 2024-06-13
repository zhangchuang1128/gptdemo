import React from 'react';
import {BrowserRouter} from "react-router-dom";
import {ConfigProvider, Button, message} from 'antd';
import intl from 'react-intl-universal';
import zh_CN from 'antd/es/locale/zh_CN';
import en_US from 'antd/es/locale/en_US';
// import {emit} from './emit';
import PcApp from "./pages/pc";

const locales = {
    "en-US": require('./locales/en-US.json'),
    "zh-CN": require('./locales/zh-CN.json'),
};

document.title="Yunstorm GPT"
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            antdLang: zh_CN,  // 修改antd  组件的国际化
        }
    }
    
    

    // componentDidMount() {
    //     emit.on('change_language', lang => this.loadLocales(lang)); // 监听语言改变事件
    //     this.loadLocales(); // 初始化语言
    // }

    loadLocales(lang = 'zh-CN') {
        // console.log(`lang:${lang}`)
        intl.init({
            currentLocale: lang,  // 设置初始语音
            locales,
        }).then(() => {
            this.setState({
                antdLang: lang === 'zh-CN' ? zh_CN : en_US
            });
        });
    }


    render() {
        // 判断用户来源
        // const isMobile = () => {
        //     return !!navigator.userAgent.match(
        //         /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        //     );
        // };
        return (
            //主题设置
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#39a1d9',
                    },
                }}
                // componentSize='large'
                locale={this.state.antdLang}
            >
                {
                ConfigProvider.config(
                    {
                        prefixCls: 'ant', // 4.13.0+  统一样式前缀
                        iconPrefixCls: 'anticon', // 4.17.0+ 图标统一样式前缀
                    },
                    message.config({  // 全局提示格式
                        top: '40vh',  // 距离顶端高度-默认8
                        style: {
                            lineHeight: '40px',
                            fontSize: '30px',
                        },
                        duration: 3,  // 关闭延时-默认3
                        maxCount: 4,  // 显示最多消息数量-默认无
                        rtl: true,  // 是否开启RTL模式-默认false
                        prefixCls: 'my-message',  // 消息节点的className前缀-默认ant-message
                    })
                )
                }
                {/*路由包含*/}
                <BrowserRouter>
                    <PcApp/>
                </BrowserRouter>
            </ConfigProvider>
        )
    }
}

export default App;
