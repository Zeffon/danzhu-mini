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
            this.echartsComponnet = this.selectComponent('#mychart-dom-gauge');
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
            let res = await Collect.getStatByGauge(cid)
            dataList = res * 100
            this.initEcharts(); //初始化图表
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
                    text: '指定用户组收集的进度情况',
                    left: 'center'
                },
                backgroundColor: "#ffffff",
                color: ["#37A2DA", "#32C5E9", "#67E0E3"],
                series: [{
                    name: '业务指标',
                    type: 'gauge',
                    detail: {
                        formatter: '{value}%'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            width: 30,
                            shadowBlur: 0,
                            color: [
                                [0.3, '#67e0e3'],
                                [0.7, '#37a2da'],
                                [1, '#fd666d']
                            ]
                        }
                    },
                    data: [{
                        value: dataList,
                        name: '完成率',
                    }]

                }]
            };
            return option;
        },
    }
})
