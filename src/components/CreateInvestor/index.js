import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql} from 'react-apollo'
import Modal from 'react-modal'
import modalStyle from '../../constants/modalStyle'
import gql from 'graphql-tag'

class CreateInvestor extends React.Component {
    state = {
        investor: '',
        location: '',
        interest: 'low', 
        stage: 'research',
        contact: ''
    }

    componentWillMount() {
      Modal.setAppElement('body');
    }

    render () {
        return (
            <Modal
              isOpen
              contentLabel='Create Investor'
              style={modalStyle}
              onRequestClose={this.props.history.goBack}
            >
              <div className='pa4 flex justify-center bg-white'>
                <div style={{maxWidth: 400}}>
                  <h1>Search Investor</h1>
                  <div>
                    Org: 
                    <input
                      className='w-100 pa3 mv2'
                      value={this.state.company}
                      placeholder='Company'
                      onChange={e => this.setState({company: e.target.value})}
                      autoFocus
                    />
                  </div>
                  <div>
                    Location: 
                    <input
                      className='w-100 pa3 mv2'
                      value={this.state.location}
                      placeholder='Location'
                      onChange={e => this.setState({location: e.target.value})}
                    />
                  </div>
                  <div>
                    Contact: 
                    <input
                      className='w-100 pa3 mv2'
                      value={this.state.contact}
                      placeholder='Contact'
                      onChange={e => this.setState({contact: e.target.value})}
                    />
                  </div>
                  <div>
                    Interest Level: 
                    <select className="w-100 pa3 mv2" value={this.state.interest} 
                            onChange={e => this.setState({interest: e.target.value})}>
                      <option value="low">Low</option>
                      <option value="med">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    Stage: 
                    <select className="w-100 pa3 mv2" value={this.state.stage} 
                      onChange={e => this.setState({stage: e.target.value})}>
                      <option value="research">Research</option>
                      <option value="initial">Initial Contact</option>
                      <option value="meeting">Meeting Scheduled</option>
                      <option value="closed">Closed</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="funded">Funded</option>
                    </select>
                  </div>
                  <button
                    className='pa3 bg-black-10 bn dim ttu pointer'
                    onClick={this.handlePost}
                    disabled={
                      !this.state.location ||
                      !this.state.company ||
                      !this.state.contact ||
                      !this.state.interest ||
                      !this.state.stage
                    }
                  >
                    Create Investor
                  </button>
                  {
                    (!this.state.location ||
                    !this.state.company ||
                    !this.state.contact ||
                    !this.state.interest ||
                    !this.state.stage) &&
                    <div style={{color: 'red'}}>
                      Please complete all fields
                    </div>
                  }                
            </div>
              </div>
            </Modal>
          )
    }
    
    handlePost = async () => {
        const {location, company, contact, interest, stage} = this.state
        await this.props.createPostMutation({variables: {company, location, contact, interest, stage}})
        this.props.history.replace('/')
      }
}

const CREATE_POST_MUTATION = gql`
  mutation CreateInvestorMutation($location: String!, $company: String!, $contact: String!, $interest: String!, $stage: String!) {
    create_investor(location: $location, company: $company, contact: $contact, interest: $interest, stage: $stage) {
      id
      company
      location
      contact
      interest
      stage
      meetings {
        id
        time
      }
    }
  }
`
const CreatePageWithMutation = graphql(CREATE_POST_MUTATION, {name: 'createPostMutation'})(CreateInvestor)
export default withRouter(CreatePageWithMutation)
