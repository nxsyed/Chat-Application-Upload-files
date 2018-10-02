import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class UserList extends Component {
  state = {
    checked: [],
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    
    if (currentIndex === -1) {
      this.props.callback(value, true);
      newChecked.push(value);
    } else {
      this.props.callback(value, false);
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  render() {
    const { users } = this.props;
    return (
        <List subheader={<ListSubheader>Users - Mute</ListSubheader>}>
            {
                Object.keys(users).map((name, index) => { 
                    return(
                        <ListItem key={index} >
                            <ListItemText primary={name} />
                            <ListItemSecondaryAction>
                            <Switch
                                onChange={this.handleToggle(name)}
                                checked={this.state.checked.indexOf(name) !== -1}
                            />
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })
            }
        </List>
    );
  }
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
};

export default withStyles(styles)(UserList);