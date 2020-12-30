import axios from 'axios';

function networkErr() {
  console.log('网络异常');
}

export default {
  get(...args) {
    return new Promise((resolve, reject) => {
      axios.get(...args).then(response => {
        if (response.data.state == -1) {
          networkErr()
          reject(response.data)
        } else {
          resolve(response)
        }
      }, err => {
        networkErr()
        reject(err)
      })
    })
  },
  post(...args) {
    return new Promise((resolve, reject) => {
      axios.post(...args).then(response => {
        if (response.data.state == -1) {
          networkErr()
          reject(response.data)
        } else {
          resolve(response)
        }
      }, err => {
        networkErr()
        reject(err)
      })
    })
  }
}