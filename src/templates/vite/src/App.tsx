import derivLogo from './static/deriv-logo.svg';

import './App.css';

function App() {
    return (
        <div className='flex flex-col items-center justify-center gap-10'>
            <a href='https://deriv.com' target='_blank' rel='noreferrer'>
                <img src={derivLogo} className='logo' alt='Deriv logo' />
            </a>
            <h1 className='text-5xl font-bold'>Deriv V2</h1>
            <button>Click me 💅</button>
            <p>
                Edit <code>src/App.tsx</code> and save to test HMR
            </p>
        </div>
    );
}

export default App;
