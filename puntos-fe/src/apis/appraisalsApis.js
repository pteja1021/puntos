import axios from "axios";

const getAllAppraisals = async () => {
  const { data } = await axios.get(
    `http://localhost:3001/api/appraisals/getAllPraises`
  );
  return data;
};

const getAggregateAppraisals = async () => {
  const { data } = await axios.get(
    `http://localhost:3001/api/appraisals/aggregateAppraisals`
  );
  return data;
};

const filterAppraisalByDate = async ({ queryKey }) => {
  const { data } = await axios.get(
    `http://localhost:3001/api/appraisals/${queryKey[1]}/${queryKey[2]}/?type=${queryKey[3]}`
  );
  return data;
};

const getInsightsData = async () => {
  const {data} = await axios.get(
    "http://localhost:3001/api/appraisals/getInsightsData"
  )
  return data 
}

export { getAllAppraisals, getAggregateAppraisals, filterAppraisalByDate, getInsightsData };
