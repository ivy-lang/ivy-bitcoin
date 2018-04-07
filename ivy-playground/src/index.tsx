import reducer from "./app/reducer"

import Root from "./app/components/root"
import LockedValue from "./contracts/components/lockedValue"
import Unlock from "./contracts/components/unlock"
import Lock from "./templates/components/lock"
import { loadTemplate } from "./templates/actions"

export { loadTemplate, reducer, LockedValue, Unlock, Lock, Root }
