"use strict";
let listMode = "rolling"; // "full"; //
const interval = 25; // s
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
      interval: interval
    };
  };

  componentDidMount() {
    // @ts-ignore
    if (listMode === "rolling") {
      const rolling = setInterval(() => {
        changingPositionSound.play();
        this.state.currentDt = new Date();
        this.state.currentImgToDisplay += 1;
        if (this.state.currentImgToDisplay >= globalThis.imgs.length) {
          clearInterval(rolling);
          listMode = "full";
        }
      }, this.state.interval * 1000);
    }
  }

  setTimerText() {
    const currentDt = new Date();
    const nChars = 10 + 1;
    // @ts-ignore
    const nPend = nChars * (0.2 + this.state.interval - ((currentDt - this.state.currentDt) / 1000)) / this.state.interval;
    const nDone = nChars - nPend;
    return `#${this.state.currentImgToDisplay + 1}
      [${"*".repeat(nDone)}${".".repeat(nPend)}]${" "// @ts-ignore
      }(${((currentDt - this.state.initialDt) / 60000).toFixed(1)} of ${totalDuration} min).`;
  }

  render() {
    // @ts-ignore
    const imagesWrapper = React.createElement(
      "div",
      { id: "imagesWrapper" },
      [
        // @ts-ignore
        React.createElement(
          "div",
          { style: { fontSize: "2em", fontFamily: "courier" } },
          listMode === "rolling" ? this.setTimerText() : null
        ),
        globalThis.imgs.map((img, idx) => {
          const k = `${idx + 1}${img["i"].length > 10 ? `-${img["i"].substring(7, 11)}` : ""}`;
          const d = img["d"] ?? "";
          const p = img["p"] ?? "";
          // @ts-ignore
          return React.createElement(
            "div",
            {
              className: `images-container ${listMode === "rolling" ? "dims-rolling" : "dims-full"}`,
              key: `image-container-${k}`,
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
                src: `C:/Users/dark_/Dropbox/Books/Health/yoga-2100-asanas/images/${img["i"]}`,
                className: listMode === "rolling" ? "img-rolling" : "img-full",
                key: `image-${k}`,
                title: `${k}${d && `, d: ${d}`}${p && `, p: ${p}`}`,
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