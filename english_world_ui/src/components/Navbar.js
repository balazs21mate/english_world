import './navbar.css'

function Navbar(){
    return(
        <div className="navbar">
            <a href="/" className="logo">English world</a>
            <div className="menu">
                <a href="/"><i class="fa-solid fa-bars"></i></a>
                <a href="/">Cards</a>
                <a href="/">Practice</a>
            </div>
        </div>
    );
}

export default Navbar