var DragBar = function(el, left, right, options = {}) {
  this.dragger = typeof el == "string" ? document.querySelector(el) : el;
  this.domLeft = typeof el == "string" ? document.querySelector(left) : left;
  this.domRight = typeof el == "string" ? document.querySelector(right) : right;
  this.dragger.addEventListener("mousedown", this);
  this.refresh()

  this.options = options;
};

DragBar.prototype = {
  refresh() {
    let rightWidth =
      this.dragger.parentNode.clientWidth -
      this.dragger.clientWidth -
      this.dragger.offsetLeft;
    this.domRight.style.width = rightWidth + "px";
  },

  handleEvent(e) {
    switch (e.type) {
      case "mousedown":
        this._start(e);
        break;
      case "mousemove":
        this._move(e);
        break;
      case "mouseup":
        this._end(e);
        break;
    }
  },

  _start(e) {
    this._currentX = e.pageX;
    window.addEventListener("mousemove", this);
    window.addEventListener("mouseup", this);
    this.domLeft.style.pointerEvents = "none";
    this.domRight.style.pointerEvents = "none";
  },

  _move(e) {
    if (this._currentX !== undefined) {
      let deltaX = e.pageX - this._currentX;
      let leftWidth = Math.min(
        this.options.maxLeftWidth || Infinity,
        Math.max(this.domLeft.clientWidth + deltaX, 0)
      );
      if (leftWidth === this.domLeft.clientWidth) {
        return;
      }
      let rightWidth =
        this.dragger.parentNode.clientWidth -
        this.dragger.clientWidth -
        this.dragger.offsetLeft;
      this.domLeft.style.width = leftWidth + "px";
      this.domRight.style.width = rightWidth + "px";
      this._currentX = e.pageX;
    }
  },

  _end(e) {
    this._currentX = undefined;
    window.removeEventListener("mousemove", this);
    window.removeEventListener("mouseup", this);
    this.domLeft.style.pointerEvents = "";
    this.domRight.style.pointerEvents = "";
    this.callback && this.callback();
  }
};
