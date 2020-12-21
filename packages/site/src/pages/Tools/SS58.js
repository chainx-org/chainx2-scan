import React, { useState, useEffect } from 'react'
import { Input, Button } from 'antd'
import { createFromIconfontCN } from '@ant-design/icons'
import xx from '../../assets/0x.svg'
import hash from '../../assets/hash.svg'
import search from '../../assets/scan.webp'
import { encodeAddress } from '@polkadot/keyring'
import { decodeAddress } from '../../shared'
import PrefixItem from './PrefixItem'
const { TextArea } = Input
const { hexToU8a, isHex } = require('@polkadot/util')
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2270885_r3rscelmmuh.js'
})
const style = {
  width: '566px',
  height: '90px',
  background: '#f8f9fa',
  marginTop: '40px',
  display: 'flex',
  alignItems: 'center'
}
const lastStyle = {
  width: '566px',
  height: '90px',
  background: '#f8f9fa',
  marginTop: '40px',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '40px'
}
export default function SS58() {
  let [show, Setshow] = useState(false)
  let [searchValue, SetsearchValue] = useState('')
  let [address, Setaddress] = useState('')
  let [polkdotAddress, SetPolkdotAddress] = useState('')
  let [KusamaAddress, SetKusamaAddress] = useState('')
  let [DarwiniaAddress, SetDarwiniaAddress] = useState('')
  let [CrabAddress, SetCrabAddress] = useState('')
  let [EdgewareAddress, SetEdgewareAddress] = useState('')
  let [CentrifugeAddress, SetCentrifugeAddress] = useState('')
  let [BifrostAddress, SetBifrostAddress] = useState('')
  let [PlasmAddress, SetPlasmAddress] = useState('')
  let [StafiAddress, SetStafiAddress] = useState('')
  let [KulupuAddress, SetKulupuAddress] = useState('')
  let [KaruraAddress, SetKaruraAddress] = useState('')
  let [RobonomicsAddress, SetRobonomicsAddress] = useState('')
  let [PolymathAddress, SetPolymathAddress] = useState('')
  let [AcalaAddress, SetAcalaAddress] = useState('')
  let [ReynoldsAddress, SetReynoldsAddress] = useState('')
  let [publicKey, SetpublicKey] = useState('')
  let [notFound, SetnotFound] = useState(false)
  const width = document.documentElement.clientWidth
  const mobile = width < 1024
  const handleSearchValue = event => {
    SetsearchValue(event.target.value)
  }
  const handleTransform = () => {
    if (searchValue.includes('0x')) {
      Setaddress(encodeAddress(searchValue, 44))
      SetpublicKey(searchValue)
      SetPolkdotAddress(encodeAddress(searchValue, 0))
      SetKusamaAddress(encodeAddress(searchValue, 2))
      SetDarwiniaAddress(encodeAddress(searchValue, 18))
      SetCrabAddress(encodeAddress(searchValue, 42))
      SetEdgewareAddress(encodeAddress(searchValue, 7))
      SetCentrifugeAddress(encodeAddress(searchValue, 36))
      SetBifrostAddress(encodeAddress(searchValue, 6))
      SetPlasmAddress(encodeAddress(searchValue, 5))
      SetStafiAddress(encodeAddress(searchValue, 20))
      SetKulupuAddress(encodeAddress(searchValue, 16))
      SetKaruraAddress(encodeAddress(searchValue, 8))
      SetRobonomicsAddress(encodeAddress(searchValue, 32))
      SetPolymathAddress(encodeAddress(searchValue, 12))
      SetAcalaAddress(encodeAddress(searchValue, 10))
      SetReynoldsAddress(encodeAddress(searchValue, 9))
    } else {
      const isValidAddressPolkadotAddress = () => {
        try {
          encodeAddress(
            isHex(searchValue)
              ? hexToU8a(searchValue)
              : decodeAddress(searchValue)
          )

          return true
        } catch (error) {
          return false
        }
      }
      const isValid = isValidAddressPolkadotAddress()
      if (isValid) {
        SetpublicKey(decodeAddress(searchValue))
        Setaddress(encodeAddress(searchValue, 44))
        SetPolkdotAddress(encodeAddress(searchValue, 0))
        SetKusamaAddress(encodeAddress(searchValue, 2))
        SetDarwiniaAddress(encodeAddress(searchValue, 18))
        SetCrabAddress(encodeAddress(searchValue, 42))
        SetEdgewareAddress(encodeAddress(searchValue, 7))
        SetCentrifugeAddress(encodeAddress(searchValue, 36))
        SetBifrostAddress(encodeAddress(searchValue, 6))
        SetPlasmAddress(encodeAddress(searchValue, 5))
        SetStafiAddress(encodeAddress(searchValue, 20))
        SetKulupuAddress(encodeAddress(searchValue, 16))
        SetKaruraAddress(encodeAddress(searchValue, 8))
        SetRobonomicsAddress(encodeAddress(searchValue, 32))
        SetPolymathAddress(encodeAddress(searchValue, 12))
        SetAcalaAddress(encodeAddress(searchValue, 10))
        SetReynoldsAddress(encodeAddress(searchValue, 9))
      } else {
        SetnotFound(true)
        return
      }
    }
    Setshow(true)
    SetnotFound(false)
  }
  return mobile ? (
    <div
      style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}
    >
      <div>
        <div style={{ fontWeight: 'bold' }}>SS58账号转化</div>
        <div
          style={{
            width: '400px',
            height: '540px',
            background: 'white',
            textAlign: 'center',
            boxShadow: '0 2px 10px 0 rgba(0,0,0,.05)'
          }}
        >
          <div style={{ marginTop: '20px' }}>
            <div
              style={{
                position: 'absolute',
                marginTop: '50px',
                marginLeft: '40px'
              }}
            >
              {<div style={{ fontWeight: 'bold' }}>输入账号或公钥</div>}
              <Input
                value={searchValue}
                onChange={handleSearchValue}
                rows={2}
                style={{
                  marginTop: '15px',
                  width: '320px',
                  height: '74px',
                  resize: 'none',
                  color: '#606266',
                  boxShadow: '0 2px 10px 0 rgba(0,0,0,.05)'
                }}
              />
              {notFound ? (
                <div
                  style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}
                >
                  转换失败，未找到此账号或公钥
                </div>
              ) : null}
              <Button
                onClick={handleTransform}
                block
                style={{
                  marginTop: '220px',
                  width: '320px',
                  height: '40px',
                  background: '#3f3f3f',
                  color: 'white'
                }}
              >
                转换
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <MyIcon type="icon-Rightxiangyou32" style={{ marginTop: '30px' }} />
      </div>
      <div>
        <div
          style={{
            width: '400px',
            height: '540px',
            background: 'white',
            marginTop: '43px',
            boxShadow: '0 2px 10px 0 rgba(0,0,0,.05)'
          }}
        >
          {show ? (
            <ul
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                fontSize: '12px',
                overflowY: 'scroll',
                height: '540px'
              }}
            >
              <li
                style={{
                  width: '390px',
                  height: '90px',
                  background: '#f8f9fa',
                  marginTop: '40px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div style={{ marginLeft: '16px' }}>
                  <div style={{ fontWeight: 'bold' }}>Public Key</div>
                  <div style={{ wordBreak: 'break-all' }}>{publicKey}</div>
                </div>
              </li>
              <PrefixItem
                prefix={'Chainx (Prefix: 44)'}
                value={address}
                style={style}
              />
              <PrefixItem
                prefix={'Polkadot (Prefix: 0)'}
                value={polkdotAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Kusama (Prefix: 2)'}
                value={KusamaAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Darwinia (Prefix: 18)'}
                value={DarwiniaAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Crab (Prefix: 42)'}
                value={CrabAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Westend (Prefix: 42)'}
                value={CrabAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Edgeware (Prefix: 7)'}
                value={EdgewareAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Centrifuge (Prefix: 36)'}
                value={CentrifugeAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Mandala (Prefix: 42)'}
                value={CrabAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Phala (Prefix: 42)'}
                value={CrabAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Bifrost (Prefix: 6)'}
                value={BifrostAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Plasm (Prefix: 5)'}
                value={PlasmAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Stafi (Prefix: 20)'}
                value={StafiAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Kulupu (Prefix: 16)'}
                value={KulupuAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Crust (Prefix: 42)'}
                value={CrabAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Laminar (Prefix: 42)'}
                value={CrabAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Karura (Prefix: 8)'}
                value={KaruraAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Reynolds (Prefix: 9)'}
                value={ReynoldsAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Acala (Prefix: 10)'}
                value={AcalaAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Polymath (Prefix: 12)'}
                value={PolymathAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Robonomics (Prefix: 32)'}
                value={RobonomicsAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Substrate (Prefix: 42)'}
                value={CrabAddress}
                style={lastStyle}
              />
            </ul>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <img src={search} style={{ width: '290px' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div>
        <div style={{ fontWeight: 'bold' }}>SS58账号转化</div>
        <div
          style={{
            width: '400px',
            height: '540px',
            background: 'white',
            textAlign: 'center',
            boxShadow: '0 2px 10px 0 rgba(0,0,0,.05)'
          }}
        >
          <div style={{ marginTop: '20px' }}>
            <div
              style={{
                position: 'absolute',
                marginTop: '50px',
                marginLeft: '40px'
              }}
            >
              {<div style={{ fontWeight: 'bold' }}>输入账号或公钥</div>}
              <div>
                <TextArea
                  value={searchValue}
                  onChange={handleSearchValue}
                  rows={4}
                  style={{
                    marginTop: '15px',
                    width: '320px',
                    height: '74px',
                    resize: 'none',
                    color: '#606266',
                    boxShadow: '0 2px 10px 0 rgba(0,0,0,.05)'
                  }}
                />
              </div>
              {notFound ? (
                <div
                  style={{
                    color: 'red',
                    fontSize: '12px',
                    marginTop: '10px'
                  }}
                >
                  转换失败，未找到此账号或公钥
                </div>
              ) : null}
              <Button
                onClick={handleTransform}
                block
                style={{
                  marginTop: '220px',
                  width: '320px',
                  height: '40px',
                  background: '#3f3f3f',
                  color: 'white'
                }}
              >
                转换
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <MyIcon
          type="icon-Rightxiangyou32"
          style={{
            marginTop: '320px',
            marginLeft: '30px',
            marginRight: '30px'
          }}
        />
      </div>
      <div>
        <div
          style={{
            width: '700px',
            height: '540px',
            background: 'white',
            marginTop: '43px',
            boxShadow: '0 2px 10px 0 rgba(0,0,0,.05)'
          }}
        >
          {show ? (
            <ul
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                fontSize: '12px',
                height: '540px',
                overflowY: 'scroll'
              }}
            >
              <li
                style={{
                  width: '566px',
                  height: '90px',
                  background: '#f8f9fa',
                  marginTop: '40px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span style={{ marginLeft: '18px' }}>
                  <img src={xx} style={{ width: '32px', height: '32px' }} />
                </span>
                <div style={{ marginLeft: '16px' }}>
                  <div style={{ fontWeight: 'bold' }}>Public Key</div>
                  <div>{publicKey}</div>
                </div>
              </li>
              <PrefixItem
                prefix={'Chainx (Prefix: 44)'}
                value={address}
                style={style}
              />
              <PrefixItem
                prefix={'Polkadot (Prefix: 0)'}
                value={polkdotAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Kusama (Prefix: 2)'}
                value={KusamaAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Darwinia (Prefix: 18)'}
                value={DarwiniaAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Crab (Prefix: 42)'}
                value={CrabAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Westend (Prefix: 42)'}
                value={CrabAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Edgeware (Prefix: 7)'}
                value={EdgewareAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Centrifuge (Prefix: 36)'}
                value={CentrifugeAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Mandala (Prefix: 42)'}
                value={CrabAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Phala (Prefix: 42)'}
                value={CrabAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Bifrost (Prefix: 6)'}
                value={BifrostAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Plasm (Prefix: 5)'}
                value={PlasmAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Stafi (Prefix: 20)'}
                value={StafiAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Kulupu (Prefix: 16)'}
                value={KulupuAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Crust (Prefix: 42)'}
                value={CrabAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Laminar (Prefix: 42)'}
                value={CrabAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Karura (Prefix: 8)'}
                value={KaruraAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Reynolds (Prefix: 9)'}
                value={ReynoldsAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Acala (Prefix: 10)'}
                value={AcalaAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Polymath (Prefix: 12)'}
                value={PolymathAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Robonomics (Prefix: 32)'}
                value={RobonomicsAddress}
                style={style}
              />
              <PrefixItem
                prefix={'Substrate (Prefix: 42)'}
                value={CrabAddress}
                style={lastStyle}
              />
            </ul>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <img src={search} style={{ width: '290px' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
