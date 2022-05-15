import { getAllBooks } from '../services/firebase/dataAccess';

const getAllStaticPaths = async () => {
  const books = await getAllBooks();
  return books.map((item) => ({
    params: { cid: item.id.toString() },
  }));
};

export default getAllStaticPaths;
