"use strict";
const speed = 0.5;
const url = window.location.href;
const href = url.substring(url.indexOf("#") + 1);
const listModeLiteral = "listMode";
const listModeLitLen = listModeLiteral.length + 1;
const lTmp = href.substring(
  href.search(`${listModeLiteral}=`) === -1 ?
    0 :
    href.search(`${listModeLiteral}=`) + listModeLitLen
);
let listMode = lTmp === href ? href : lTmp; // rolling, all
const notes = [
  "C2", "D2", "E2", "F2", "G2", "A2", "B2",
  "C3", "D3", "E3", "F3", "G3", "A3", "B3",
  "C4"
];
//@ts-ignore Create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();
const interval = notes.length / speed; // 14 s
const totalDuration = Math.round(globalThis.imgs.length * interval / 60);
const changingPositionSound = new Audio("./change.mp3");
const difficultyColors = [
  "#6C0", "#CB0", "#33F", "#93C", "#C33", "#600"
  //"#6C0", "#9C0", "#CC0", "#CB0", "#C90", "#C60", "#C33"
];
const pos = {
  "u": "solid",
  "s": "dotted dashed solid dashed",
  "f": "dotted dotted dashed dotted"
};
let rolling, rollingSec;
// @ts-ignore
class ImgsIterator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialDt: new Date(),
      currentDt: new Date(),
      currentImgToDisplay: 0,
      // @ts-ignore
      imagesWrapper: React.createElement("div"),
      interval: interval,
      timerText: `Routine of ${globalThis.imgs.length} movements (${totalDuration} min).`
    };
  };

  componentDidMount() {
    // @ts-ignore
    if (listMode === "rolling") {
      this.startRolling()
    }
  }

  setTimerText() {
    const currentDt = new Date();
    // @ts-ignore
    const currentSec = (currentDt - this.state.currentDt) / 1000;
    const nChars = 10 + 1;
    const nPend = nChars * (0.2 + this.state.interval - currentSec) / this.state.interval;
    const nDone = nChars - nPend;
    this.state.timerText = `#${this.state.currentImgToDisplay + 1}
      [${"*".repeat(nDone)}${".".repeat(nPend)}]${" "// @ts-ignore
      }(${((currentDt - this.state.initialDt) / 60000).toFixed(1)} of ${totalDuration} min).`;
  }

  startRolling() {
    rolling = setInterval(() => {
      changingPositionSound.play();
      this.state.currentDt = new Date();
      this.state.currentImgToDisplay += 1;
      if (this.state.currentImgToDisplay >= globalThis.imgs.length) {
        clearInterval(rolling);
        listMode = "full";
      }
    }, this.state.interval * 1000);
    let currentS = 0;
    rollingSec = setInterval(() => {
      synth.triggerAttackRelease(notes[currentS % this.state.interval], "8n");
      this.setTimerText();
      if (this.state.currentImgToDisplay >= globalThis.imgs.length) {
        clearInterval(rollingSec);
      }
      currentS += 1;
    }, this.state.interval * 1000);
  }
  stopRolling() {
    clearInterval(rolling);
    rolling = null;
    clearInterval(rollingSec)
    rollingSec = null;
  }

  render() {
    // @ts-ignore
    const imagesWrapper = React.createElement(
      "div",
      { id: "imagesWrapper", key: "imagesWrapper" },
      [
        listMode === "rolling" ?
          // @ts-ignore
          React.createElement(
            "button",
            {
              key: "rollingButton",
              style: {
                backgroundColor: "#000",
                border: "1px solid #666",
                color: "#FFF",
                cursor: "pointer",
                display: "inline-block",
                fontSize: "1.6em",
                fontFamily: "courier",
              },
              onClick: () => rolling ? this.stopRolling() : this.startRolling()
            },
            rolling ? "Stop rolling" : "Start rolling"
          ) : null,
        // @ts-ignore
        React.createElement(
          "div",
          {
            key: "timerText",
            style: {
              display: "inline-block",
              fontSize: "1.6em",
              fontFamily: "courier",
              marginLeft: "0.3em"
            }
          },
          this.state.timerText
        ), // @ts-ignore
        React.createElement("div", { style: { height: "0.5em" }, key: "spacer" }, null), // @ts-ignore
        globalThis.imgs.map((img, idx) => {
          const k = `${idx + 1}${img["i"].length > 10 ? `-${img["i"].substring(7, 11)}` : ""}`;
          const d = img["d"] ?? "";
          const p = img["p"] ?? "";
          // @ts-ignore
          return React.createElement(
            "div",
            {
              key: `image-container-${k}`,
              className: `images-container ${listMode === "rolling" ? "dims-rolling" : "dims-full"}`,
              style: {
                borderColor: !isNaN(img["d"] ?? NaN) ? difficultyColors[img["d"] ?? 0] : "auto",
                borderStyle: img["p"] ? pos[img["p"]] : "groove",
                display: (
                  // @ts-ignore
                  (listMode === "rolling") && (idx !== this.state.currentImgToDisplay) ?
                    "none" :
                    "inline-block"
                )
              }
            },
            // @ts-ignore
            React.createElement(
              "img",
              {
                key: `image-${k}`,
                src: `${globalThis.imagesRoute}/${img["i"]}`,
                className: listMode === "rolling" ? "img-rolling" : "img-full",
                title: `${k}${!isNaN(d) && `, d: ${d}`}${p && `, p: ${p}`}`,
                style: { outlineColor: !isNaN(img["d"] ?? NaN) ? `${difficultyColors[img["d"] ?? 0]}2` : "#0002" }
              },
              null
            ),
          );
        })]
    );
    // @ts-ignore
    this.setState({
      imagesWrapper: imagesWrapper
    });
    return imagesWrapper;
  }
}
const domContainer = document.querySelector("#asanasPlaceholder");
// @ts-ignore
const root = ReactDOM.createRoot(domContainer);
// @ts-ignore
root.render(React.createElement(ImgsIterator));