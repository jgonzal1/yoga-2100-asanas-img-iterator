"use strict";
const listMode = "rolling"; // "full"; //
const interval = 25; // s
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
      setInterval(() => {
        changingPositionSound.play();
        this.state.currentDt = new Date();
        this.state.currentImgToDisplay += 1;
      }, this.state.interval * 1000);
    }
  }

  setTimerText() {
    return `Position ${this.state.currentImgToDisplay + 1
      }. Changing in ${Math.round(10 * (
        0.2 + this.state.interval - (
          // @ts-ignore
          (new Date() - this.state.currentDt) / 1000
        )
      )) / 10
      } s.`
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
          { style: { fontSize: "2em" } },
          // @ts-ignore
          listMode === "rolling" ? this.setTimerText() : null
        ),
        globalThis.imgs.map((img, idx) => {
          if (this.state.currentImgToDisplay === idx) {
            console.log("matching idx", idx)
          }
          const k = `${idx + 1}${img["i"].length > 10 ? `-${img["i"].substring(7, 11)}` : ""}`;
          const d = img["d"] ?? "";
          const p = img["p"] ?? "";
          // @ts-ignore
          return React.createElement(
            "div",
            {
              className: "images-container",
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
                src: `../images/${img["i"]}`,
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