import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  // calculate total price
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Your Cart</h1>

      {cart.length === 0 ? (
          <div>
            <p>Your cart is empty.</p>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Back to Books
            </button>
          </div>
      ) : (
        <>
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.bookId}>
                  <td>{item.title}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-end fw-bold">Total:</td>
                <td className="fw-bold">${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="d-flex gap-2">
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
            <button className="btn btn-danger" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
