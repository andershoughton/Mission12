import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import BookList from './components/BookList';
import Cart from './components/Cart';
import AdminBooks from './components/AdminBooks';

function App() {
    const [savedPageNum, setSavedPageNum] = useState(1);

    return (
        <Routes>
            <Route path="/" element={
                <BookList
                    initialPage={savedPageNum}
                    onGoToCart={(currentPage) => setSavedPageNum(currentPage)}
                />
            } />
            <Route path="/cart" element={<Cart />
            } />
            <Route path="/adminbooks" element={<AdminBooks />} />
        </Routes>
    );
}

export default App;