// Function to retrieve data from local storage
export const getFromLocalStorage = (key) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return undefined;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Error getting data from local storage:", error);
    return undefined;
  }
};

// Function to save data to local storage
export const setLocalStorage = (key, data) => {
  try {
      localStorage.setItem(key, data);
  } catch (error) {
    console.error("Error saving data to local storage:", error);
  }
};
