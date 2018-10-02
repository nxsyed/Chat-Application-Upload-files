import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatEngineCore from 'chat-engine';
import muter from 'chat-engine-muter';
import Message from './Messages';
import UserList from './UserList';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';

const now = new Date().getTime();
const username = ['user', now].join('-');


const ChatClient = ChatEngineCore.create({
    publishKey: 'pub-c-3f89be1a-7cca-4307-8884-80b5b4855b23',
    subscribeKey: 'sub-c-83c785b0-b219-11e8-acd6-a622109c830d'
}, {
    globalChannel: 'chatting'
});

ChatClient.connect(username, {
  signedOnTime: now
}, 'auth-key');

const styles = {
  card: {
    maxWidth: 345
  },
  openCard:{
    maxWidth: 200
  },
  openMedia: {
    height: 80,
  },
  media: {
    objectFit: 'cover',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

class App extends Component {

  constructor(props) {
    super(props);
    this.chat = new ChatClient.Chat('muter');
    this.chat.plugin(muter());

    this.state = {
      messages: [],
      chatInput: '' 
    };
  }

  sendChat = () => {
    if (this.state.chatInput) {
        this.chat.emit('message', {
            text: this.state.chatInput,
            uuid: username
        });
        this.setState({ chatInput: '' })
    }

  }

  setChatInput = (event) => {
    this.setState({ chatInput: event.target.value })
  }

  componentDidMount() {
    this.chat.on('message', (payload) => {
        const { uuid, text } = payload.data;

        let messages = this.state.messages;
        if(!this.chat.muter.isMuted(uuid)){
          messages.push(
            <Message key={ this.state.messages.length } uuid={ uuid } text={ text }/>
          );
          this.setState({
              messages: messages
          });
        }
        
    });
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        this.sendChat();
    }
  }

  render(){
    const { classes } = this.props;
    return(
      <Card className={classes.card} >
          <CardContent>
            <UserList users={this.chat.users} callback={(uuid, muteState) => {
              if(muteState){
                this.chat.muter.mute(uuid);
              } else {
                this.chat.muter.unmute(uuid);
              }
            }}> 
            </UserList>
            <Typography gutterBottom variant="headline" component="h2">
              Messages
            </Typography>
              <div className={classes.root}>
                <List component="nav">
                  <ListItem>
                  <Typography component="div">
                    { this.state.messages }
                  </Typography>
                  </ListItem>
                </List>
              </div>
          </CardContent>
          <CardActions>
            <Input
              placeholder="Enter a message"
              value={this.state.chatInput}
              className={classes.input}
              onKeyDown={this.handleKeyPress}
              onChange={this.setChatInput}
              inputProps={{
                'aria-label': 'Description',
              }}
            />
            <Button size="small" color="primary" link="https://github.com/nxsyed/Chat-Engine-OpenGraph">
              Github
            </Button>
            <Button size="small" color="primary">
              Article
            </Button>
          </CardActions>
        </Card>
      );
    }
  }

const ChatComponent = withStyles(styles)(App);

ChatClient.on('$.ready', () => {
    ReactDOM.render(<ChatComponent />, document.getElementById('root'));
});
