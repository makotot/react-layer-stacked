import React from 'react'
import PropTypes from 'prop-types'

const isSameArray = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((val, index) => val === b[index])
}

const getStackedSize = (layers) => {
  return layers.filter(item => item).length;
}

const getVisibilityList = (layers) => {
  return layers.map(layer => layer.isHidden)
}

const getDiffIndex = (a, b) => {
  let diffIndex = -1;

  a.forEach((item, index) => {
    if (item !== b[index]) {
      diffIndex = index;
    }
  });

  return diffIndex
}

class LayerStacked extends React.Component {
  static propTypes = {
    layers: PropTypes.arrayOf(
      PropTypes.shape({
        isHidden: PropTypes.bool,
        render: PropTypes.func,
      }),
    ),
    children: PropTypes.func,
    render: PropTypes.func,
  }

  state = {
    stackedSize: 0,
    diffIndex: -1,
    stackedList: [],
  }

  componentWillReceiveProps(nextProps) {
    const current = this.props.layers.map(layer => ({ isHidden: layer.isHidden }))
    const next = nextProps.layers.map(layer => ({ isHidden: layer.isHidden }))

    if (!isSameArray(getVisibilityList(current), getVisibilityList(next))) {
      if (!current.length) {
        this.init()
      } else {
        this.update(current, next)
      }
    }
  }

  getStackOrder = (layerIndex) => {
    console.log(layerIndex, this.state.stackedList)
    if (!this.state.stackedList.includes(layerIndex)) {
      return 0;
    }
    return this.state.stackedList.findIndex(item => item === layerIndex)
  }

  init = () => {
    this.setState({
      stackedSize: 0,
      diffIndex: -1,
      stackedList: [],
    })
  }

  update = (current, next) => {
    const diffIndex = getDiffIndex(getVisibilityList(current), getVisibilityList(next))
    const updatedVisibility = getVisibilityList(next)[diffIndex]
    const { stackedList } = this.state

    if (!updatedVisibility) {
      stackedList.push(diffIndex)
    } else {
      stackedList.pop(diffIndex)
    }

    console.log(stackedList)
    this.setState({
      stackedSize: getStackedSize(next),
      diffIndex,
      stackedList,
    })
  }

  render() {
    const render = this.props.children || this.props.render
    const {
      stackedSize, diffIndex, stackedList
    } = this.state

    return render({
      layers: this.props.layers,
      stackedSize,
      diffIndex,
      stackedList,
      getStackOrder: this.getStackOrder,
    })
  }
}

export default LayerStacked