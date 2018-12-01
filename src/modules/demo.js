var Draggable = window.ReactDraggable;

var App = React.createClass({
  getInitialState() {
    return {
      activeDrags: 0,
      deltaPosition: {
        x: 0, y: 0
      },
      controlledPosition: {
        x: -400, y: 200
      }
    };
  },

  handleDrag(e, ui) {
    const {x, y} = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
  },

  onStart() {
    this.setState({activeDrags: ++this.state.activeDrags});
  },

  onStop() {
    this.setState({activeDrags: --this.state.activeDrags});
  },

  // For controlled component
  adjustXPos(e) {
    e.preventDefault();
    e.stopPropagation();
    const {x, y} = this.state.controlledPosition;
    this.setState({controlledPosition: {x: x - 10, y}});
  },

  adjustYPos(e) {
    e.preventDefault();
    e.stopPropagation();
    const {controlledPosition} = this.state;
    const {x, y} = controlledPosition;
    this.setState({controlledPosition: {x, y: y - 10}});
  },

  onControlledDrag(e, position) {
    const {x, y} = position;
    this.setState({controlledPosition: {x, y}});
  },

  onControlledDragStop(e, position) {
    this.onControlledDrag(e, position);
    this.onStop();
  },

  render() {
    const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
    const {deltaPosition, controlledPosition} = this.state;
    return (
      <div>
        <Draggable onDrag={this.handleDrag} {...dragHandlers}>
          <div className="box">
            <div>I track my deltas</div>
            <div>x: {deltaPosition.x.toFixed(0)}, y: {deltaPosition.y.toFixed(0)}</div>
          </div>
        </Draggable>
        <Draggable bounds={{top: -100, left: -100, right: 100, bottom: 100}} {...dragHandlers}>
          <div className="box">I can only be moved 100px in any direction.</div>
        </Draggable>
        <div className="box" style={{height: '500px', width: '500px', position: 'relative', overflow: 'auto', padding: '0'}}>
          <div style={{height: '1000px', width: '1000px', padding: '10px'}}>
            <Draggable bounds="parent" {...dragHandlers}>
              <div className="box">
                I can only be moved within my offsetParent.<br /><br />
                Both parent padding and child margin work properly.
              </div>
            </Draggable>
          </div>
        </div>
        <Draggable defaultPosition={{x: 25, y: 25}} {...dragHandlers}>
          <div className="box">
            {"I have a default position of {x: 25, y: 25}, so I'm slightly offset."}
          </div>
        </Draggable>
        <Draggable position={controlledPosition} {...dragHandlers} onDrag={this.onControlledDrag}>
          <div className="box">
            My position can be changed programmatically. <br />
            I have a drag handler to sync state.
          </div>
        </Draggable>
        <Draggable position={controlledPosition} {...dragHandlers} onStop={this.onControlledDragStop}>
          <div className="box">
            My position can be changed programmatically. <br />
            I have a dragStop handler to sync state.
            <p>
              <a href="#" onClick={this.adjustXPos}>Adjust x ({controlledPosition.x})</a>
            </p>
            <p>
              <a href="#" onClick={this.adjustYPos}>Adjust y ({controlledPosition.y})</a>
            </p>
          </div>
        </Draggable>

      </div>
    );
  }
});

ReactDOM.render(<App/>, document.getElementById('container'));