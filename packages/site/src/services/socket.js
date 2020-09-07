import io from 'socket.io-client'
import { store } from '../index'
import { setLatestBlocks } from '../store/reducers/latestBlockSlice'
import { setLatestExtrinsics } from '../store/reducers/latestExtrinsicSlice'



const socket = io(process.env.REACT_APP_SERVER)
socket.connect()
socket.on('connect', () => {
  socket.emit('subscribe', 'LATEST_BLOCKS_ROOM')
  socket.emit('subscribe', 'LATEST_EXTRINSICS_ROOM')
  socket.on('latestBlocks', data => {
    store.dispatch(setLatestBlocks(data))
  })
  socket.on('latestExtrinsics', data => {
    store.dispatch(setLatestExtrinsics(data))
  })
})
