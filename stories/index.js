import React from 'react'
import { storiesOf } from '@storybook/react'
import LayerStacked from '../src'

const Button = (props) => (
  <button { ...props }
    style={{
      padding: '1rem',
      backgroundColor: '#4671f1',
      border: '1px solid #FFF',
      color: '#FFF',
    }}
  />
)

const Overlay = ({ zIndex, isHidden }) => {
  if (isHidden) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        opacity: '0.25',
        zIndex,
      }}
    />
  );
}

const Modal = ({ zIndex, isHidden, show, hide, text, top, left }) => {
  if (isHidden) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top,
        left,
        width: '50vw',
        height: '50vh',
        transform: 'translate(-50%, -50%)',
        padding: '1rem',
        backgroundColor: '#FFF',
        boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.4)',
        zIndex,
      }}
    >
      <div>
        <h1>{ text }</h1>
        <Button onClick={ hide }>close</Button>
        {
          text !== 'A'
          &&
          <Button onClick={ () => show('A') }>show A</Button>
        }
        {
          text !== 'B'
          &&
          <Button onClick={ () => show('B') }>show B</Button>
        }
        {
          text !== 'C'
          &&
          <Button onClick={ () => show('C') }>show C</Button>
        }
      </div>
    </div>
  );
}

storiesOf('LayerStacked', module)
  .add('default', () => {
    class App extends React.Component {
      state = {
        isModalAHidden: true, 
        isModalBHidden: true, 
        isModalCHidden: true, 
      }

      show = (type) => {
        this.setState({
          [`isModal${ type }Hidden`]: false,
        });
      }

      hide = (type) => {
        this.setState({
          [`isModal${ type }Hidden`]: true,
        });
      }

      render() {
        return (
          <div>
            <Button onClick={ () => this.show('A') }>open modal A</Button>
            <Button onClick={ () => this.show('B') }>open modal B</Button>
            <Button onClick={ () => this.show('C') }>open modal C</Button>
            <LayerStacked
              layers={
                [
                  {
                    isHidden: this.state.isModalAHidden,
                    render: (isHidden, zIndex) => (
                      <Modal
                        isHidden={ isHidden }
                        hide={ () => this.hide('A') }
                        show={ this.show }
                        text="A"
                        zIndex={ zIndex }
                        top={ '50%' }
                        left={ '50%' }
                      />
                    )
                  },
                  {
                    isHidden: this.state.isModalBHidden,
                    render: (isHidden, zIndex) => (
                      <Modal
                        isHidden={ isHidden }
                        hide={ () => this.hide('B') }
                        show={ this.show }
                        text="B"
                        zIndex={ zIndex }
                        top={ '60%' }
                        left={ '60%' }
                      />
                    )
                  },
                  {
                    isHidden: this.state.isModalCHidden,
                    render: (isHidden, zIndex) => (
                      <Modal
                        isHidden={ isHidden }
                        hide={ () => this.hide('C') }
                        show={ this.show }
                        text="C"
                        zIndex={ zIndex }
                        top={ '70%' }
                        left={ '70%' }
                      />
                    )
                  }
                ]
              }
            >
              {
                ({ layers, ...props }) => {
                  return (
                    <div>
                      <Overlay
                        isHidden={ !props.stackedList.length }
                        zIndex={ props.stackedList.length - 1 }
                      />
                      {
                        layers.map(({ isHidden, render }, index) => (
                          <div key={ index }>{ render(isHidden, props.getStackOrder(index)) }</div>
                        ))
                      }
                    </div>
                  )
                }
              }
            </LayerStacked>
          </div>
        )
      }
    }

    return <App />
  })