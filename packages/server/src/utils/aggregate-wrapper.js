function aggregate(col, aggregations) {
  return new Promise((resolve, reject) => {
    col.aggregate(aggregations, (err, cursor) => {
      if (err) {
        reject(err)
      } else {
        cursor.toArray((err, docs) => {
          if (err) {
            reject(err)
          } else {
            resolve(docs)
          }
        })
      }
    })
  })
}

module.exports = {
  aggregate
}
