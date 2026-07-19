import "./App.css";
function App(){
    const userName = "Adwitiya";
    const handleclick = () => {
        alert(`Hello ${userName}! Welcome to React`);
    };
    return(
        <div className="container">
            <header className="header">
                <h1>My React Homepage</h1>
            </header>

            <main className="main">
                <h2>Welcome, {userName}!</h2>
                <p>This is a simple React Homepage</p>
                <button onClick={handleclick}>Click Me</button>
            </main>

            <footer className="footer">
                <p>2026 Adwitiya. All rights reserved</p>
            </footer>
        </div>
    );
}
export default App;