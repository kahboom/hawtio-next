import React, { createContext, useEffect, useReducer } from 'react'
import { connectService } from './connect-service'
import { Connections, ConnectionsAction, reducer } from './connections'

/**
 * Custom Reack hook for using connections and their reducer.
 */
export function useConnections() {
  const [connections, dispatch] = useReducer(reducer, connectService.loadConnections())

  useEffect(() => {
    connectService.saveConnections(connections)
  }, [connections])

  return { connections, dispatch }
}

export type ConnectContext = {
  connections: Connections
  dispatch: React.Dispatch<ConnectionsAction>
}

export const ConnectContext = createContext<ConnectContext>({ connections: {}, dispatch: () => ({}) })
