import { UPDATE_G2048 } from '../constants'

const INITIAL_STATE = {
  isInit: false,
}

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_G2048:
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}
