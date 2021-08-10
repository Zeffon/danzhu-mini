import * as echarts from '../ec-canvas/echarts';
import { Collect } from '../../models/collect';
let chart = null;
var dataList = [];

Component({

    properties: {
        cid: Number
    },

    lifetimes: {
        attached() {
            this.echartsComponnet = this.selectComponent('#mychart-dom-pie');
            this.getData(); //获取数据
        }
    },

    data: {
        ec: {
            lazyLoad: true // 延迟加载
        }
    },

    methods: {
        async getData() {
            let cid = this.properties.cid
            let list = await Collect.getStatByPie(cid)
            // let arr = new Array
            // for(let i = 0; i < list.length; i++) {
            //     let obj = {};
            //     console.log(list[i])
            //     if(list[i] !== 0) {
            //         obj.value = list[i]
            //         obj.name = `提交${i+1}个文件`
            //         arr.push(obj)
            //     }
            // }
            // console.log(arr)
            dataList = [{
                value: list[0],
                name: '提交1个文件'
            }, {
                value: list[1],
                name: '提交2个文件'
            }, {
                value: list[2],
                name: '提交3个文件'
            }, {
                value: list[3],
                name: '提交4个文件'
            }, {
                value: list[4],
                name: '提交5个以上文件'
            }];
            this.initEcharts(); // 初始化图表
        },

        initEcharts() {
            this.echartsComponnet.init((canvas, width, height) => {
                // 初始化图表
                chart = echarts.init(canvas, null, {
                    width: width,
                    height: height
                });
                // chart.setOption(this.getOption());
                this.setOption(chart);
                // 注意这里一定要返回 chart 实例，否则会影响事件处理等
                return chart;
            });
        },

        setOption(chart) {
            chart.clear();  // 清除
            chart.setOption(this.getOption());  //获取新数据
        },

        getOption: function () {
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: '用户提交的文件数对比情况',
                    left: 'center'
                },
                backgroundColor: "#ffffff",
                color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
                series: [{
                    label: {
                        normal: {
                            fontSize: 14
                        }
                    },
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: ['40%', '60%'],
                    data: dataList
                }]
            };
            return option;
        },
    }
})