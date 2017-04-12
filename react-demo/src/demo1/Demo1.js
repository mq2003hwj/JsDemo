import React from 'react';

const Pane = function (props) {
  return (<h1>{ props.word }</h1>);
}


class Demo extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };
  }

  handleChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  render() {
    const text = this.state.text;
    const divCss = {
      'width': '200px',
      'margin': '120px auto',
    };
    return (
      <div style={ divCss }>
        <input value={ text } onChange={this.handleChange.bind(this)} />
        <Pane word={ text }  /> 
      </div>
    );
  }
}

export default Demo;