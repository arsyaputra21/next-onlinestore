import { useRouter } from 'next/router';
import Image from 'next/image';
import MiniThumbnail from '../components/MiniThumbnail';
import LayoutNav from '../components/LayoutNav';
import { useState, useEffect, useContext } from 'react';
import CartModal from '../components/CartModal';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { Context } from '../store/AppContext';

const Details = (props) => {
  // const [bookDetails, setBookDetails] = useState({});
  // const [otherBooksData, setOtherBooksData] = useState([]);
  const { store, actions } = useContext(Context);
  const otherBooksData = props.resOther;
  const bookDetails = props.resDetail[0];
  const [showModal, setShowModal] = useState(false);
  // useEffect(async () => {
  //   const res = await fetch(
  //     `http://localhost:5000/details?id=${router.query.id}`
  //   );
  //   const [data] = await res.json();
  //   setBookDetails(data);
  //   console.log(data.image_product);
  // }, []);

  const handleAddToCart = () => {
    if (store.token && store.token != '' && store.token != undefined)
      setShowModal(true);
    else alert('please login or register first');
  };
  return (
    <>
      <LayoutNav user>
        <div className="p-4 md:grid md:grid-cols-2 row-span-2 md:gap-2 lg:gap-4 items-center">
          <div className="rounded-lg shadow-xl overflow-hidden backdrop-blur-md bg-white bg-opacity-5">
            <Image
              src={bookDetails.image_product}
              width={800}
              height={800}
              objectFit="contain"
              layout="responsive"
              alt="book cover"
            />
          </div>
          <div className="self-stretch space-y-3 md:space-y-0 md:grid md:items-center p-2 text-white rounded-lg md:border-2 md:border-purple-200 md:border-opacity-10">
            <div>
              <h1
                className={`${
                  bookDetails.nama.length > 15 && 'text-1xl md:text-3xl'
                } text-3xl md:text-6xl font-bold text-yellow-200`}
              >
                {bookDetails.nama}
              </h1>
              <p className="lg:text-lg text-gray-100">
                by {bookDetails.owner.toUpperCase()}
              </p>
              <p className="text-sm text-gray-300">
                Date Added : {bookDetails.tgl_input}
              </p>
            </div>
            <div className="">
              <p className="text-sm md:text-md overflow-scroll max-h-60 scrollbar-hide lg:text-xl">
                {bookDetails.deskripsi}
              </p>
            </div>
            <div>
              <p>Harga: </p>
              <p className="font-semibold text-2xl md:text-3xl">
                Rp{bookDetails.harga}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center justify-center">
              <button className="font-bold border-2 border-purple-400 hover:border-purple-600 rounded-lg p-2 text-purple-300 hover:text-purple-500 md:text-lg">
                Beli Sekarang
              </button>
              <button
                onClick={() => handleAddToCart()}
                className="border-2 border-purple-200 rounded-lg p-2 text-purple-200 hover:text-white md:text-lg"
              >
                Masukkan Keranjang
              </button>
            </div>
          </div>

          <p className="px-3 py-2 text-white text-xl">Buku lainnya</p>
          <div className="flex scrollbar-hide gap-3 p-3 col-span-2 overflow-y-scroll">
            {otherBooksData.map((book) => (
              <MiniThumbnail
                key={book.productID}
                bookId={book.productID}
                imgUrl={book.image_product}
                title={book.nama}
                price={book.harga}
              />
            ))}
          </div>
        </div>
      </LayoutNav>
      {showModal && (
        <button
          className="fixed bg-gray-900 text-gray-300 flex items-center justify-center p-2 bg-opacity-50 left-8 z-30 top-8 rounded-md group border-2 border-gray-400 hover:border-white hover:text-indigo-300"
          onClick={() => setShowModal(false)}
        >
          <ArrowLeftIcon className="h-8 w-8 " /> Back
        </button>
      )}

      <CartModal
        isShown={showModal}
        title={bookDetails.nama}
        imgUrl={bookDetails.image_product}
        dateAdded={bookDetails.tgl_input}
        available={bookDetails.jumlah}
        price={bookDetails.harga}
        bookId={bookDetails.productID}
      ></CartModal>
    </>
  );
};

export default Details;

export async function getServerSideProps(context) {
  const [requestDetail, requestOther] = await Promise.all([
    fetch(`http://127.0.0.1:5000/details?id=${context.query.id}`),
    fetch(`http://127.0.0.1:5000/books`),
  ]);
  const [resDetail, resOther] = await Promise.all([
    requestDetail.json(),
    requestOther.json(),
  ]);

  return { props: { resDetail, resOther } };
}
