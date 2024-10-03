// import React from "react"
// import ReactDOM from "react-dom/client"
// import { useState } from "react";
const {useState} = React;

// default styling for the main containers in the .views
const style = {
  width: "100%",
  height: "100%",
  display: "grid",
  justifyItems: "center",
  alignItems: "center",
  gap: "10px",
  padding: "10px",
};

const App = () => {
  
  //--------------------- COMPONENTS ---------------------//

  // Easiest way to create "page" like behaviour without using react-router
  // create a state for each .view file; Main.view default state will always be true
  const [currentView, setCurrentview] = useState("Main");

  // create a state for each property used in any set() uses with initial state as the declared property values
  const [picWidth, setPicWidth] = useState(200);
  const [picHeight, setPicHeight] = useState(200);

  const HomeButton = ({}) => (
    <button
      style={{
        color: "white",
        backgroundColor: "gray",
        width: "100px",
        height: "50px",
        cursor: "pointer",
      }}
      // onclick = open(Main.view)
      onClick={() => {
          setCurrentview("Home");
      }}
    >
      Home
    </button>
  );

  const AboutButton = () => (
    <button
      style={{
        color: "white",
        backgroundColor: "gray",
        width: "100px",
        height: "50px",
        cursor: "pointer",
      }}
      // onclick = open(About.view)
      onClick={() => {
          setCurrentview("About");
      }}
    >
      About
    </button>
  );

  const MyButton = ({ t }) => (
    <button
      style={{
        color: "white",
        backgroundColor: "gray",
        width: "75px",
        height: "25px",
        cursor: "pointer",
      }}
      // onclick = [set(pic.width, pic.width+10), set(pic.height, pic.height+10)]
      onClick={() => {
        setPicHeight(picHeight+10);
        setPicWidth(picWidth+10);
      }}
    >
      {t}
    </button>
  );

  const MyText = ({ t }) => (
    <p
      style={{
        color: "black",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {t}
    </p>
  );

  const MyPicture = ({ s }) => (
    <img
      src={s}
      alt={"Description"}
      style={{
        width: picWidth,
        height: picHeight,
        justifySelf: "right",
      }}
    >
    </img>
  );

  const Navbar = ({components}) => (
      <div
          style = {{
              display: "grid",
              justifyItems: "center",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              width: 300,
              height: 50,
              borderStyle: "solid",
              borderColor: "black",
              borderWidth: 1,
              gridAutoFlow: "column",
          }}
      >
          {components}
      </div>
  );

  const changePictureButtonText = <MyText t={"Change picture dimensions"} />;
  const hb = <HomeButton key={"hb"} />;
  const ab = <AboutButton key={"ab"} />;
  const nb = <Navbar components={[hb, ab]} />;
  const dp = <MyPicture s={"https://www.insidevancouver.ca/wp-content/uploads/2021/10/vimff-fs-2021-desire-lines-gallery-7.jpg"} />;

  //--------------------- PAGES ---------------------//

  const MainPage = () => (
    <div style={style}>
        {nb}
        <MyText t={"Welcome to my website!"} />
    </div>
  );

  const AboutPage = () => (
    <div style={style}>
        {nb}
        {dp}
        <MyButton t={changePictureButtonText} pic={dp}/>
    </div>
  );

  return (
    <div>
      {
          currentView === "About" ? (<AboutPage />) :
          currentView === "AnotherView" ? (<div />) :
          currentView === "AnotherView2" ? (<div />) :
          <MainPage/> // main is always the default
      }
    </div>
  );
};

// export default App;

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
ReactDOM.render(<App />, document.getElementById("root"));