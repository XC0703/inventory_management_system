<template>
    <div id="secondChartBox"></div>
</template>

<script>
let echarts = require("echarts/lib/echarts");

export default {
    name: "secondChart",
    props:["data_bar"],
    mounted(){
        this.mapChart();
    },
    methods: {
        // 配置渲染map
        mapChart() {
            // var data_bar = [[0.24,0.3,2,2,5,9,10,14,7,10,9,8],
            //                 [0.44,3,5,2,3,4,11,13,3,5,7,2,6],
            //                 [0.54,3.3,5.7,2.9,5.3,6,16,12,10,4.8,8.2,5.6],
            //                 [0.54,4.5,3,2,5,9,13,11,7,1,10,8],
            //                 [0.64,7.6,1,3,5,9,9,12,6,13,1,6],
            //                 [0.74,6.7,3,4,5,9,8,19,6,12,12,5],
            //                 [1.24,7.9,6,4,5,9,14,12,4,13,10,2],
            //                 [2.24,3.7,3,7,5,9,12,14,8,11,12,4],
            //                 [3.24,2.3,7,5,5,10,13,16,9,12,2,8],
            //                 [1.24,4.5,4,2,5,9,11,19,10,13,12,7]];
            const data_bar = [...this.data_bar]
            // console.log(data_bar)
            var chartDom = document.getElementById("secondChartBox");
            let myChart = echarts.getInstanceByDom(chartDom)
            if(myChart!=null){
                myChart.dispose();
                myChart = echarts.init(chartDom);
                window.addEventListener("resize", ()=>{
                    myChart.resize();
                });
            }else{
                myChart = echarts.init(chartDom);
            }
            function initEcharts(){
                let option = {
                    baseOption:{
                        timeline:{
                            show:true,
                            axisType: 'category',
                            currentIndex:0,
                            bottom:0,
                            playInterval:1000,
                            data: ['2012', '2013', '2014','2015','2016','2017','2018','2019','2020','2021']
                        },
                        title:{
                            left:"center",
                            textStyle:{
                                fontSize:17
                            }
                        },
                        grid: {
                            top: '15%',
                            left: '5%',
                            right: '5%',
                            bottom: '12%',
                            containLabel: true,
                        },
                        tooltip: {
                            trigger: 'axis',
                            formatter:function(params){
                                return params[0].name+'销售额为'+params[0].value+'万元'
                            },
                            axisPointer: {
                                lineStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [
                                            {
                                                offset: 0,
                                                color: 'rgba(255,255,255,0)', // 0% 处的颜色
                                            },
                                            {
                                                offset: 0.5,
                                                color: 'rgba(255,255,255,1)', // 100% 处的颜色
                                            },
                                            {
                                                offset: 1,
                                                color: 'rgba(255,255,255,0)', // 100% 处的颜色
                                            },
                                        ],
                                        global: false, // 缺省为 false
                                    },
                                },
                            },
                        },
                        xAxis: [
                            {
                                type: 'category',
                                axisLabel: {
                                    formatter: '{value}',
                                    // fontSize: 14,
                                    // margin: 20,
                                    color: '#0F2650',
                                    fontSize:11,
                                    // rotate:30,
                                    interval: 0
                                },
                                axisLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#0F2650',
                                    },
                                },
                                axisTick: {
                                    show: true,
                                    alignWithLabel:true
                                },
                                data: ['1月', '2月', '3月','4月','5月','6月', '7月','8月','9月','10月','11月','12月'],
                            },
                        ],
                        yAxis: [
                            {
                                boundaryGap: false,
                                name:'单位(万元)',
                                type: 'value',
                                min:0,
                                max:20,
                                axisLabel: {
                                    formatter:'{value}',
                                    color: '#0F2650',
                                },
                                nameTextStyle: {
                                    color: '#0F2650',
                                    fontSize: 12,
                                    lineHeight: 20,
                                },
                                axisLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#0F2650',
                                    },
                                },
                                axisTick: {
                                    show: false,
                                },
                            },
                        ],
                        series: [
                            {
                                name: '销售额',
                                type: 'bar',
                                barWidth: 10,
                                zlevel: 3,
                                itemStyle: {
                                    color: new echarts.graphic.LinearGradient(
                                            0,
                                            0,
                                            0,
                                            1,
                                            [
                                                {
                                                    offset: 0,
                                                    color: 'rgba(15,38,80,1)',
                                                },
                                                {
                                                    offset: 0.8,
                                                    color: 'rgba(15,38,80,0.7)',
                                                },
                                            ],
                                            false
                                        ),
                                    borderColor: '#0F2650',
                                },
                            },
                        ],
                    },
                    options: [
                        {
                            title:{text:'公司2012年每月销售额展示'},
                            series:{data: data_bar[0]}
                        },
                        {
                            title:{text:'公司2013年每月销售额展示'},
                            series:{data: data_bar[1]}
                        },
                        {
                            title:{text:'公司2014年每月销售额展示'},
                            series:{data: data_bar[2]}
                        },
                        {
                            title:{text:'公司2015年每月销售额展示'},
                            series:{data: data_bar[3],}
                        },
                        {
                            title:{text:'公司2016年每月销售额展示'},
                            series:{data: data_bar[4]}
                        },
                        {
                            title:{text:'公司2017年每月销售额展示'},
                            series:{data: data_bar[5]}
                        },
                        {
                            title:{text:'公司2018年每月销售额展示'},
                            series:{data: data_bar[6]}
                        },
                        {
                            title:{text:'公司2019年每月销售额展示'},
                            series:{data: data_bar[7]}
                        },
                        {
                            title:{text:'公司2020年每月销售额展示'},
                            series:{data: data_bar[8]}
                        },
                        {
                            title:{text:'公司2021年每月销售额展示'},
                            series:{data: data_bar[9]}
                        }
                    ]
                };
                myChart.setOption(option);
            }
            initEcharts()
        }
    }
};
</script>

<style lang="scss" scoped>
#secondChartBox {
    width: 8rem;
    height: 4.18rem;
    margin: 0rem auto 0;
}
</style>


