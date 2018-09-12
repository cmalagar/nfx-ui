import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose, graphql } from 'react-apollo'
import Modal from 'react-modal'
import modalStyle from '../../constants/modalStyle'
import gql from 'graphql-tag'
import DateTimePicker from 'react-datetime-picker'

class EditInvestor extends React.Component {
  state = {
    id: this.props.location.state.investor.id,
    company: this.props.location.state.investor.company,
    location: this.props.location.state.investor.location,
    interest: this.props.location.state.investor.interest, 
    stage: this.props.location.state.investor.stage,
    contact: this.props.location.state.investor.contact,
    meetingTime: this.props.location.state.investor.meetings &&
                   this.props.location.state.investor.meetings[0] &&
                   this.props.location.state.investor.meetings[0].time ?
                 this.props.location.state.investor.meetings[0].time :
                 '',
    notes: ''
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  render () {
      return (
          <Modal
            isOpen
            contentLabel='Edit Investor'
            style={modalStyle}
            onRequestClose={this.props.history.goBack}
          >
            <div className='pa4 flex justify-center bg-white'>
              <div style={{maxWidth: 400}} className=''>
                <h1>Investor #{this.props.location.state.investor.id}: {this.state.company}</h1>
                Org: <input
                  className='w-100 pa3 mv2'
                  value={this.state.company}
                  placeholder='Company'
                  onChange={e => this.setState({company: e.target.value})}
                  autoFocus
                />
                Location: <input
                  className='w-100 pa3 mv2'
                  value={this.state.location}
                  placeholder='Location'
                  onChange={e => this.setState({location: e.target.value})}
                />
                Contact: <input
                  className='w-100 pa3 mv2'
                  value={this.state.contact}
                  placeholder='Contact'
                  onChange={e => this.setState({contact: e.target.value})}
                />
                <div>
                  Interest Level: 
                  <select className="w-100 pa3 mv2" value={this.state.interest || 'low'} 
                          onChange={e => this.setState({interest: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="med">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  Stage: 
                  <select className="w-100 pa3 mv2" value={this.state.stage || 'research'} 
                    onChange={e => this.setState({stage: e.target.value})}>
                    <option value="research">Research</option>
                    <option value="initial">Initial Contact</option>
                    <option value="meeting">Meeting Scheduled</option>
                    <option value="closed">Closed</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="funded">Funded</option>
                  </select>
                </div>
                <div>
                  Meeting:  
                  <DateTimePicker disabled={
                                    !this.state.stage ||
                                    this.state.stage !== 'meeting'
                                  } 
                                  onChange={e => this.setState({meetingTime: e.toString()})}
                                  value={this.state.meetingTime ?
                                         new Date(this.state.meetingTime) :
                                         ''
                                        } />
                </div>
                <div style={{color: 'red'}}>
                  {this.state.stage === 'meeting' && (!this.state.meetingTime || this.state.meetingTime.length === 0) ?
                    'Please schedule a meeting time' :
                    ''}
                </div>
                <div>
                  Notes:
                <input className='w-100 pa3 mv2'
                    value={this.state.notes}
                    placeholder="Fill in space..."
                    onChange={e => this.setState({notes: e.target.value})}/>
                </div>
                <div>
                  <button onClick={this.handleEdit}>
                    Edit Investor
                  </button>
                  <button onClick={this.handleDelete}>
                    Delete Investor
                  </button>
                </div>
              </div>
            </div>
        </Modal>
      )
  }
  
  handleEdit = async () => {
    // edit investor
    const {id, location, company, contact, interest, stage} = this.state
    await this.props.editInvestorMutation({variables: {id, company, location, contact, interest, stage}})
    
    // edit meeting
    if (this.props.location.state.investor.meetings !== undefined && this.props.location.state.investor.meetings.length > 0) {
      let meetings = []
      meetings[0] = {
        id: this.props.location.state.investor.meetings[0].id, 
        time: this.state.meetingTime,
        investor_id: this.state.id
      }
      const meeting_id = meetings[0].id
      const time = this.state.meetingTime

      await this.props.editMeetingMutation({variables: {meeting_id, time}})
    } else if (this.state.meetingTime.length > 0) {
      const investor_id = this.state.id
      const time = this.state.meetingTime

      await this.props.createMeetingMutation({variables: {investor_id, time}})
    }

    // return
    this.props.history.replace('/')
  }

  handleDelete = async() => {
    const id = this.props.location.state.investor.id
    await this.props.deleteInvestorMutation({variables: {id}})
    this.props.history.replace('/')
  }
}

const EDIT_INVESTOR_MUTATION = gql`
  mutation EditInvestorMutation($id: ID!, $location: String!, $company: String!, $contact: String!, $interest: String!, $stage: String!) {
    edit_investor (id: $id, location: $location, company: $company, contact: $contact, interest: $interest, stage: $stage) {
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

const CREATE_MEETING_MUTATION = gql`
  mutation CreateMeetingMutation($investor_id: ID!) {
    create_meeting(investor_id: $investor_id) {
      id
      time
      investor_id
    }
  } 
`

const EDIT_MEETING_MUTATION = gql`
  mutation EditMeetingMutation($meeting_id: ID!, $time: String!) {
    edit_meeting (id: $meeting_id, time: $time) {
      id
      time
      investor_id
    }
  }
`

const DELETE_INVESTOR_MUTATION = gql`
  mutation DeleteInvestorMutation($id: ID!) {
    delete_investor(id: $id) {
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

const EditInvestorWithMutations = compose(
  graphql(EDIT_INVESTOR_MUTATION, {name: 'editInvestorMutation'}),
  graphql(DELETE_INVESTOR_MUTATION, {name: 'deleteInvestorMutation'}),
  graphql(EDIT_MEETING_MUTATION, {name: 'editMeetingMutation'}),
  graphql(CREATE_MEETING_MUTATION, {name: 'createMeetingMutation'})
)(EditInvestor)

export default withRouter(EditInvestorWithMutations)
