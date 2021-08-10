import * as echarts from '../ec-canvas/echarts';
import { Collect } from '../../models/collect';
var chart = null;
var dataList = [];

Component({

    properties: {
        cid: Number
    },

    lifetimes: {
        attached() {
            this.echartsComponnet = this.selectComponent('#mychart-dom-line');
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
            dataList = await Collect.getStatByPie(cid)
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
                    text: '某段时间内上传的文件数',
                    left: 'center'
                },
                color: ["#37A2DA"],
                grid: {
                    containLabel: true
                },
                tooltip: {
                    show: true,
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1天', '2天', '3天', '4天', '5天', '6天', '7+天'],
                    // show: false
                },
                yAxis: {
                    x: 'center',
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                    // show: false
                },
                series: [{
                    name: '上传文件数',
                    type: 'line',
                    smooth: true,
                    data: dataList
                }]
            };
            return option;
        },
    }
})
