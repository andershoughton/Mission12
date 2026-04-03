import { useEffect, useState } from 'react';
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

const emptyBook: Book = {
    bookId: 0,
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
};

function AdminBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newBook, setNewBook] = useState<Book>(emptyBook);
    const navigate = useNavigate();

    // fetch all books on load
    useEffect(() => {
        fetchBooks();
    }, []);

    function fetchBooks() {
        fetch('https://andersmission13-axd6egevbqf0cmg6.eastus-01.azurewebsites.net')
            .then(res => res.json())
            .then(data => setBooks(data.books));
    }

    function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this book?')) return;
        fetch(`https://andersmission13-axd6egevbqf0cmg6.eastus-01.azurewebsites.net/api/books/${id}`, { method: 'DELETE' })
            .then(() => fetchBooks());
    }

    function handleEdit(book: Book) {
        setEditingBook({ ...book });
    }

    function handleUpdate() {
        if (!editingBook) return;
        fetch(`https://andersmission13-axd6egevbqf0cmg6.eastus-01.azurewebsites.net/api/books/${editingBook.bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingBook),
        })
            .then(() => {
                setEditingBook(null);
                fetchBooks();
            });
    }

    function handleAdd() {
        fetch('https://andersmission13-axd6egevbqf0cmg6.eastus-01.azurewebsites.net/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBook),
        })
            .then(() => {
                setIsAdding(false);
                setNewBook(emptyBook);
                fetchBooks();
            });
    }

    return (
        <div className="container mt-4">
            <div className="row align-items-center mb-4">
                <div className="col">
                    <h1>Admin - Manage Books</h1>
                </div>
                <div className="col-auto d-flex gap-2">
                    <button className="btn btn-success" onClick={() => setIsAdding(true)}>
                        + Add Book
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>
                        Back to Bookstore
                    </button>
                </div>
            </div>

            {/* add book form */}
            {isAdding && (
                <div className="card mb-4 p-3">
                    <h5>Add New Book</h5>
                    <div className="row g-2">
                        {['title', 'author', 'publisher', 'isbn', 'classification', 'category'].map(field => (
                            <div className="col-md-4" key={field}>
                                <input
                                    className="form-control"
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={(newBook as any)[field]}
                                    onChange={e => setNewBook({ ...newBook, [field]: e.target.value })}
                                />
                            </div>
                        ))}
                        <div className="col-md-4">
                            <label className="form-label">Page Count</label>
                            <input
                                className="form-control"
                                placeholder="Page Count"
                                type="number"
                                value={newBook.pageCount}
                                onChange={e => setNewBook({ ...newBook, pageCount: Number(e.target.value) })}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Price</label>
                            <input
                                className="form-control"
                                placeholder="Price"
                                type="number"
                                value={newBook.price}
                                onChange={e => setNewBook({ ...newBook, price: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="mt-2 d-flex gap-2">
                        <button className="btn btn-primary" onClick={handleAdd}>Save</button>
                        <button className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* edit book form */}
            {editingBook && (
                <div className="card mb-4 p-3">
                    <h5>Edit Book</h5>
                    <div className="row g-2">
                        {['title', 'author', 'publisher', 'isbn', 'classification', 'category'].map(field => (
                            <div className="col-md-4" key={field}>
                                <input
                                    className="form-control"
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={(editingBook as any)[field]}
                                    onChange={e => setEditingBook({ ...editingBook, [field]: e.target.value })}
                                />
                            </div>
                        ))}
                        <div className="col-md-4">
                            <label className="form-label">Page Count</label>
                            <input
                                className="form-control"
                                placeholder="Page Count"
                                type="number"
                                value={newBook.pageCount}
                                onChange={e => setNewBook({ ...newBook, pageCount: Number(e.target.value) })}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Price</label>
                            <input
                                className="form-control"
                                placeholder="Price"
                                type="number"
                                value={newBook.price}
                                onChange={e => setNewBook({ ...newBook, price: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="mt-2 d-flex gap-2">
                        <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
                        <button className="btn btn-secondary" onClick={() => setEditingBook(null)}>Cancel</button>
                    </div>
                </div>
            )}

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
                    <th>Actions</th>
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
                            <div className="d-flex gap-1">
                                <button className="btn btn-warning btn-sm" onClick={() => handleEdit(book)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book.bookId)}>Delete</button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminBooks;