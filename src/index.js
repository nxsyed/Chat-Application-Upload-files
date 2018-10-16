import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatEngineCore from 'chat-engine';
import uploadcare from 'chat-engine-uploadcare';
import Uploadcare from 'uploadcare-widget';
import Message from './Messages';

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
    maxWidth: 545
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
    this.chat.plugin(uploadcare());

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
    console.log(Uploadcare, uploadcare);
    const widget = Uploadcare.Widget('[role=uploadcare-uploader]');
    this.chat.uploadcare.bind(widget);

    let messages = this.state.messages;

    this.chat.on('message', (payload) => {
          const { uuid, text } = payload.data;
          messages.push(
            <Message key={ this.state.messages.length } uuid={ uuid } text={ text }/>
          );
          this.setState({
              messages: messages
          });
    });

    this.chat.on('$uploadcare.upload', (payload) => {
      console.log(payload);
        messages.push(
          <Message key={ this.state.messages.length } uuid={ payload.sender.uuid } text={ `${payload.data.name} -> ${payload.data.cdnUrl}` }/>
        );
        this.setState({
            messages: messages
        });
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
            <Input type="hidden" role="uploadcare-uploader" name="my_file" />
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
