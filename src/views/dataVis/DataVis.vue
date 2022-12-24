<template>
    <div class="mainContainer">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据可视化</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="cardContainer">
            <div class="cardContainer__chartBox">
                <firstChart v-if="(currentChart==1&&flag)" :data_line="yearSales"></firstChart>
                <secondChart v-else-if="(currentChart==2&&flag)" :data_bar="monthSales"></secondChart>
                <thirdChart v-else-if="(currentChart==3&&flag)" :data_pie="wareSales"></thirdChart>
            </div>
            <div class="cardContainer__selectBox" @mouseover="selectHover=true" @mouseleave="handleSelect(false)">
                <em class="cardContainer__selectBox__arrow">
                    <b></b>
                    <i></i>
                </em>
                切换图表
            </div>
            <div class="cardContainer__menuBox" @mouseover="handleSelect(true)" @mouseleave="selectHover=false" v-if="selectHover==true">
                <div class="cardContainer__menuBox__menu" @click="handleCurChart(1)">公司近十年每年总销售额变化图</div>
                <div class="cardContainer__menuBox__menu" @click="handleCurChart(2)">公司某年每月销售额展示</div>
                <div class="cardContainer__menuBox__menu" @click="handleCurChart(3)">公司某年每种物品销售额的占比</div>
            </div>
        </el-card>
    </div>
</template>

<script>
import {get} from '../../utils/request';
import { ElMessage } from "element-plus";
import firstChart from './firstChart'
import secondChart from './secondChart'
import thirdChart from './thirdChart'
export default {
    name:'DataVis',
    data(){
        return{
            selectHover:false,
            timer:null,
            currentChart:1,
            yearSales : [],
            monthSales : [],
            wareSales : [],
            flag :false //是否拿到数据
        }
    },
    mounted(){
        this.getSalesData()
    },
    methods:{
        handleSelect(flag){
            if(!flag){
                this.timer = window.setTimeout(()=>{
                    this.selectHover = false
                },500)
            }else{
                window.clearTimeout(this.timer);
                this.timer = null;
                this.selectHover = true
            }
        },
        handleCurChart(num){
            this.currentChart = num;
        },
        async getSalesData(){
            // console.log("请求路由：isersales/getSalesData")
            try{
                const result = await get('misersales/getSalesData')
                if (result?.msg === "success" && result?.salesData) {
                    const salesData = result.salesData
                    // console.log(result.salesData)
                    for(let i =0;i<result.salesData.length;i++){
                        // console.log(Array.isArray(this.yearSales))
                        this.yearSales.push(salesData[i].fields.yearSales)
                        this.monthSales.push(salesData[i].fields.monthSales)
                        this.wareSales.push(salesData[i].fields.wareSales)
                    }
                    this.flag = true
                }else{
                    ElMessage.error("未获取到数据！");
                }
            }catch{
                ElMessage.error("未获取到数据！");
            }
        }
    },
    components:{firstChart,secondChart,thirdChart}
}
</script>

<style lang="scss" scoped>
.mainContainer{
    width:100%;
    height:100%;
    padding:0.15rem;
    .cardContainer{
        margin: 0.15rem 0 0rem 0;
        position: relative;
        &__chartBox{
            // background-color: rgb(185, 55, 55);
            width: 8rem;
            height: 4.18rem;
        }
        &__selectBox{
            padding: 0 0.1rem 0 0.1rem;
            width:0.9rem;
            height:.3rem;
            background-color: rgb(99, 110, 132);
            position: absolute;
            right:.2rem;
            top:.2rem;
            cursor: pointer;
            text-align: right;
            line-height: .3rem;
            font-size: .14rem;
            border-radius: 0.02rem;
            color:#fff;
            &__arrow{
                width:0.12rem;
                height: 0.12rem;
                position: absolute;
                top:50%;
                left: 0.06rem;
                margin-top: -0.06rem;
                transition: transform .2s ease 0s;
                b{
                    position: absolute;
                    right:0.03rem;
                    top:0.03rem;
                    width:0.06rem;
                    height: 0.06rem;
                    background-color: #fff;
                    transform: rotate(45deg);
                }
                i{
                    position: absolute;
                    right:0.05rem;
                    top:0.03rem;
                    width:0.06rem;
                    height: 0.06rem;
                    background-color: rgb(99, 110, 132);
                    transform: rotate(45deg);
                }
            }
            &:hover{
                background-color: rgb(100, 114, 142);
                .cardContainer__selectBox__arrow{
                    transform: rotate(180deg);
                    top:55%;
                    i{
                        background-color: rgb(100, 114, 142);
                    }
                }
            }
        }
        &__menuBox{
            width:2.3rem;
            height:0.9rem;
            background-color: rgba(99, 110, 132,0.6);
            position: absolute;
            right:1.2rem;
            top:.2rem;
            cursor: pointer;
            text-align: center;
            font-size: .14rem;
            border-radius: 0.02rem;
            color:#fff;
            &__menu{
                height:.3rem;
                line-height: .3rem;
            }
            &__menu:hover{
                background-color: rgb(99, 110, 132);
            }
        }
    }
}
</style>