import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';


interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

function BookList({ onGoToCart, initialPage = 1 }: { onGoToCart: (currentPage: number) => void, initialPage?: number }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNum, setPageNum] = useState(initialPage);
  const [pageSize, setPageSize] = useState(5);
  const [totalBooks, setTotalBooks] = useState(0);
  const [sortOrder, setSortOrder] = useState('asc');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addedMessage, setAddedMessage] = useState('');
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();
  const totalPages = Math.ceil(totalBooks / pageSize);

  // total items in cart for the summary badge
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // fetch categories once on load
  useEffect(() => {
    fetch('https://andersmission13-axd6egevbqf0cmg6.eastus-01.azurewebsites.net')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // fetch books whenever page, size, sort, or category changes
  useEffect(() => {
    const url = `https://andersmission13-axd6egevbqf0cmg6.eastus-01.azurewebsites.net/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}&category=${selectedCategory}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setBooks(data.books);
        setTotalBooks(data.totalBooks);
      })
      .catch(err => console.error('Error fetching books:', err));
  }, [pageNum, pageSize, sortOrder, selectedCategory]);

  function handleCategoryChange(cat: string) {
    setSelectedCategory(cat);
    setPageNum(1);
  }
  function handleAddToCart(book: Book) {
    addToCart({ bookId: book.bookId, title: book.title, price: book.price });
    setAddedMessage(`"${book.title}" added to cart!`);
    setTimeout(() => setAddedMessage(''), 2000);
  }
  return (
    <div className="container mt-4">

      {/* header row with title and cart summary */}
      <div className="row align-items-center mb-4">
        <div className="col">
          <h1>Online Bookstore</h1>
        </div>
        <div className="col-auto d-flex gap-2 align-items-center">
          <button
              className="btn btn-success position-relative"
              onClick={() => { onGoToCart(pageNum); navigate('/cart'); }}
          >
            🛒 Cart
            {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {cartCount}
        </span>
            )}
          </button>
          {cartCount > 0 && (
              <span className="ms-2 text-muted">
        {cartCount} item{cartCount > 1 ? 's' : ''} — ${cartTotal.toFixed(2)}
      </span>
          )}
          <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/adminbooks')}
          >
            Admin
          </button>
        </div>
      </div>
      {addedMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {addedMessage}
            <button type="button" className="btn-close" onClick={() => setAddedMessage('')}></button>
          </div>
      )}

      {/* category filter buttons */}
      <div className="mb-3">
        <button
          className={`btn btn-sm me-2 mb-2 ${selectedCategory === '' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => handleCategoryChange('')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`btn btn-sm me-2 mb-2 ${selectedCategory === cat ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* sort and page size controls */}
      <div className="d-flex gap-3 mb-3">
        <div>
          <label className="me-2">Sort by Title:</label>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              setPageNum(1);
            }}
          >
            {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
          </button>
        </div>
        <div>
          <label className="me-2">Results per page:</label>
          <select
            className="form-select form-select-sm d-inline-block w-auto"
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPageNum(1); }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={16}>All</option>
          </select>
        </div>
      </div>

      {/* books table */}
      <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
            <th>Add to Cart</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.classification}</td>
              <td>{book.category}</td>
              <td>{book.pageCount}</td>
              <td>${book.price.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleAddToCart(book)}
                >
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination */}
      <nav>
        <ul className="pagination">
          <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum(pageNum - 1)}>Previous</button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i + 1} className={`page-item ${pageNum === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPageNum(i + 1)}>{i + 1}</button>
            </li>
          ))}
          <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum(pageNum + 1)}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default BookList;
