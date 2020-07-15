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

  fetchExtrinsics = params => {
    return this.cancelableFetch('/extrinsics', params)
  }

  fetchEvents = params => {
    return this.cancelableFetch('/events', params)
  }
}

export default new Api(process.env.REACT_APP_SERVER)
