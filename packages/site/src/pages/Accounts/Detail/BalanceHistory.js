import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
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
const BalanceHistory = ()=> {
    const dispatch = useDispatch()
    const { address } = useParams()
    let account = address
    const [loading, setLoading] = useState(false)
    useEffect(()=>{
        dispatch(fetchAccountBalance(account, setLoading))
    },[setLoading])
    const { items = [], total } = useSelector(AccountbalanceSelector) || {}
    const data = [
        {
            year: "1991",
            value: 3
        },
        {
            year: "1992",
            value: 4
        },
        {
            year: "1993",
            value: 3.5
        },
        {
            year: "1994",
            value: 5
        },
        {
            year: "1995",
            value: 4.9
        },
        {
            year: "1996",
            value: 6
        },
        {
            year: "1997",
            value: 7
        },
        {
            year: "1998",
            value: 9
        },
        {
            year: "1999",
            value: 13
        }
    ];
    const cols = {
        value: {
            min: 0,
            range:[0,0.93],
            alias:'PCX'
        },
        year: {
            range: [0, 0.9],
            alias:$t('block_height')
        }
    };
    return (
        <div>
            <Chart height={400} data={data} scale={cols} forceFit>
                <Axis name="year" title={{
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
                <Axis name="value"  title={{
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
                <Geom type="line" position="year*value" size={2}
                      color="#f6c94a"
                      tooltip={['year*value',(year,value)=>{
                          return {
                              name:'pcx', // 要显示的名字
                              value:value,
                              title:year
                          }
                      }]} />
                <Geom
                    type="point"
                    position="year*value"
                    color="#f6c94a"
                    size={4}
                    shape={"circle"}
                    style={{
                        stroke: "#fff",
                        lineWidth: 1
                    }}
                    tooltip={['year*value',(year,value)=>{
                        return {
                            name:'pcx', // 要显示的名字
                            value:value,
                            title:year
                        }
                    }]}
                />
            </Chart>
        </div>
    );
}

export default BalanceHistory