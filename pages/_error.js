import React from 'react'
import Error from 'next/error'
import Router from 'next/router'

export default class Page extends React.Component {
  static async getInitialProps ({ res }) {
    // I only want to do the redirect is the return code is 502 or the message is "Unauthorized"
    if (res) {
      res.writeHead(302, {
        Location: '/',
      })
      res.end()
      res.finished = true
    } else {
      Router.replace('/')
    }
    return {}
  }

  render () {
    // I still want to return the regular error is I did not do the redirect.
    return <Error statusCode={404} />
  }
}
