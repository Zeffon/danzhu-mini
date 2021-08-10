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
            this.echartsComponnet = this.selectComponent('#mychart-dom-bar');
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
            dataList = await Collect.getStatByBar(cid)
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
                color: ['#37a2da', '#32c5e9', '#67e0e3'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    confine: true
                },
                legend: {
                    data: ['已提交', '未提交']
                },
                grid: {
                    left: 20,
                    right: 20,
                    bottom: 15,
                    top: 40,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#999'
                            }
                        },
                        axisLabel: {
                            color: '#666'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        axisTick: { show: false },
                        data: ['用户组', '非用户组'],
                        axisLine: {
                            lineStyle: {
                                color: '#999'
                            }
                        },
                        axisLabel: {
                            color: '#666'
                        }
                    }
                ],
                series: [
                    {
                        name: '已提交',
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        },
                        data: dataList[0],
                        itemStyle: {
                            emphasis: {
                                color: '#37a2da'
                            }
                        }
                    },
                    {
                        name: '未提交',
                        type: 'bar',
                        label: {
                            normal: {
                                show: true
                            }
                        },
                        data: dataList[1],
                        itemStyle: {
                            emphasis: {
                                color: '#32c5e9'
                            }
                        }
                    }
                ]
            };
            return option;
        },

    }
})
