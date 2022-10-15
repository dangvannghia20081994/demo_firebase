import Login from "../pages/Login"

import RoomLayout from "../layouts/RoomLayout"
import Conversation from "../layouts/RoomLayout/components/Conversation"
import Index from "../layouts/RoomLayout/components/Index"

const publicRoutes = [
    { path: '/', component: Login }
]

const privateRoutes = [
    { path: 'room', component: Index, layout: RoomLayout },
    { path: 'room/:id', component: Conversation, layout: RoomLayout }
]

export { publicRoutes, privateRoutes }