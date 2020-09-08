import { from, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { makeCancelable } from '../utils'

const paramsKeyConvert = (str = '') =>
  str.replace(/[A-Z]/g, ([s]) => `_${s.toLowerCase()}`)

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

  fetchAccounts = params => {
    return this.cancelableFetch('/accounts', params)
  }

  fetchAccount = address => {
    return this.cancelableFetch(`/accounts/${address}`)
  }

  fetchTransfer = params => {
    return this.cancelableFetch(`/transfer`, params)
  }

  fetchTransactoin = params => {
    return this.cancelableFetch(`/transaction`, params)
  }

  fetchNativeAssets = address => {
    return this.cancelableFetch(`/accounts/${address}/assets`)
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
}

export default new Api(process.env.REACT_APP_SERVER)
