import {
  UPDATE_G2048
} from '../constants'
// import curl from '../util/curl';

export const updateG2048 = data => ({ type: UPDATE_G2048, data })
export const pullG2048 = data => dispatch => {
  dispatch({ type: UPDATE_G2048, data })
}
