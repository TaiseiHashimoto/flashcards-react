import React from 'react';
import ReactDOM from 'react-dom';

import { Container } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { Tabs, Tab } from '@material-ui/core';
import { List, ListItem } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import { Box } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteForever';


function shuffle(array) {
// function getPermutation(length) {
  // const array = [...Array(length).keys()];
  // Fisher-Yates algorithm
  const newArray = [...array];
  var currentIndex = array.length;
  while (0 !== currentIndex) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
}


class Word {
  constructor(source, target, checked = false) {
    this.source = source;
    this.target = target;
    this.checked = checked;
  }
}


class WordCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wordIdxs: this.getWordIdxs(this.props.words),
      isOpen: false,
      // checked: false,
    };
    console.log("construct WordCard");
  }

  getWordIdxs(words) {
    let wordIdxs = [];
    words.forEach((word, wordIdx) => {
      if (!word.checked) {
        wordIdxs.push(wordIdx);
      }
    });
    return shuffle(wordIdxs);
  }

  reset() {
    this.setState({
      wordIdxs: this.getWordIdxs(this.props.words),
      isOpen: false,
    });
    console.log("reset WordCard");
  }

  handleChecked(e) {
    const wordIdx = this.state.wordIdxs[0];
    this.props.checkWord(wordIdx);
  }
  
  goNext() {
    const isOpen = this.state.isOpen;
    const newWordIdxs = [...this.state.wordIdxs];
    if (isOpen) {
      newWordIdxs.shift()  // pop first
    }
    this.setState({
      wordIdxs: newWordIdxs,
      isOpen: !isOpen,
    });
  }

  render() {
    if (this.state.wordIdxs.length > 0) {
      const wordIdx = this.state.wordIdxs[0];
      const word = this.props.words[wordIdx];
      const isOpen = this.state.isOpen;
      console.log("render WordCard", wordIdx, word, this.state.wordIdxs, this.props.words);
      return (
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={4}>
            <Box textAlign="center">
              {word.source}
            </Box>
          </Grid>
          <Grid item xs={5}>
            <Box textAlign="center">
              {isOpen ? word.target : ""}
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Checkbox
              color="primary"
              checked={word.checked}
              onChange={(e) => this.handleChecked(e)}
            />
          </Grid>
          <Grid item xs={12}>
            <Box textAlign="center">
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => this.goNext()}
              >
                {isOpen ? "Next" : "Open"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <>
          <Box textAlign="center" mb={5}>
            Finish!
          </Box>
          <Box textAlign="center">
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => this.reset()}>
            Start Again
          </Button>
          </Box>
        </>
      )
    }
  }
}

class WordListInput extends React.Component {
  constructor(props) {
    super(props);
    this.defaultInput = {
      source: "",
      target: "",
    };
    this.state = {
      input: {...this.defaultInput}
    };
  }

  handleInput(e, key) {
    const input = this.state.input;
    input[key] = e.target.value;
    this.setState({
      input: input
    });
  }

  clearInput() {
    this.setState({
      input: {...this.defaultInput}
    });
  }

  render() {
    const input = this.state.input;
    return (
      <Box mb={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={4}>
            <TextField
              // type="text"
              value={input.source}
              label="Source"
              onChange={(e) => this.handleInput(e, "source")}
              fullWidth
              inputProps={{min: 0, style: { textAlign: 'center' }}}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              // type="text"
              value={input.target}
              label="Target"
              onChange={(e) => this.handleInput(e, "target")}
              fullWidth
              inputProps={{min: 0, style: { textAlign: 'center' }}}
            />
          </Grid>
          <Grid item xs={2}>
            <Box textAlign="center">
              <Button
                variant="outlined"
                color="primary"
                disabled={!input.source || !input.target}
                onClick={() => {
                  this.props.addWord(input.source, input.target);
                  this.clearInput();
                }}
              >
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

function WordListItem(props) {
  return (
    <ListItem>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={4}>
          <Box textAlign="center">
            {props.word.source}
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Box textAlign="center">
            {props.word.target}
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Box textAlign="center">
            <Checkbox
              checked={props.word.checked}
              color="primary"
              onChange={() => props.checkWord()}
            />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box textAlign="center">
            <IconButton onClick={() => props.deleteWord()}>
              <DeleteIcon color="secondary" />
            </IconButton>
          </Box>
        </Grid>
      </Grid>      
    </ListItem>
  );
}

class WordList extends React.Component {
  render() {
    const words = this.props.words;
    return (
      <>
        <WordListInput
          key="input"
          addWord={(source, target) => this.props.addWord(source, target)}
        />
        <List>
          {words.map((word, wordIdx) =>
            <WordListItem
              key={wordIdx}
              word={word}
              wordIdx={wordIdx}
              checkWord={() => this.props.checkWord(wordIdx)}
              deleteWord={() => this.props.deleteWord(wordIdx)}
            />
          )}
        </List>
      </>
    );
  }
}

function Header(props) {
  return (
    <Box mb={5}>
      <Paper square>
        <Tabs
          value={props.pageId}
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, newValue) => props.switchPage(newValue)}
          centered
          variant="fullWidth"
        >
          <Tab label="List" value="list" />
          <Tab label="Card" value="card" />
        </Tabs>
      </Paper>
    </Box>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    const defaultWords = [
      new Word("apple", "りんご"),
      new Word("pencil", "鉛筆"),
      new Word("clock", "時計"),
    ];
    this.state = {
      words: defaultWords,
      pageId: "list",
    };
  }

  checkWord(wordIdx) {
    console.log("check word", wordIdx, this.state.words.length);
    const words = this.state.words;
    const word = words[wordIdx];
    word.checked = !word.checked;
    this.setState({
      words: [
        ...words.slice(0, wordIdx),
        word,
        ...words.slice(wordIdx+1),
      ]
    });
  }

  addWord(source, target) {
    const words = this.state.words;
    const word = new Word(source, target);
    this.setState({
      words: [...words, word]
    });
  }
  
  deleteWord(wordIdx) {
    const words = this.state.words;
    this.setState({
      words: [...words.slice(0, wordIdx), ...words.slice(wordIdx+1)]
    });
  }

  switchPage(pageId) {
    this.setState({
      pageId: pageId,
    });
  }

  render() {
    console.log(this.state);
    console.log("render App");
    const pageId = this.state.pageId;
    let body;
    if (pageId === "list") {
      body = <WordList
        words={this.state.words}
        checkWord={(wordIdx) => this.checkWord(wordIdx)}
        addWord={(source, target) => this.addWord(source, target)}
        deleteWord={(wordIdx) => this.deleteWord(wordIdx)}
      />
    } else {
      body = <WordCard
        words={this.state.words}
        checkWord={(wordIdx) => this.checkWord(wordIdx)}
      />
    }
    return (
      <Container maxWidth="md">
        <Header
          switchPage={(pageId) => this.switchPage(pageId)}
          pageId={pageId}
        />
        <Box ml={5}>
          {body}
        </Box>
      </Container>
    );
  }
}



ReactDOM.render(
  <App />,
  document.getElementById('root')
);
