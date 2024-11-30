import Layout from '../components/Layout/Layout';
import React from 'react';
import { useParams } from "react-router-dom";
import { useSearch } from '../context/search';
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
    const [search, setSearch] = useSearch();
    const [cart, setCart] = useCart();
    const navigate = useNavigate();

    // Add to cart function
    const AddtoCart = async (product) => {
      try {
        const userdata = localStorage.getItem("auth");
        if (userdata) {
          const User = JSON.parse(userdata).user;
          const payload = {
            product: product,
            user: User,
          };
          const { data } = await axios.post("/api/addto-cart", payload);
          setCart((prevCart) => [...prevCart, data]);
          toast.success("Item added to cart");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
        toast.error("Only normal users can add items to the cart.");
      }
    };

    return (
        <>
          <Layout title="Search Results">
            <div className="container">
              <h3>Search Results</h3>
              <h5>
                {search?.result.length < 1
                  ? "No Products Found"
                  : `Found ${search?.result.length} Products`}
              </h5>
              <div className="d-flex flex-wrap">
                {search?.result.map((p) => (
                  <div className="card m-2" style={{ width: "15rem" }} key={p._id}>
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      height={"150"}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">$ {p.price}</p>
                      <button
                        className="btn btn-secondary btn-sm ms-1"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button
                        className="btn btn-info btn-sm ms-1"
                        onClick={() => AddtoCart(p)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Layout>
        </>
    );
};

export default Search;
