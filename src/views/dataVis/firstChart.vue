<template>
    <div id="firstChartBox"></div>
</template>

<script>
let echarts = require("echarts/lib/echarts");

export default {
    name: "firstChart",
    props:["data_line"],
    mounted(){
        // console.log(this.data_line[0])
        this.mapChart();
    },
    methods: {
        // 配置渲染map
        mapChart() {
            const data_line = [...this.data_line];
            const chartDom = document.getElementById("firstChartBox");
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
                    title:{
                        text: '公司近十年每年总销售额变化图',
                        x:'center',
                        textStyle:{
                            fontSize:17
                        },
                        top:-3,
                        left:'center',
                    },
                    grid: {
                        top: '15%',
                        left: '3%',
                        right: '3%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter:'{b}年{a}：'+'{c}'+'万元',
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
                            boundaryGap: false,
                            axisLabel: {
                                interval:0,
                                rotate:45,
                                formatter: '{value}',
                                fontSize: 12,
                                // margin: 20,
                                color: '#0F2650',
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#0F2650',
                                },
                            },
                            axisTick: {
                                show: true,
                                alignWithLabel:true
                            },
                            data: ['2012','2013','2014','2015','2016','2017','2018','2019','2020', '2021'],
                        },
                    ],
                    yAxis: [
                        {
                            boundaryGap: false,
                            type: 'value',
                            min:0,
                            max:100,
                            interval:22,
                            name:'单位(万元)',
                            nameTextStyle:{
                                color: '#0F2650', // 文字颜色
                                fontSize:12
                            },                      
                            axisLabel: {
                                formatter:'{value}',
                                color: '#0F2650',
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
                            type: 'line',
                            smooth: true,
                            showSymbol: true,
                            symbolSize: 3,
                            zlevel: 3,
                            itemStyle: {
                                color: '#0F2650',
                                borderColor: '#0F2650',
                            },
                            lineStyle: {
                                width: 1,
                                color: '#0F2650',
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: 'rgba(15,38,80,0.2)',
                                        },
                                        {
                                            offset: 0.8,
                                            color: 'rgba(15,38,80,0)',
                                        },
                                    ],
                                    false
                                ),
                            },
                            markPoint:{
                                symbol: 'pin', //标记(气泡)的图形
                                symbolSize: 25, //标记(气泡)的大小
                                itemStyle: {
                                    borderColor: '#000', //图形的描边颜色。支持的颜色格式同 color，不支持回调函数。
                                    borderWidth: 0, //描边线宽。为 0 时无描边。
                                    borderType: 'solid', //柱条的描边类型，默认为实线，支持 ‘solid’, ‘dashed’, ‘dotted’。
                                },
                                label:{
                                    position:'top',
                                    color:'rgba(15,38,80,0.6)',
                                    fontSize:12,
                                },
                                data: [
                                    { name: '2013年', coord: [1, 64.44],value:'公司重组'},
                                    { name: '2018年', coord: [6, 65],value:'公司改革'},
                                    { name: '2020年', coord: [8, 87],value:'新冠疫情开始'},
                                ],
                            },
                            data: data_line,
                        },
                    ],
                };
                myChart.setOption(option);
            }
            initEcharts()
        }
    }
};
</script>

<style lang="scss" scoped>
#firstChartBox {
    width: 8rem;
    height: 4.18rem;
    margin: 0rem auto 0;
}
</style>


