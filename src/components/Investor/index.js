import React from 'react'
import { Link } from 'react-router-dom'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router-dom'
import './styles.css'
import EllipsisText  from 'react-ellipsis-text';
import DateTimePicker from 'react-datetime-picker'

class Investor extends React.Component {
  state = {
    id: this.props.investor.id,
    company: this.props.investor.company,
    location: this.props.investor.location,
    interest: this.props.investor.interest, 
    stage: this.props.investor.stage,
    contact: this.props.investor.contact,
    meetingDate: this.props.investor.meetings[0]
  }
  
  handleEditInterest = async (event) => {
    this.state.interest = event.target.value
    const {id, company, location, contact, interest, stage} = this.state
    await this.props.editInvestorMutation({variables: {id, company, location, contact, interest, stage}})
    this.props.history.replace('/')
  }

  handleEditMeetingTime = async (event) => {
    const meeting_id = this.state.meetingDate.id
    const investor_id = this.state.meetingDate.investor_id
    this.state.meetingDate = {id: meeting_id, time: event.toString(), investor_id: investor_id}
    const time = this.state.meetingDate.time
    await this.props.editMeetingMutation({variables: {meeting_id, time}})
    this.props.history.replace('/')
  }

  handleEditStage = async (event) => {
    this.state.stage = event.target.value
    const {id, company, location, contact, interest, stage} = this.state
    await this.props.editInvestorMutation({variables: {id, company, location, contact, interest, stage}})
    this.props.history.replace('/')
  }

  render() {
    return (
      <div key={this.props.investor.id}>
        <div className="investor">
          <div>Investor ID: {this.state.id}</div>
          <div>
            Company: <EllipsisText text={this.state.company || 'n/a'} length={20} />
          </div>
          <div>Location: {this.state.location || 'n/a'}</div>
          <div>Stage: 
            <select value={this.state.stage || 'research'} 
                    onChange={this.handleEditStage}>
              <option value="research">Research</option>
              <option value="initial">Initial Contact</option>
              <option value="meeting">Meeting Scheduled</option>
              <option value="closed">Closed</option>
              <option value="negotiation">Negotiation</option>
              <option value="funded">Funded</option>
            </select>
          </div>
          {
            this.state.stage &&
            this.state.stage === 'meeting' &&
            this.state.meetingDate &&
            this.state.meetingDate.time &&
            <div>
              Meeting: <DateTimePicker onChange={this.handleEditMeetingTime} value={new Date(this.state.meetingDate.time)}/>
            </div>
          }
          <div style={{color: 'red'}}>
            {
              this.state.stage &&
              this.state.stage === 'meeting' &&
              (!this.state.meetingDate ||
              !this.state.meetingDate.time &&
              this.state.meetingDate.time.length === 0) ?
              'Please schedule a meeting time' : 
              ''
            }
          </div>
          <div>Interest Level: 
            <select value={this.state.interest || 'low'} 
                    onChange={this.handleEditInterest}>
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>Contact: {this.state.contact || 'n/a'}</div>
          <div>
            <Link to={{
                pathname: '/edit_investor',
                state: { investor: this.props.investor }
              }}
                className='ma3 br2 flex flex-column ttu fw6 f20 black-30 no-underline'>
                More
            </Link>
          </div>
        </div>
      </div>
    )
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

const EDIT_MEETING_MUTATION = gql`
  mutation EditMeetingMutation($meeting_id: ID!, $time: String!) {
    edit_meeting (id: $meeting_id, time: $time) {
      id
      time
      investor_id
    }
  }
`

const InvestorWithMutation = compose(
  graphql(EDIT_INVESTOR_MUTATION, {name: 'editInvestorMutation'}),
  graphql(EDIT_MEETING_MUTATION, {name: 'editMeetingMutation'})
)(Investor)
export default withRouter(InvestorWithMutation)
