export function makeCancelable(promise) {
  let isCanceled = false
  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(val =>
        isCanceled ? reject(new Error({ isCanceled })) : resolve(val)
      )
      .catch(error =>
        isCanceled ? reject(new Error({ isCanceled })) : reject(error)
      )
  })

  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true
    }
  }
}

export * from './hooks'
