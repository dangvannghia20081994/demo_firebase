import { moduleLoadManager as LoginPageModule } from "../pages/Login/components/moduleLoadManager"
import { moduleLoadManager as SidebarModule } from "../layouts/RoomLayout/components/Sidebar/components/moduleLoadManager"
import { moduleLoadManager as RoomLayoutModule } from "../layouts/RoomLayout/moduleLoadManager"

export const moduleLoadManager = {
    ...LoginPageModule,
    ...SidebarModule,
    ...RoomLayoutModule
}