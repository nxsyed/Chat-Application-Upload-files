import React, { PureComponent } from 'react';
import './index.css';

export default class Message extends PureComponent{
  render () {
      return ( 
        <div>
            { this.props.uuid }  : { this.props.text } </div>
      );
  }
};


