import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import Particles from 'react-particles-js';

const particlesOptions = {
  
    particles: {
      line_linked: {
        color:"#FFFFFF"
        },
      number:{
        value:150,
        density:{
          enable:true,
          value_area: 800
        }
      },
      size: {
        "value": 3
      }
    },
    interactivity: {
      events: {
          onhover: {
              enable: true,
              mode: "repulse"
          }
      }
  }
  }
const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSigneIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: ''
  }
}


class App extends Component {

  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user :{
      id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    
    const faces = data.outputs[0].data.regions.map(element => {
      return element.region_info.bounding_box;
    });

    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    const clarifaiFaces = faces.map(element => {
      return {
        leftCol: element.left_col * width,
        topRow: element.top_row * height,
        rightCol : width - (element.right_col * width),
        bottomRow : height - (element.bottom_row * height)
      }
    });

    return clarifaiFaces;
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState)
    } else if (route === 'home'){
      this.setState({isSigneIn: true})
    }
    this.setState({ route: route });
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));

  }

  render(){
    const { isSigneIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSigneIn={isSigneIn} onRouteChange={this.onRouteChange } />
        { route === 'home' 
        ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm  
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit} 
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>  
        : (
            route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange } />  
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange } />  
          )
          
        }
      </div>
    );
  } 
}

export default App;
