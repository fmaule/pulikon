import { FileUpload } from "./components/FileUpload";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Instagram Follower Analysis</h1>
        <p className="subtitle">
          Upload your Instagram export to analyze your followers
        </p>

        <div className="upload-section">
          <FileUpload />
        </div>
      </header>
    </div>
  );
}

export default App;
