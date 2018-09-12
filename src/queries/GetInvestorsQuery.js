import gql from 'graphql-tag'

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