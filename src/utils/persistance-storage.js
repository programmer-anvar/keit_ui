export const setItem = (key, data) => {
  try {
    localStorage.setItem(key, data);
  } catch (error) {
    console.log("Error setting local data");
  }
};

export const getItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.log("Error getting local data");
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.log("Error removing local data");
  }
};

export const setItemSession = (key, data) => {
  try {
    sessionStorage.setItem(key, data);
  } catch (error) {
    console.log("Error setting local data");
  }
};

export const getItemSession = (key) => {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.log("Error getting local data");
  }
};

export const removeItemSession = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.log("Error removing local data");
  }
};
