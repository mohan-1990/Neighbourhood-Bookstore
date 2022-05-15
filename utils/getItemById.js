import { getBookById } from '../services/firebase/dataAccess';

const getItemById = async (itemId) => {
  const book = await getBookById(parseInt(itemId));
  return book;
};

export default getItemById;
