import { fetchData, createItem, removeItem } from "@/utils/requestHelper";

const FeedBackService = {
  addFeedBack: async (values) => {
    const formData = { ...values };
    return await createItem('/lab/v1/feedbacks', formData);
  },

  getFeedBack: async (id) => {
    return await fetchData(`/lab/v1/feedbacks/${id}`); 
  },

  deleteFeedBack: async (id) => {
    console.log("feedback id: ",id);        
    return await removeItem(`/lab/v1/feedbacks/${id}`);
  },

  searchFeedBacks: async (query) => {
    const response = await fetchData(`/lab/v1/feedbacks/search?keyword=${query.keyword}`); 
    return response; 
    
  }
};

export default FeedBackService;