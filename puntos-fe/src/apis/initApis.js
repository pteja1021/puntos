import axios from "axios";

const checkIfPresent = async () => {
  const { data } = await axios.get("http://localhost:3001/api/init/");
  return data;
};
export { checkIfPresent };
