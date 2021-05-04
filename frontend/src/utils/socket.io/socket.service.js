import io from 'socket.io-client'

const socket = io(process.env.socketUrl)

export default socket
