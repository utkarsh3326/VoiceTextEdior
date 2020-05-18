import React from "react";
import SpeechRecognition from "react-speech-recognition";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

const occurenceOfWord = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  sixth: 6,
};

class App extends React.Component {
  constructor() {
    super();
    this.handleModelChange = this.handleModelChange.bind(this);
    this.toSetmodelandtranscript = this.toSetmodelandtranscript.bind(this);
    this.changeStyle = this.changeStyle.bind(this);
    this.state = {
      model: "",
      styleString: "",
      convertIndex: 0,
    };
  }

  handleModelChange(model) {
    console.log("invoked", model);
    this.setState({
      model: model,
    });
  }

  async toSetmodelandtranscript(f) {
    await this.props.resetTranscript();
    if (f) {
      await setTimeout(() => {
        let newModel = this.state.model.substr(0, this.state.model.length - 4);
        newModel = newModel.concat(" ", this.props.transcript, "</p>");
        console.log("newModel", newModel);
        this.setState({ model: newModel });
      }, 3000);
    }
    await console.log("model set state for function", this.state.model);
  }
  handleFocus = (event) => {
    console.log(event.target);
    event.target.select();
  };
  addStyleTagOnText(
    bold,
    italic,
    underline,
    indexOfConvert,
    indexOfWordEnd,
    newmodel
  ) {
    let changeWord = this.props.transcript.substr(
      indexOfConvert,
      indexOfWordEnd - indexOfConvert
    );

    changeWord = changeWord.trim();
    let occurence = changeWord.split(" ")[0];
    let occNo = 1;
    console.log("occurence", occurence);
    let NewchangeWord = changeWord;
    // if (occurenceOfWord[occurence] != "underfined")
    if (Object.keys(occurenceOfWord).includes(occurence)) {
      occNo = occurenceOfWord[occurence];
      // changeWord=changeWord.substr((indexOfConvert+o,)
      console.log("occNo", occNo);
      let startIndex = occurence.length + 1;
      NewchangeWord = changeWord.substr(startIndex);
      console.log(startIndex, changeWord);
      console.log("final word to change", NewchangeWord);
    }
    // if (checkoccur.includes(occurence))

    if (NewchangeWord.length != 0) {
      // let newmodel = null;
      if (bold == 1) {
        let b = "<b>";
        // let newWord = b.concat(changeWord,"</b>");
        let newWord = b.concat(NewchangeWord, "</b>");
        console.log(
          "put word or not ",
          // this.state.model.includes(changeWord)
          newmodel.includes(NewchangeWord)
        );
        // newmodel = this.state.model.replace(changeWord, newWord);

        // newmodel = newmodel.replace(changeWord, newWord);
        console.log("set state for bold");
        let t = 0;
        NewchangeWord = NewchangeWord.trim();
        let reg = new RegExp(NewchangeWord, "g");
        newmodel = newmodel.replace(reg, function (match) {
          console.log("occurence checking is working", match);
          t++;
          return occNo === t ? newWord : match;
        });
        this.changeStyle(newmodel, indexOfConvert);
        // this.setState({ model: newmodel }, this.changeStyle(indexOfConvert));
      } else if (italic == 1) {
        let b = "<i>";
        let newWord = b.concat(NewchangeWord, "</i>");
        console.log(
          "put word or not ",
          // this.state.model.includes(changeWord)
          newmodel.includes(NewchangeWord)
        );

        // newmodel = this.state.model.replace(changeWord, newWord);
        // newmodel = newmodel.replace(changeWord, newWord);

        console.log("set state for italic");
        let t = 0;
        NewchangeWord = NewchangeWord.trim();
        let reg = new RegExp(NewchangeWord, "g");
        newmodel = newmodel.replace(reg, function (match) {
          console.log("occurence checking is working", match);
          t++;
          return occNo === t ? newWord : match;
        });
        this.changeStyle(newmodel, indexOfConvert);
        // this.setState({ model: newmodel }, this.changeStyle(indexOfConvert));
      } else if (underline == 1) {
        let b = "<u>";
        let newWord = b.concat(NewchangeWord, "</u>");
        console.log(
          "put word or not ",
          // this.state.model.includes(changeWord)
          newmodel.includes(NewchangeWord)
        );
        // newmodel = this.state.model.replace(changeWord, newWord);
        // newmodel = newmodel.replace(changeWord, newWord);
        console.log("set state for underline");
        let t = 0;
        NewchangeWord = NewchangeWord.trim();
        let reg = new RegExp(NewchangeWord, "g");
        newmodel = newmodel.replace(reg, function (match) {
          console.log("occurence checking is working", match);
          t++;
          return occNo === t ? newWord : match;
        });

        this.changeStyle(newmodel, indexOfConvert);
        // this.setState({ model: newmodel }, this.changeStyle(indexOfConvert));
      }
    }
    console.log("newmodel", newmodel);
  }

  changeStyle = (newmodel, i) => {
    if (this.props.transcript.indexOf("convert", i) != -1) {
      let indexOfConvert = this.props.transcript.indexOf("convert", i) + 7;
      let bold = 0;
      let italic = 0;
      let underline = 0;
      let indexOfWordEnd = null;
      if (this.props.transcript.includes("in bold")) {
        bold = 1;
        indexOfWordEnd = this.props.transcript.indexOf(
          "in bold",
          indexOfConvert
        );
        console.log("bold World end index", indexOfWordEnd);
        if (
          this.props.transcript
            .substr(indexOfConvert, indexOfWordEnd - indexOfConvert)
            .includes("convert") ||
          indexOfWordEnd == -1
        ) {
          console.log("unset bold");
          bold = 0;
        }
      }
      if (this.props.transcript.includes("in Italic") && bold == 0) {
        console.log("it contain italic");
        italic = 1;
        indexOfWordEnd = this.props.transcript.indexOf(
          "in Italic",
          indexOfConvert
        );
        console.log("italic World end index", indexOfWordEnd);
        if (
          this.props.transcript
            .substr(indexOfConvert, indexOfWordEnd - indexOfConvert)
            .includes("convert") ||
          indexOfWordEnd == -1
        ) {
          console.log("unset italic");
          italic = 0;
        }
      }
      if (
        this.props.transcript.includes("in underline word") &&
        bold == 0 &&
        italic == 0
      ) {
        underline = 1;
        indexOfWordEnd = this.props.transcript.indexOf(
          "in underline word",
          indexOfConvert
        );
        console.log("underline word  end index", indexOfWordEnd);
        if (
          this.props.transcript
            .substr(indexOfConvert, indexOfWordEnd - indexOfConvert)
            .includes("convert") ||
          indexOfWordEnd == -1
        ) {
          console.log("unset underline");
          underline = 0;
        }
      }
      console.log("indexs", indexOfConvert, indexOfWordEnd);
      console.log(
        "this is style operations",
        this.props.transcript.substr(
          indexOfConvert,
          indexOfWordEnd - indexOfConvert
        )
      );
      if (bold == 1 || italic == 1 || underline == 1) {
        this.addStyleTagOnText(
          bold,
          italic,
          underline,
          indexOfConvert,
          indexOfWordEnd,
          newmodel
        );
      } else {
        console.log("only convert find but no any style");
        this.changeStyle(newmodel, indexOfConvert);
      }
    } else {
      console.log("no convert is left more , so set state ");
      this.setState({ model: newmodel });
      this.toSetmodelandtranscript(false);
    }
  };

  render() {
    return (
      <div className="App">
        <FroalaEditorComponent
          tag="textarea"
          model={this.state.model}
          // model={this.props.transcript}
          onModelChange={this.handleModelChange}
        />
        <FroalaEditorView model={this.state.model} />
        <div>
          <button
            // onClick={this.props.resetTranscript}
            onClick={() => this.toSetmodelandtranscript(true)}
          >
            Reset
          </button>
          <p>{this.props.transcript}</p>
        </div>
        <div>
          <button
            // onClick={this.props.resetTranscript}
            onClick={() => this.changeStyle(this.state.model, 0)}
          >
            Apply Style
          </button>
        </div>
      </div>
    );
  }
}

export default SpeechRecognition(App);
