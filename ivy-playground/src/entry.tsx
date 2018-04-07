// external imports
import createHistory from "history/createBrowserHistory"
import React from "react"
import DocumentTitle from "react-document-title"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { ConnectedRouter, routerMiddleware } from "react-router-redux"
import { applyMiddleware, compose, createStore } from "redux"
import persistState from "redux-localstorage"
import thunk from "redux-thunk"

// ivy imports
import app from "./app"
import templates from "./templates"

import LockedValue from "./contracts/components/lockedValue"
import Unlock from "./contracts/components/unlock"
import Lock from "./templates/components/lock"

// Import css
require("./static/playground.css")

interface ExtensionWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
}
const composeEnhancers =
  (window as ExtensionWindow).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const history = createHistory({ basename: "/bitcoin" })
const store = createStore(
  app.reducer,
  composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(history)),
    persistState()
  )
)

export const IvyProvider = () => (<Provider store={store}>
<DocumentTitle title="Ivy Playground for Bitcoin">
  <ConnectedRouter history={history}>
    <app.components.Root>
      <Switch>
        <Route exact path={"/unlock"} component={LockedValue} />
        <Route path={"/unlock/:contractId"} component={Unlock} />
        <Route path={"*"} component={Lock} />
      </Switch>
    </app.components.Root>
  </ConnectedRouter>
</DocumentTitle>
</Provider>)


const selected = templates.selectors.getSelectedTemplate(store.getState())
store.dispatch(templates.actions.loadTemplate(selected) as any)
render(
  <IvyProvider />,
  document.getElementById("root")
)
