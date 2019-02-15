import React, { Component } from 'react';
import words from '../words.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: words,
      randomWord: '',
      spellingGuess: '',
      previousWord: '',
    };
    this.msg = new SpeechSynthesisUtterance();
    this.msg.volume = 1;
    this.msg.rate = 0.7;
    this.msg.pitch = 1;

    window.speechSynthesis.onvoiceschanged = () => {
      this.msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name === "Google US English" })[0];
    };

    this.randomWord = this.randomWord.bind(this);
    this.speak = this.speak.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({spellingGuess: event.target.value});
  }

  handleSubmit(event) {
    this.setState({
      isCorrect: this.state.spellingGuess.toLowerCase() === this.state.randomWord.toLowerCase()
    });
    event.preventDefault();
    this.randomWord();
  }

  randomWord() {
    this.setState((state) => {
      let randomWord = state.words[Math.floor(Math.random() * state.words.length)];
      this.speak(randomWord);
      return {
        previousWord: this.state.randomWord,
        randomWord: randomWord
      }
    });
  }

  speak(text) {
    this.msg.text = text;
    window.speechSynthesis.speak(this.msg);
  }

  render() {
    return (
        <div className="app">
          {!this.state.randomWord && <button onClick={this.randomWord}>Start</button>}
          {this.state.randomWord && <form onSubmit={this.handleSubmit}>
            <input type="text" placeholder="Spell the word here" onChange={this.handleChange} value={this.state.spellingGuess} />
            <input type="submit" value="Done" />
          </form>}
          {this.state.randomWord && <button onClick={() => this.speak(this.state.randomWord)}>Repeat word</button>}<br />
          {this.state.previousWord && this.state.isCorrect && <h1 className="correct">Correct!</h1>}
          {this.state.previousWord && !this.state.isCorrect && <h1 className="incorrect">Incorrect!</h1>}
          {this.state.previousWord && <h3>Correct spelling: <strong>{this.state.previousWord}</strong></h3>}
        </div>
    );
  }
}

export default App;
