import { ControlStore } from './controlStore'
import { EntryStore } from './entryStore'
import { UiStore } from './uiStore'

export interface StoreProps {  // TODO: Making it optional is bad i guess..
    entryStore?: EntryStore
    controlStore?: ControlStore
    uiStore?: UiStore
}

// Must be the same as listed StoreProps props. Cannot be initalized as it is not
export const injectClause = ['entryStore', 'controlStore', 'uiStore']