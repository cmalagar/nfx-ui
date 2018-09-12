import React from 'react'
import { Link } from 'react-router-dom'
import Investor from '../Investor'
import { graphql } from 'react-apollo'
// import GetInvestorsQuery from '../../queries/GetInvestorsQuery'
import gql from 'graphql-tag'
import './styles.css'

class Investors extends React.Component {
  render() {
      if (this.props.investors.loading) {
        return (
          <div className='flex w-100 h-100 items-center justify-center pt7'>
            <div>
              Loading
              (from {process.env.REACT_APP_GRAPHQL_ENDPOINT})
            </div>
          </div>
        )
      }
  
      let blurClass = ''
      if (this.props.location.pathname !== '/') {
        blurClass = ' blur'
      }
  
      return (
        <div className={'' + blurClass}>
          <div className="main-title"> 
            <h1>Venture Capital Tracking App</h1>
            <Link to='/create'
                className='ma3 box flex flex-column ttu fw6 f20 black-30 no-underline'>
                Search Investors
            </Link>
          </div>

          <div className="investors">
            <div className='flex-container' style={{maxWidth: 1150}}>
              {this.props.investors.investors && this.props.investors.investors.map(investor => (
                <Investor
                  key={investor.id}
                  investor={investor}
                  refresh={() => this.props.investors.refetch()}
                />
              ))}
            </div>
          </div>
          {this.props.children}
        </div>
      )
    }
}

export let GetInvestorsQuery = gql`
    query investors {
        investors {
            id
            company
            location
            contact
            stage
            interest
            meetings {
                id
                time
            }
        }
    }
`

const GetInvestorsWithQuery = graphql(GetInvestorsQuery, {
    name: 'investors', 
    options: { 
      fetchPolicy: 'cache-and-network'
    }
})(Investors)

export default GetInvestorsWithQuery