import React, {useState, useEffect} from 'react'
import { Input, Button } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons'
import xx from '../../assets/0x.svg'
import hash from '../../assets/hash.svg'
import search from '../../assets/scan.webp'
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2270885_r3rscelmmuh.js',
})
const { TextArea } = Input;
export default function SS58() {
    let [show,Setshow] = useState(false)
    return (
        <div style={{display:'flex'}}>
            <div>
                <div style={{fontWeight:'bold'}}>
                    SS58账号转化
                </div>
                <div style={{width:'400px',height:'540px',background:'white',textAlign:'center',boxShadow:'0 2px 10px 0 rgba(0,0,0,.05)'}}>
                    <div style={{marginTop:'20px'}}>
                        <div style={{position:'absolute',marginTop:'50px',marginLeft:'40px'}}>
                            <div style={{fontWeight:'bold'}}>输入账号或公钥</div>
                            <TextArea rows={2} style={{marginTop:'15px',width:'320px', height:'74px', resize:'none',color:'#606266',boxShadow:'0 2px 10px 0 rgba(0,0,0,.05)'}}/>
                            <Button onClick={()=> {Setshow(true)}} block style={{marginTop:'220px',width:'320px',height:'40px',background:'#3f3f3f',color:'white'}}>转换</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <MyIcon type="icon-Rightxiangyou32" style={{marginTop:'320px',marginLeft:'30px',marginRight:'30px'}}/>
            </div>
            <div>
                <div style={{width:'700px',height:'540px',background:'white',marginTop:'43px',boxShadow:'0 2px 10px 0 rgba(0,0,0,.05)'}}>
                    {show ? <ul style={{display:'flex',flexWrap:'wrap',justifyContent:'center',fontSize:'12px'}}>
                        <li style={{width:'566px',height:'90px',background:'#f8f9fa',marginTop:'40px',display:'flex',alignItems:'center'}}>
                            <span style={{marginLeft:'18px'}}>
                                <img src={xx} style={{width:'32px',height:'32px'}}/>
                            </span>
                            <div style={{marginLeft:'16px'}}>
                                <div style={{fontWeight:'bold'}}>Public Key</div>
                                <div>0x725fe0d02f6bf5fe379b4b055298fa36be5ced6fbd8b57311abafef86b8d894b</div>
                            </div>
                        </li>
                        <li style={{width:'566px',height:'90px',background:'#f8f9fa',marginTop:'40px',display:'flex',alignItems:'center'}}>
                            <span style={{marginLeft:'18px'}}>
                                <img src={hash} style={{width:'32px',height:'32px'}}/>
                            </span>
                            <div style={{marginLeft:'16px'}}>
                                <div style={{fontWeight:'bold'}}>Chainx (Prefix: 44)</div>
                                <div>0x725fe0d02f6bf5fe379b4b055298fa36be5ced6fbd8b57311abafef86b8d894b</div>
                            </div>
                        </li>
                    </ul> : <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}><img src={search} style={{width:'290px'}}/></div>}
                </div>
            </div>
        </div>
    )
}