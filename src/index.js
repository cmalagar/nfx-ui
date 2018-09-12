import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import 'tachyons'
import './index.css'

const networkInterface = createNetworkInterface({
    uri: 'http://localhost:3000/graphql',
})

const client = new ApolloClient({
    networkInterface,
    cache: new InMemoryCache()
})

ReactDOM.render((
    <ApolloProvider client={client}>
        <BrowserRouter>
            <div className="App">
                <App />
            </div>
        </BrowserRouter>
    </ApolloProvider>
    ),
    document.getElementById('root')
)

registerServiceWorker();