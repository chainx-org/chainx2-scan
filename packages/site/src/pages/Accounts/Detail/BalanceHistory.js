import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Spin, Button } from 'antd';
import $t from '../../../locale'
import { G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util} from 'bizcharts'
import {AccountbalanceSelector, fetchAccountBalance, fetchDeals} from "../../../store/reducers/accountSlice";
import {latestChainStatusSelector} from "../../../store/reducers/latestChainStatusSlice";
const BalanceHistory = ()=> {
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const dispatch = useDispatch()
    const { address } = useParams()
    let account = address
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        dispatch(fetchAccountBalance(account,setLoading,page,pageSize))
    },[setLoading,address,page,pageSize])
    const items = useSelector(AccountbalanceSelector) || {}

   let data = []
    if(loading){
        data = []
    }else{
        data = items.data
    }
    const cols = {
        balance: {
            min: 0,
            range:[0,0.93],
            alias:'PCX'
        },
        height: {
            range: [0, 0.9],
            alias:$t('block_height')
        }
    };
    return (
        <div>
            <div>
                <Spin spinning={loading} style={{position: 'absolute', top:'60%',left: '50%'}}/>
                {!loading ? <div style={{marginLeft:'70%'}}>
                    <Button onClick={()=> setPage(page + 1)} style={{marginRight:'20px'}}>下一周期</Button>
                    <Button onClick={()=> setPage(page - 1)}>上一周期</Button>
                </div> : null}
            <Chart height={400} data={data} scale={cols} forceFit>
                <Axis name="balance" title={{
                    position:'end',
                    offset:15,
                    textStyle: {
                        fontSize: '12',
                        textAlign: 'center',
                        fill: '#999',
                        fontWeight: 'bold',
                        rotate: 0
                    }
                }} />
                <Axis name="height"  title={{
                    position:'end',
                    offset:5.5,
                    textStyle: {
                        fontSize: '12',
                        textAlign: 'right',
                        fill: '#999',
                        fontWeight: 'bold',
                        rotate: 0
                    }
                }}/>
                <Tooltip
                    crosshairs={{
                        type: "y"
                    }}
                />
                <Geom type="line" position="height*balance" size={2}
                      color="#f6c94a"
                      tooltip={['height*balance',(height,balance)=>{
                          return {
                              name:'pcx', // 要显示的名字
                              value:balance,
                              title:height
                          }
                      }]} />
                <Geom
                    type="point"
                    position="height*balance"
                    color="#f6c94a"
                    size={4}
                    shape={"circle"}
                    style={{
                        stroke: "#fff",
                        lineWidth: 1
                    }}
                    tooltip={['height*balance',(height,balance)=>{
                        return {
                            name:'pcx', // 要显示的名字
                            value:balance,
                            title:height
                        }
                    }]}
                />
            </Chart>
            </div>
        </div>
    );
}

export default BalanceHistory