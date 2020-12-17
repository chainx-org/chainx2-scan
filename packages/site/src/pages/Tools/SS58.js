import React, { useState, useEffect } from 'react'
import { Input, Button } from 'antd'
import { createFromIconfontCN } from '@ant-design/icons'
import xx from '../../assets/0x.svg'
import hash from '../../assets/hash.svg'
import search from '../../assets/scan.webp'
import { decodeAddress, encodeAddress } from '../../shared'

const { hexToU8a, isHex } = require('@polkadot/util')
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2270885_r3rscelmmuh.js'
})
const { TextArea } = Input
export default function SS58() {
  let [show, Setshow] = useState(false)
  let [searchValue, SetsearchValue] = useState('')
  let [address, Setaddress] = useState('')
  let [publicKey, SetpublicKey] = useState('')
  let [notFound, SetnotFound] = useState(false)
  const width = document.documentElement.clientWidth
  const mobile = width < 1024
  const handleSearchValue = event => {
    SetsearchValue(event.target.value)
  }
  const handleTransform = () => {
    if (searchValue.includes('0x')) {
      Setaddress(encodeAddress(searchValue))
      SetpublicKey(searchValue)
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
        Setaddress(searchValue)
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
              <TextArea
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
                fontSize: '12px'
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
                  <div style={{ fontWeight: 'bold' }}>Chainx (Prefix: 44)</div>
                  <div>{address}</div>
                </div>
              </li>
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
              <TextArea
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
                fontSize: '12px'
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
                  <img src={hash} style={{ width: '32px', height: '32px' }} />
                </span>
                <div style={{ marginLeft: '16px' }}>
                  <div style={{ fontWeight: 'bold' }}>Chainx (Prefix: 44)</div>
                  <div>{address}</div>
                </div>
              </li>
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
