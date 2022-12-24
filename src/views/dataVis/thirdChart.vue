<template>
    <div id="thirdChartBox"></div>
</template>

<script>
import data_pie from '@/assets/simulateData/data_thirdChart.json'
let echarts = require("echarts/lib/echarts");

export default {
    name: "thirdChart",
    props:["data_pie"],
    mounted(){
        this.mapChart();
    },
    methods: {
        // 配置渲染map
        mapChart() {
            // const data_pie = [...this.data_pie]
            var chartDom = document.getElementById("thirdChartBox");
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
                        title : {
                            text: '公司某年',
                            x:'center',
                            textStyle:{
                                fontSize:17
                            },
                        },
                        color:['#0F2650','#063F76','#246EAB',' #5095CE',' #73C0DE','#F3C450','#5095CE','#F1C27F','#FF9500'],
                        tooltip : {
                            trigger: 'item',
                            formatter: function(params){
                                return params.name+"："+params.value+'%<br/>销售额：'+params.data.salesVolume+'万元'
                            }
                        },
                        calculable : true,
                        series : [
                            {
                                type:'pie',
                                radius : [30, 240],
                                center : ['50%', '65%'],
                                roseType : 'area',
                                data:data_pie,
                                label:{
                                    fontSize:12,
                                    color:'#333',
                                    position:'outside',
                                },
                            }
                        ]
                    },
                    options: [
                        {
                            title:{text:'2012年每种物品销售额的占比'},
                            series:{data: data_pie[0]}
                        },
                        {
                            title:{text:'2013年每种物品销售额的占比'},
                            series:{data: data_pie[1]}
                        },
                        {
                            title:{text:'2014年每种物品销售额的占比'},
                            series:{data: data_pie[2]}
                        },
                        {
                            title:{text:'2015年每种物品销售额的占比'},
                            series:{data: data_pie[3],}
                        },
                        {
                            title:{text:'2016年每种物品销售额的占比'},
                            series:{data: data_pie[4]}
                        },
                        {
                            title:{text:'2017年每种物品销售额的占比'},
                            series:{data: data_pie[5]}
                        },
                        {
                            title:{text:'2018年每种物品销售额的占比'},
                            series:{data: data_pie[6]}
                        },
                        {
                            title:{text:'2019年每种物品销售额的占比'},
                            series:{data: data_pie[7]}
                        },
                        {
                            title:{text:'2020年每种物品销售额的占比'},
                            series:{data: data_pie[8]}
                        },
                        {
                            title:{text:'2021年每种物品销售额的占比'},
                            series:{data: data_pie[9]}
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
#thirdChartBox {
    width: 8rem;
    height: 4.18rem;
    margin: 0rem auto 0;
}
</style>


