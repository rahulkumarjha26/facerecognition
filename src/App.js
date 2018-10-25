import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/Facerecognition/FaceRecognition';

const app = new Clarifai.App({
  apiKey: 'bb8db6b05b7041538191ee6abfa694bb'
 });

const particlesOptions = {
    particles: {
      number:{
        value:50,
        density:{
          enable:true,
          value_area:800
        }
      }
    }
}
class App extends Component {
  constructor(){
    super();
    this.state ={
      input:'',
      imageUrl:'',
      box:{}
    }
  }
  calculateFaceLocation=(data)=> {
    const ClarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: ClarifaiFace.left_col * width,
      topRow: ClarifaiFace.top_row * height,
      rightCol: width - (ClarifaiFace.right_col * width),
      bottomRow: height - (ClarifaiFace.bottom_row * height)
    }

  }
  displayFaceBox=(box)=>{
    this.setState({box: box});
    console.log(box);
  }
  onButtonSubmit=(event)=>{
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL,
    this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }
  onInputChange=(event)=>{
    this.setState({input: event.target.value});
    console.log(event.target.value);
  }
  render() {
    return (
      <div className="App">
      <Particles className='particles' params={particlesOptions}/>
        <Navigation />
        <Logo />
        <Rank/>
        <ImageLinkForm 
          onButtonSubmit={this.onButtonSubmit} 
          onInputChange = {this.onInputChange}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        {/* {<Logo/>
        <ImageLinkForm/>
        <FaceRecognition/>} */}
      </div>
    );
  }
}

export default App;
