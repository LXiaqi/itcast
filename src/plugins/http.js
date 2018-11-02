// 模块
// 目的： 把axios的库改成一个vue模块使用

// 导入axios
import axios from 'axios'
import Vue from 'vue';
const HttpTool = {}
HttpTool.install = (vue) => {

    axios.defaults.baseURL ='http://localhost:8888/api/private/v1/'
    Vue.prototype.$http = axios

}
export default HttpTool