const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const angel = '@';
const devil = '@'

class Field {
  constructor(field = [[]]) {
    this.field = field;
    this.locationX = Math.floor(Math.random()*15);
    this.locationY = Math.floor(Math.random()*15);
    // Set the "home" position before the game starts
    this.field[this.locationY][this.locationX] = pathCharacter;

    console.log(`Welcome to my version of the findYourHat game! Starting position is random. Hard mode enabled (after so many moves more holes will be added).`);
    console.log(`I added some characters to this game. The '@' symbol represents an angel. Land on it and holes will be filled.`);
    console.log(`The devil character, also represented by the '@', will add more holes. Good luck!!`);
  }

  runGame() {
    let playing = true;
    let i = 0;
    while (playing) {
      this.print();
      this.askQuestion();
      if (!this.isInBounds()) {
        console.log('Out of bounds instruction!');
        playing = false;
        break;
      } else if (this.isHole()) {
        console.log('Sorry, you fell down a hole!');
        playing = false;
        break;
      } else if (this.isAngel()){
        console.log(`You found an angel. All holes filled.`);
        for (let x = 0; x<15;x++){
          for (let y=0;y<15;y++){
            if (this.field[x][y] === hole){
              this.field[x][y] = fieldCharacter;
            }
          }
        }
      } else if (this.isDevil()){
        console.log(`You run into a devil. More holes filled.`);
        let j=1
        while (j < 6){
          {
            let randomY = Math.floor(Math.random()*15);
            let index = [];
            for (let j=0;j<this.field[randomY].length;j++){
            if (this.field[randomY][j] === fieldCharacter){
              index.push(j);
            }
            }
            this.field[randomY][index[Math.floor(Math.random()*index.length)]] = hole;
            j++;
          }
        }
      } else if (this.isHat()) {
        console.log('Congrats, you found your hat!');
        playing = false;
        break;
      }
      // Update the move count "i"
      i++
      // Add holes
      if (i===3 || i===5 || i===7 || i>=9){
        let randomY = Math.floor(Math.random()*15);
        let index = [];
        for (let j=0;j<this.field[randomY].length;j++){
        if (this.field[randomY][j] === fieldCharacter){
          index.push(j);
        }
        }
        this.field[randomY][index[Math.floor(Math.random()*index.length)]] = hole;
      }
      // Add angel or devil
      if (i===4){
        let index = []
        let randomY = Math.floor(Math.random()*15);
        for (let j=0;j<this.field[randomY].length;j++){
        if (this.field[randomY][j] === fieldCharacter || this.field[randomY][j] === hole){
          index.push(j);
        }
        }
        let randomNumber = Math.floor(Math.random()*3);

        if (randomNumber !==2){
          this.field[randomY][index[Math.floor(Math.random()*index.length)]] = devil;
        } else {
        this.field[randomY][index[Math.floor(Math.random()*index.length)]] = angel;
        }
      };
      
      // Update the current location on the map
      this.field[this.locationY][this.locationX] = pathCharacter;
    }
  }

  askQuestion() {
    const answer = prompt('Which way? ').toUpperCase();
    switch (answer) {
      case 'U':
        this.locationY -= 1;
        break;
      case 'D':
        this.locationY += 1;
        break;
      case 'L':
        this.locationX -= 1;
        break;
      case 'R':
        this.locationX += 1;
        break;
      default:
        console.log('Enter U, D, L or R.');
        this.askQuestion();
        break;
    }
  }

  isInBounds() {
    return (
      this.locationY >= 0 &&
      this.locationX >= 0 &&
      this.locationY < this.field.length &&
      this.locationX < this.field[0].length
    );
  }

  isHat() {
    return this.field[this.locationY][this.locationX] === hat;
  }

  isHole() {
    return this.field[this.locationY][this.locationX] === hole;
  }

  isAngel() {
    return this.field[this.locationY][this.locationX] === angel;
  }

  isDevil() {
    return this.field[this.locationY][this.locationX] === devil;
  }
  print() {
    const displayString = this.field.map(row => {
        return row.join('');
      }).join('\n');
    console.log(displayString);
  }

  static generateField(height, width, percentage = 0.1) {
    const field = new Array(height).fill(0).map(el => new Array(width));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const prob = Math.random();
        field[y][x] = prob > percentage ? fieldCharacter : hole;
      }
    }
    // Set the "hat" location
    const hatLocation = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };
    // Make sure the "hat" is not at the starting point
    while (hatLocation.x === 0 && hatLocation.y === 0) {
      hatLocation.x = Math.floor(Math.random() * width);
      hatLocation.y = Math.floor(Math.random() * height);
    }
    field[hatLocation.y][hatLocation.x] = hat;
    return field;
  }
}

const myfield = new Field(Field.generateField(15, 15, 0.2));
myfield.runGame();
