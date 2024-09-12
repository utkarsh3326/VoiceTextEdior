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
    this.state = {
      model: "<p></p>",
    };
  }

  handleModelChange(model) {
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
        this.setState({ model: newModel });
      }, 3000);
    }
  }
  addStyleTagOnSpecifiedOccurence(
    NewchangeWord,
    newmodel,
    newWord,
    occNo,
    indexOfConvert
  ) {
    let i = 0;
    NewchangeWord = NewchangeWord.trim();
    let reg = new RegExp(NewchangeWord, "g");
    newmodel = newmodel.replace(reg, function (match) {
      i++;
      return occNo === i ? newWord : match;
    });
    this.changeStyle(newmodel, indexOfConvert);
  }

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
    let NewchangeWord = changeWord;
    if (Object.keys(occurenceOfWord).includes(occurence)) {
      occNo = occurenceOfWord[occurence];
      let startIndex = occurence.length + 1;
      NewchangeWord = changeWord.substr(startIndex);
    }

    if (NewchangeWord.length !== 0) {
      let newWord = "";
      let styleTag = "";
      if (bold) {
        styleTag = "<b>";
        newWord = styleTag.concat(NewchangeWord, "</b>");
      } else if (italic) {
        styleTag = "<i>";
        newWord = styleTag.concat(NewchangeWord, "</i>");
      } else if (underline) {
        styleTag = "<u>";
        newWord = styleTag.concat(NewchangeWord, "</u>");
      }
      this.addStyleTagOnSpecifiedOccurence(
        NewchangeWord,
        newmodel,
        newWord,
        occNo,
        indexOfConvert
      );
    }
  }

  // this function is for finding style type between bold , italic and underline Word
  changeStyle = (newmodel, i) => {
    if (this.props.transcript.indexOf("convert", i) != -1) {
      let indexOfConvert = this.props.transcript.indexOf("convert", i) + 7;
      let bold = false;
      let italic = false;
      let underline = false;
      let indexOfWordEnd = null;
      if (this.props.transcript.includes("in bold")) {
        bold = true;
        indexOfWordEnd = this.props.transcript.indexOf(
          "in bold",
          indexOfConvert
        );
        if (
          this.props.transcript
            .substr(indexOfConvert, indexOfWordEnd - indexOfConvert)
            .includes("convert") ||
          indexOfWordEnd == -1
        ) {
          bold = false;
        }
      }
      if (this.props.transcript.includes("in Italic") && !bold) {
        italic = true;
        indexOfWordEnd = this.props.transcript.indexOf(
          "in Italic",
          indexOfConvert
        );

        if (
          this.props.transcript
            .substr(indexOfConvert, indexOfWordEnd - indexOfConvert)
            .includes("convert") ||
          indexOfWordEnd == -1
        ) {
          italic = false;
        }
      }
      if (
        this.props.transcript.includes("in underline word") &&
        !bold &&
        !italic
      ) {
        underline = true;
        indexOfWordEnd = this.props.transcript.indexOf(
          "in underline word",
          indexOfConvert
        );

        if (
          this.props.transcript
            .substr(indexOfConvert, indexOfWordEnd - indexOfConvert)
            .includes("convert") ||
          indexOfWordEnd == -1
        ) {
          underline = false;
        }
      }
      if (bold || italic || underline) {
        this.addStyleTagOnText(
          bold,
          italic,
          underline,
          indexOfConvert,
          indexOfWordEnd,
          newmodel
        );
      } else {
        this.changeStyle(newmodel, indexOfConvert);
      }
    } else {
      this.setState({ model: newmodel });
      this.toSetmodelandtranscript(false);
    }
  };

  render() {
    return (
      <div>
        <FroalaEditorComponent
          tag="textarea"
          model={this.state.model}
          onModelChange={this.handleModelChange}
        />
        <FroalaEditorView model={this.state.model} />
        <div>
          <button onClick={() => this.toSetmodelandtranscript(true)}>
            Add Text
          </button>
          <p>{this.props.transcript}</p>
        </div>
        <div>
          <button onClick={() => this.changeStyle(this.state.model, 0)}>
            Apply Style
          </button>
        </div>
      </div>
    );
  }
}

export default SpeechRecognition(App);
