import { from, throwError, Observable } from 'rxjs'
import io from 'socket.io-client'
import { catchError, map } from 'rxjs/operators'
import { makeCancelable } from '../utils'
import hexAddPrefix from '@polkadot/util/hex/addPrefix'
import hexStripPrefix from '@polkadot/util/hex/stripPrefix'
import { getDefaultApi } from './utils'
import { decodeAddress } from '../shared'

const paramsKeyConvert = (str = '') =>
  str.replace(/[A-Z]/g, ([s]) => `_${s.toLowerCase()}`)
class Socket {
  socket = null
  subscribeNames = []
  eventNames = []
  handler = {}

  constructor() {
    this.socket = io(getDefaultApi())
    this.socket.connect()
    this.socket.on('connect', data => this.connectHandler())
    this.socket.on('connect_error', data => this.reconnect(data))
    this.socket.on('disconnect', data => this.reconnect(data))
    this.socket.on('error', data => this.reconnect(data))
  }

  connectHandler(subscribeName = '') {
    if (!subscribeName) {
      for (let _name of this.subscribeNames) {
        this.socket.emit('subscribe', _name)
      }
    } else {
      if (!(subscribeName in this.subscribeNames)) {
        this.subscribeNames.push(subscribeName)
      }
      this.socket.emit('subscribe', subscribeName)
    }
  }

  closeHandler(subscribeName = '') {
    if (!subscribeName) {
      for (let _name of this.subscribeNames) {
        this.socket.emit('unsubscribe', _name)
      }
    } else {
      this.socket.emit('unsubscribe', subscribeName)
    }
  }

  reconnect(e) {
    this.socket.close()
    setTimeout(() => {
      this.socket.connect()
    }, 3000)
  }
}

class Api {
  endpoint = null

  constructor(endpoint) {
    this.endpoint = endpoint
  }

  fetch = (path, params = {}, options) => {
    const url = new URL(path, this.endpoint)
    for (const key of Object.keys(params)) {
      url.searchParams.set(paramsKeyConvert(key), params[key])
    }

    return new Promise(async (resolve, reject) => {
      const resp = await window.fetch(url, options)
      if (resp.status !== 200) {
        resolve({
          error: {
            code: resp.status,
            url: path,
            message: 'api is not online'
          }
        })
      } else {
        const result = await resp.json()
        resolve({
          result
        })
      }
    })
  }

  cancelableFetch = (path, params = {}) => {
    return makeCancelable(this.fetch(path, params))
  }

  fetch$ = (path, params = {}, options = {}) => {
    return from(this.fetch(path, params, options)).pipe(
      map(({ result, error }) => {
        if (!error) {
          return result
        } else {
          throw error
        }
      }),
      catchError(error => {
        // @todo 全局的错误上报处理
        return throwError(error)
      })
    )
  }
  /**
   * 获取最新的链的状态
   */
  fetchChainStatus$ = () => {
    return this.createObservable('CHAIN_STATUS', 'chainStatus')
  }
  createObservable = (name, eventName) => {
    if (!this.socket) {
      this.socket = new Socket()
    }
    return new Observable(observer => {
      this.socket.connectHandler(name)
      this.socket.socket.on(eventName, data => {
        observer.next(data)
      })
      return () => {
        this.socket.socket.removeListener(eventName)
        this.socket.closeHandler(name)
      }
    })
  }
  /**
   * 获取区块列表
   */
  fetchBlocks$ = params => {
    return this.fetch$(`/blocks`, params)
  }

  fetchBlocks = params => {
    return this.cancelableFetch('/blocks', params)
  }

  fetchBlock = blockId => {
    return this.cancelableFetch(`/blocks/${blockId}`)
  }

  fetchExtrinsics = params => {
    return this.cancelableFetch('/extrinsics', params)
  }

  fetchExtrinsic = hash => {
    return this.cancelableFetch(`/extrinsics/${hash}`)
  }

  fetchEvents = params => {
    return this.cancelableFetch('/events', params)
  }
  fetchBlockEvents = params => {
    return this.cancelableFetch('/blockEvents', params)
  }
  fetchExtrinsicEvents = params => {
    return this.cancelableFetch('/extrinsicEvents', params)
  }
  fetchAccounts = params => {
    return this.cancelableFetch('/accounts', params)
  }

  fetchAccount = address => {
    return this.cancelableFetch(`/accounts/${address}`)
  }

  fetchTransfer = params => {
    return this.cancelableFetch(`/transfer`, params)
  }

  fetchAccountTransfers = (address, params) => {
    return this.cancelableFetch(`/accounts/${address}/transfers`, params)
  }

  fetchTransactoin = params => {
    return this.cancelableFetch(`/transaction`, params)
  }

  fetchNativeAssets = address => {
    return this.cancelableFetch(`/accounts/${address}/assets`)
  }
  fetchCrossAssets = address => {
    return this.cancelableFetch(`/accounts/${address}/crossassets`)
  }

  fetchEvent = eventId => {
    return this.cancelableFetch(`/events/${eventId}`)
  }

  fetchAccountNominations = params => {
    return this.cancelableFetch(`/nomination`, params)
  }

  /**
   *
   * 获取验证人列表
   *
   * */

  fetchIntentions$ = (params, options = {}) => {
    const { tabFilter = null } = options
    return this.fetch$(`/intentions`, params).pipe(
      map(result => {
        if (!tabFilter) {
          return result
        }
        switch (tabFilter) {
          case 'unsettled':
            result.items = result.items.filter(item => !item.isValidator)
            break
          case 'all':
            result.items = result.items.filter(item => item.isValidator)
            break
          default:
            result.items = result.items.filter(
              item => item.isTrustee.indexOf(tabFilter) >= 0
            )
            break
        }
        result.total = result.items.length
        result.items.sort((a, b) => {
          if (a.isTrustee.length && !b.isTrustee.length) {
            return -1
          } else if (!a.isTrustee.length && b.isTrustee.length) {
            return 1
          } else {
            return 0
          }
        })
        return result
      })
    )
  }
  /**
   * 搜索，返回一个对象
   */
  search = async (input = '') => {
    input = input.trim()
    if (input === '') {
      return { result: `/blocks/您的输入为空` }
    }
    if (
      isNaN(input) &&
      /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{48,}$/.test(
        input
      )
    ) {
      try {
        const address = input
        return {
          result: `/accounts/${address}`
        }
      } catch {}
    }
    if (!isNaN(input) && /^\d*$/.test(input)) {
      return {
        result: `/blocks/${input}`
      }
    }
    try {
      const { result: txResult, error: txError } = await this.fetch(
        `/tx/${hexStripPrefix(input)}`
      )
      if (txResult && !txError) {
        return {
          result: `/txs/${hexAddPrefix(input)}`
        }
      }
      const { result: blockResult, error: blockError } = await this.fetch(
        `/blocks/${hexAddPrefix(input)}`
      )

      if (blockResult && !blockError) {
        return {
          result: `/blocks/${hexAddPrefix(input)}`
        }
      }
      const { result: accountResult, error: accountError } = await this.fetch(
        `/account/${hexAddPrefix(input)}/detail`
      )
      if (accountResult && !accountError) {
        return {
          result: `/accounts/${hexAddPrefix(input)}`
        }
      }
      const { result: blockHash, error: blockHashError } = await this.fetch(
        `/extrinsics/${hexAddPrefix(input)}`
      )
      if (blockHash && !blockHashError) {
        return {
          result: `/extrinsics/${hexAddPrefix(input)}/detail`
        }
      }

      return {
        error: {
          message: '找不到对应的交易、区块或账号'
        }
      }
    } catch (e) {
      return {
        error: {
          message: '无效的值'
        }
      }
    }
  }
}

export default new Api(process.env.REACT_APP_SERVER)
