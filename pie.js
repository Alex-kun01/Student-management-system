!(function(){
    const pie = {
        init(){
            this.getData();
            this.option = {
                title:{
                    text:'',
                    left:'center',
                    subtext:'加州理工大学'
                },
                legend:{
                    orient:'vertical',
                    left:'left',
                    data:[]
                },
                tooltip:{//提示框组件
                    formatter:'{a} <br> {b} : {c} ({d}%)'
                },
                series:{
                    name:'',
                    type:'pie',
                    radius:'55%',
                    center:['50%','60%'],
                    itemStyle:{
                        emphasis:{
                            shadowBlur:10,
                            shadowColor:'rgba(0,0,0,0.5)'
                        }
                    },
                    data:[]
                }
            }
        },
        getData(){//请求数据的方法
            const This = this;
            $.ajax({
                //{"address":"成都","appkey":"one_006_1569932435120","birth":1997,"ctime":1571808785,"email":"888@qq.com",
                //"id":37257,"name":"蒋治坤","phone":"17683059017","sNo":"0001","sex":0,"utime":1571808785}
                url:'https://open.duyiedu.com/api/student/findAll?appkey=one_006_1569932435120',
                success(data){
                    console.log(JSON.parse(data).data);
                    const list = JSON.parse(data).data;
                    if(list.length > 0){
                        //绘制图标
                        This.areaCharts(list);
                        This.sexCharts(list);
                    }else{
                        alert('接口又爆了哟亲！！！')
                    }
                }
            })
        },
        areaCharts(data){
            const myChart = echarts.init($('.area')[0]);
            const legendData = [];
            const seriersData = [];
            const newData = {};
            data.forEach(ele =>{
                if(!newData[ele.address]){
                    newData[ele.address] = 1;
                    legendData.push(ele.address);
                }else{
                    newData[ele.address]++;
                }
            });

            for(let prop in newData){
                seriersData.push({
                    name:prop,
                    value:newData[prop]
                });
            }
            this.option.title.text = '学生地区分布统计';
            this.option.legend.data = legendData;
            this.option.series.name = '地区分布';
            this.option.series.data = seriersData;
            myChart.setOption(this.option);
            
        },
        sexCharts(data){
            const myChart = echarts.init($('.sex')[0]);
            const legendData = ['男','女'];
          
            const newData = {};
            data.forEach(ele =>{
                if(!newData[ele.sex]){
                    newData[ele.sex] = 1;
                }else{
                    newData[ele.sex]++;
                }
            });
            const seriersData = [{name:'男',value:newData[0]},{name:'女',value:newData[1]}];

           
            this.option.title.text = '学生性别统计';
            this.option.legend.data = legendData;
            this.option.series.name = '性别分布';
            this.option.series.data = seriersData;
            myChart.setOption(this.option);
        }
    }

   pie.init();
}())