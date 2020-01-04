 // 获取search参数
 function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

var upColor = '#00da3c';
var downColor = '#ec0000';


function splitData(rawData) {
    var categoryData = [];
    var values = [];
    var volumes = [];
    for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i]);
        volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
    }

    return {
        categoryData: categoryData,
        values: values,
        volumes: volumes
    };
}

function calculateMA(dayCount, data) {
    var result = [];
    for (var i = 0, len = data.values.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += data.values[i - j][1];
        }
        result.push(+(sum / dayCount).toFixed(3));
    }
    return result;
}



var code = getUrlParam('code');
var date = getUrlParam('date');
var stock_cash_flowData = [],stock_liabilitiesData=[],stock_profitData = [];
$.ajax({
    url: `https://stock.zhixiutec.com/api/stock/detail?code=${code}&date=${date}`,
    success: function (res) {
        var data = res.data;
        var per_ticket = data.per_ticket;
        // 条件命中的标签 
        var predict = data.predict;
        var str = predict.percent >= 0 ? " +" : " ";
        if(predict.percent>0){
            $('#percits_price').addClass('winner')
        }else{
            $('#percits_price').addClass('loser')
        }
        $('#percits_date').text(predict.date)
        $('#percits_name').text(predict.name)
        $('#percits_code').text(predict.code)
        var conditionText = "";
        predict.condition.split('; ').map(item => {
            conditionText += `<span class="ant-tag-red">${item}</span>`
        })
        $('#percits_condition').html(conditionText)
        var badconditionText = "";
        predict.bad_condition.split('; ').map(item => {
            badconditionText += `<span class="ant-tag-red">${item}</span>`
        })
        $('#percits_bad_condition').html(badconditionText)

        var financeText = "";
        predict.finance.split('; ').map(item => {
            financeText += `<span class="ant-tag-red">${item}</span>`
        })
        $('#percits_finance').html(financeText)

        $('#percits_price').text(`${predict.price}${str}${predict.percent}%`)
        $('#percits_sm_count').text(predict.sm_count)
        $('#percits_fund_count').text(predict.fund_count)
        // 股票的详情数据
        var stock = data.stock;
        $('#detail_address').text(stock.address);
        $('#detail_belong').text(stock.belong);
        $('#detail_address').text(stock.address);

      

        $('#detail_business_scope').text(stock.business_scope);
        $('#detail_code').text(stock.code);
        $('#detail_company_name').text(stock.company_name);

      
        $('#detail_concept').text(stock.concept);
        $('#detail_establishment_time').text(stock.establishment_time);
        $('#detail_history_names').text(stock.history_names);
        $('#detail_institutional_type').text(stock.institutional_type);
        $('#detail_listing_date').text(stock.listing_date);
        $('#detail_location').text(stock.location);
        $('#detail_major_businesses').text(stock.major_businesses);
        $('#detail_name').text(stock.name);
        $('#detail_net_address').text(stock.net_address);
        $('#detail_organizational_form').text(stock.organizational_form);
        console.log('stock',stock)
        // 现金流量表 
        var stock_cash_flow = data.stock_cash_flow;
        var date = [], cash_remain = [], fundraising_cash_flow = [], invest_cash_flow = [], manage_cash_flow = [];
        stock_cash_flow.forEach(item => {
            date.push(item.date);
            cash_remain.push(item.cash_remain);
            fundraising_cash_flow.push(item.fundraising_cash_flow)
            invest_cash_flow.push(item.invest_cash_flow)
            manage_cash_flow.push(item.manage_cash_flow)
        })
        stock_cash_flowData = [{
            name: '经营活动产生的现金流量净额',
            type: 'line',
            stack: '总量',
            data: manage_cash_flow
        }, {
            name: '投资活动产生的现金流量净额',
            type: 'line',
            stack: '总量',
            data: invest_cash_flow
        }, {
            name: '筹资活动产生的现金流量净额',
            type: 'line',
            stack: '总量',
            data: fundraising_cash_flow
        }, {
            name: '期末现金及现金等价物余额',
            type: 'line',
            stack: '总量',
            data: cash_remain
        }]

        // 资产负债表
        var stock_liabilities = data.stock_liabilities;
        var current_assets = [],not_current_assets=[],total_assets=[],current_liabilities=[],not_current_liabilities=[],total_liabilities=[];
        stock_liabilities.forEach(item => {
            current_assets.push(item.current_assets);
            not_current_assets.push(item.not_current_assets);
            total_assets.push(item.total_assets);
            current_liabilities.push(item.current_liabilities);
            not_current_liabilities.push(item.not_current_liabilities);
            total_liabilities.push(item.total_liabilities);
        })
        stock_liabilitiesData=[{
            name: '流动资产合计',
            type: 'line',
            stack: '总量',
            data: current_assets
        },{
            name: '非流动资产合计',
            type: 'line',
            stack: '总量',
            data: not_current_assets
        },{
            name: '资产总计',
            type: 'line',
            stack: '总量',
            data: total_assets
        },{
            name: '流动负债合计',
            type: 'line',
            stack: '总量',
            data: current_liabilities
        },{
            name: '非流动负债合计',
            type: 'line',
            stack: '总量',
            data: not_current_liabilities
        },{
            name: '负债合计',
            type: 'line',
            stack: '总量',
            data: total_liabilities
        }]
        // 利润表
        var stock_profit = data.stock_profit;
        var gross_trading_income = [],total_operating_cost=[],net_profit=[];
        stock_profit.forEach(item => {
            gross_trading_income.push(item.gross_trading_income);
            total_operating_cost.push(item.total_operating_cost);
            net_profit.push(item.net_profit);
        })
        stock_profitData = [{
            name: '营业总收入',
            type: 'line',
            stack: '总量',
            data: gross_trading_income
        }, {
            name: '营业总成本',
            type: 'line',
            stack: '总量',
            data: total_operating_cost
        }, {
            name: '净利润 ',
            type: 'line',
            stack: '总量',
            data: net_profit
        }]
        // 股票十大流通股东， 主要为了展示想比上一个季度报表的 change 变化情况
        var stockholder = data.stockholder;
        //固定和滚动
        // var right_div2 = document.getElementById("right_div2");
        // right_div2.onscroll = function () {
        //     var right_div2_top = this.scrollTop;
        //     var right_div2_left = this.scrollLeft;
        //     document.getElementById("left_div2").scrollTop = right_div2_top;
        //     document.getElementById("right_div1").scrollLeft = right_div2_left;
        // }
        // //设置右边div宽度
        // document.getElementById("right_div").style.width = "" + document.documentElement.clientWidth - 130 + "px";
        // setInterval(function () {
        //     document.getElementById("right_div").style.width = "" + document.documentElement.clientWidth - 130 + "px";
        // }, 0);



        // for (var i = 0; i < stockholder.length; i++) {
        //     $("#left_table2").append(`<tr><th>${stockholder[i].name}</th></tr>`);
        //     $("#right_table2").append("<tr><td>" + stockholder[i].change + "</td><td>" + stockholder[i].code + "</td><td>" + stockholder[i].percent + "</td><td>" + stockholder[i].count + "</td><td>" + stockholder[i].holder_name + "</td></tr>");
        // }
        // day
        var ticket_history = data.ticket_history;
        var dayData = [];
        ticket_history.forEach(item => {
            dayData.push([item.date,item.kai,item.shou,item.low,item.high,item.total_count])
        })
        // week
        var ticket_history_weekly = data.ticket_history_weekly;
        console.log('ticket_history_weekly',ticket_history_weekly)

        var myChart_stock_cash_flow = echarts.init(document.getElementById('stock_cash_flow'))

        var stock_cash_flow = {
            title: {
                text: '现金流量表趋势'
            },
            tooltip: {
                trigger: 'axis'
            },
            // legend: {
            //     data: ['经营活动产生的现金流量净额', '投资活动产生的现金流量净额', '筹资活动产生的现金流量净额', '期末现金及现金等价物余额']
            // },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            toolbox: {
                show: false,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: {readOnly: false},
                    magicType: {type: ['line', 'bar']},
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date
            },
            yAxis: {
                type: 'value'
            },
            series: stock_cash_flowData
        };


        myChart_stock_cash_flow.setOption(stock_cash_flow)



        var myChart_stock_liabilities = echarts.init(document.getElementById('stock_liabilities'))

        var stock_liabilities = {
            title: {
                text: '资产负债趋势'
            },
            tooltip: {
                trigger: 'axis'
            },
            // legend: {
            //     data: ['经营活动产生的现金流量净额', '投资活动产生的现金流量净额', '筹资活动产生的现金流量净额', '期末现金及现金等价物余额']
            // },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                show: false,
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date
            },
            yAxis: {
                type: 'value'
            },
            series: stock_liabilitiesData
        };


        myChart_stock_liabilities.setOption(stock_liabilities)




        // 利润
        var myChart_stock_profit  = echarts.init(document.getElementById('stock_profit'))

        var stock_profit  = {
            title: {
                text: '利润趋势'
            },
            tooltip: {
                trigger: 'axis'
            },
            // legend: {
            //     data: ['经营活动产生的现金流量净额', '投资活动产生的现金流量净额', '筹资活动产生的现金流量净额', '期末现金及现金等价物余额']
            // },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                show: false,
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date
            },
            yAxis: {
                type: 'value'
            },
            series: stock_profitData
        };


        myChart_stock_profit.setOption(stock_profit)

        var mainContainer = document.getElementById('daykline');
        var resizeMainContainer = function () {
                mainContainer.style.width = window.innerWidth+'px';
                mainContainer.style.height = window.innerHeight*0.8+'px';
            };
            //设置div容器高宽
            resizeMainContainer();
            // 初始化图表
            var mainChart = echarts.init(mainContainer);
            $(window).on('resize',function(){//
                //屏幕大小自适应，重置容器高宽
                resizeMainContainer();
                mainChart.resize();
            });
            var data = splitData(dayData);
            var option={
                backgroundColor: '#fff',
                animation: false,
                legend: {
                    // bottom: 10,
                    // left: 'center',
                    x:'top',
                    y:'center',
                    top:10,
                    data: ['日线', 'MA5', 'MA10', 'MA20', 'MA30']
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    backgroundColor: 'rgba(245, 245, 245, 0.8)',
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    textStyle: {
                        color: '#000'
                    },
                    position: function (pos, params, el, elRect, size) {
                        var obj = {top: 10};
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    }
                    // extraCssText: 'width: 170px'
                },
                axisPointer: {
                    link: {xAxisIndex: 'all'},
                    label: {
                        backgroundColor: '#777'
                    }
                },
                toolbox: {
                    show: false,
                    feature: {
                        dataZoom: {
                            yAxisIndex: false
                        },
                        brush: {
                            type: ['lineX', 'clear']
                        }
                    }
                },
                brush: {
                    xAxisIndex: 'all',
                    brushLink: 'all',
                    outOfBrush: {
                        colorAlpha: 0.1
                    }
                },
                visualMap: {
                    show: false,
                    seriesIndex: 5,
                    dimension: 2,
                    pieces: [{
                        value: 1,
                        color: downColor
                    }, {
                        value: -1,
                        color: upColor
                    }]
                },
                grid: [
                    {
                        left: '10%',
                        right: '8%',
                        height: '50%'
                    },
                    {
                        left: '10%',
                        right: '8%',
                        top: '63%',
                        height: '16%'
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        data: data.categoryData,
                        scale: true,
                        boundaryGap: false,
                        axisLine: {onZero: false},
                        splitLine: {show: false},
                        splitNumber: 20,
                        min: 'dataMin',
                        max: 'dataMax',
                        axisPointer: {
                            z: 100
                        }
                    },
                    {
                        type: 'category',
                        gridIndex: 1,
                        data: data.categoryData,
                        scale: true,
                        boundaryGap: false,
                        axisLine: {onZero: false},
                        axisTick: {show: false},
                        splitLine: {show: false},
                        axisLabel: {show: false},
                        splitNumber: 20,
                        min: 'dataMin',
                        max: 'dataMax'
                    }
                ],
                yAxis: [
                    {
                        scale: true,
                        splitArea: {
                            show: true
                        }
                    },
                    {
                        scale: true,
                        gridIndex: 1,
                        splitNumber: 2,
                        axisLabel: {show: false},
                        axisLine: {show: false},
                        axisTick: {show: false},
                        splitLine: {show: false}
                    }
                ],
                dataZoom: [
                    {
                        type: 'inside',
                        xAxisIndex: [0, 1],
                        start: 1,
                        end: 100
                    },
                    {
                        show: true,
                        xAxisIndex: [0, 1],
                        type: 'slider',
                        top: '85%',
                        start: 98,
                        end: 100
                    }
                ],
                series: [
                    {
                        name: '日线',
                        type: 'candlestick',
                        data: data.values,
                        itemStyle: {
                            color: upColor,
                            color0: downColor,
                            borderColor: null,
                            borderColor0: null
                        },
                        tooltip: {
                            formatter: function (param) {
                                param = param[0];
                                return [
                                    'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                                    'Open: ' + param.data[0] + '<br/>',
                                    'Close: ' + param.data[1] + '<br/>',
                                    'Lowest: ' + param.data[2] + '<br/>',
                                    'Highest: ' + param.data[3] + '<br/>'
                                ].join('');
                            }
                        }
                    },
                    {
                        name: 'MA5',
                        type: 'line',
                        data: calculateMA(5, data),
                        smooth: true,
                        lineStyle: {
                            opacity: 0.5
                        }
                    },
                    {
                        name: 'MA10',
                        type: 'line',
                        data: calculateMA(10, data),
                        smooth: true,
                        lineStyle: {
                            opacity: 0.5
                        }
                    },
                    {
                        name: 'MA20',
                        type: 'line',
                        data: calculateMA(20, data),
                        smooth: true,
                        lineStyle: {
                            opacity: 0.5
                        }
                    },
                    {
                        name: 'MA30',
                        type: 'line',
                        data: calculateMA(30, data),
                        smooth: true,
                        lineStyle: {
                            opacity: 0.5
                        }
                    },
                    {
                        name: 'Volume',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: data.volumes
                    }
                ]
            }
        
    
            // 使用刚指定的配置项和数据显示图表。
            mainChart.setOption(option,true);


        
    }
})
